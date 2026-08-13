-- 1. Redefine Functions as SECURITY DEFINER to avoid RLS recursion
DROP FUNCTION IF EXISTS public.get_auth_role();
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

DROP FUNCTION IF EXISTS public.get_agent_id();
CREATE OR REPLACE FUNCTION public.get_agent_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id FROM public.agents WHERE user_id = auth.uid() LIMIT 1;
$$;

DROP FUNCTION IF EXISTS public.get_customer_id();
CREATE OR REPLACE FUNCTION public.get_customer_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id FROM public.customers WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2. Clean up ALL existing problematic policies to reset state
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

DROP POLICY IF EXISTS "Admin manage policies" ON public.policies;
DROP POLICY IF EXISTS "Agents can view assigned policies" ON public.policies;
DROP POLICY IF EXISTS "Agents view assigned policies" ON public.policies;
DROP POLICY IF EXISTS "Customers can view their own policies" ON public.policies;
DROP POLICY IF EXISTS "Customers view own policies" ON public.policies;

-- 3. Create Clean Policies for Users Table
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (get_auth_role() IN ('super_admin', 'admin', 'staff'));

CREATE POLICY "Users can view their own profile"
ON public.users FOR SELECT
USING (id = auth.uid());

-- 4. Create Clean Policies for Policies Table
CREATE POLICY "Admin manage policies"
ON public.policies FOR ALL
USING (get_auth_role() IN ('super_admin', 'admin', 'staff'));

CREATE POLICY "Agents view assigned policies"
ON public.policies FOR SELECT
USING (agent_id = get_agent_id());

CREATE POLICY "Customers view own policies"
ON public.policies FOR SELECT
USING (customer_id = get_customer_id());

-- 5. Fix Schema & Policy Mismatch for Audit Logs
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert own audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 6. Leads Backend Validation
ALTER TABLE public.leads ADD CONSTRAINT leads_name_length CHECK (char_length(trim(name)) >= 2);
ALTER TABLE public.leads ADD CONSTRAINT leads_phone_format CHECK (phone ~ '^[0-9]{10}$');
ALTER TABLE public.leads ADD CONSTRAINT leads_age_minimum CHECK (age >= 18);
ALTER TABLE public.leads ADD CONSTRAINT leads_pincode_format CHECK (pincode ~ '^[0-9]{6}$');

-- Duplicate Lead Prevention via Trigger (Throttle / Prevent duplicate in last 24 hrs)
CREATE OR REPLACE FUNCTION prevent_duplicate_lead()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.leads
    WHERE phone = NEW.phone 
      AND plan_interest = NEW.plan_interest
      AND created_at >= NOW() - INTERVAL '24 hours'
  ) THEN
    RAISE EXCEPTION 'Duplicate lead submission within 24 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_duplicate_lead ON public.leads;
CREATE TRIGGER trg_prevent_duplicate_lead
BEFORE INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_lead();

-- 7. Financial Constraints
ALTER TABLE public.policies ADD CONSTRAINT policies_sum_insured_positive CHECK (sum_insured >= 0);
ALTER TABLE public.claims ADD CONSTRAINT claims_amount_positive CHECK (claim_amount >= 0);
