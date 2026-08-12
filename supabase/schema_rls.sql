-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;

-- Security Definer Functions for Role and IDs
CREATE OR REPLACE FUNCTION public.get_auth_role() 
RETURNS text LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_agent_id() 
RETURNS uuid LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.agents WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_customer_id() 
RETURNS uuid LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.customers WHERE user_id = auth.uid();
$$;

-- Generic Admin Access (Can be applied to most tables)
-- For this setup, we'll write explicit policies per table.

-- 1. Users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT TO authenticated USING (id = (select auth.uid()));
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 2. Customers
CREATE POLICY "Customers view own profile" ON public.customers FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Agents view assigned customers" ON public.customers FOR SELECT TO authenticated USING (agent_id = public.get_agent_id());
CREATE POLICY "Admin view all customers" ON public.customers FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 3. Agents
CREATE POLICY "Agents view own profile" ON public.agents FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Agents view team" ON public.agents FOR SELECT TO authenticated USING (parent_id = public.get_agent_id() OR id = public.get_agent_id());
CREATE POLICY "Admin view all agents" ON public.agents FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 4. Insurance Companies & Plans (Public read)
CREATE POLICY "Public read companies" ON public.insurance_companies FOR SELECT USING (true);
CREATE POLICY "Admin manage companies" ON public.insurance_companies FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin'));

CREATE POLICY "Public read plans" ON public.insurance_plans FOR SELECT USING (true);
CREATE POLICY "Admin manage plans" ON public.insurance_plans FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin'));

-- 6. Policies
CREATE POLICY "Customers view own policies" ON public.policies FOR SELECT TO authenticated USING (customer_id = public.get_customer_id());
CREATE POLICY "Agents view assigned policies" ON public.policies FOR SELECT TO authenticated USING (agent_id = public.get_agent_id());
CREATE POLICY "Admin manage policies" ON public.policies FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 7. Claims
CREATE POLICY "Customers view own claims" ON public.claims FOR SELECT TO authenticated USING (customer_id = public.get_customer_id());
CREATE POLICY "Customers can insert own claims" ON public.claims FOR INSERT TO authenticated WITH CHECK (customer_id = public.get_customer_id());
CREATE POLICY "Agents view assigned claims" ON public.claims FOR SELECT TO authenticated USING (policy_id IN (SELECT id FROM public.policies WHERE agent_id = public.get_agent_id()));
CREATE POLICY "Admin manage claims" ON public.claims FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 8. Renewals
CREATE POLICY "Customers view own renewals" ON public.renewals FOR SELECT TO authenticated USING (policy_id IN (SELECT id FROM public.policies WHERE customer_id = public.get_customer_id()));
CREATE POLICY "Agents view assigned renewals" ON public.renewals FOR SELECT TO authenticated USING (agent_id = public.get_agent_id());
CREATE POLICY "Admin manage renewals" ON public.renewals FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 9. Documents
CREATE POLICY "Customers view own docs" ON public.documents FOR SELECT TO authenticated USING (customer_id = public.get_customer_id());
CREATE POLICY "Customers insert own docs" ON public.documents FOR INSERT TO authenticated WITH CHECK (customer_id = public.get_customer_id());
CREATE POLICY "Agents view assigned docs" ON public.documents FOR SELECT TO authenticated USING (customer_id IN (SELECT id FROM public.customers WHERE agent_id = public.get_agent_id()));
CREATE POLICY "Admin manage docs" ON public.documents FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 10. Quote Requests
CREATE POLICY "Public insert quotes" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own quotes" ON public.quote_requests FOR SELECT TO authenticated USING (customer_id = public.get_customer_id());
CREATE POLICY "Agents view assigned quotes" ON public.quote_requests FOR SELECT TO authenticated USING (agent_id = public.get_agent_id());
CREATE POLICY "Admin manage quotes" ON public.quote_requests FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 11. Leads
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents view and update assigned leads" ON public.leads FOR SELECT TO authenticated USING (agent_id = public.get_agent_id());
CREATE POLICY "Agents update assigned leads" ON public.leads FOR UPDATE TO authenticated USING (agent_id = public.get_agent_id()) WITH CHECK (agent_id = public.get_agent_id());
CREATE POLICY "Admin manage leads" ON public.leads FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 12. Follow Ups
CREATE POLICY "Agents manage own follow ups" ON public.follow_ups FOR ALL TO authenticated USING (agent_id = public.get_agent_id());
CREATE POLICY "Admin manage follow ups" ON public.follow_ups FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- 13. Notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));

-- 14. Audit Logs
CREATE POLICY "Admin view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin'));
CREATE POLICY "System insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- 15. Marketing Assets
CREATE POLICY "Authenticated users view marketing assets" ON public.marketing_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage marketing assets" ON public.marketing_assets FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin'));

-- 16. Hospitals
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Admin manage hospitals" ON public.hospitals FOR ALL TO authenticated USING (public.get_auth_role() IN ('super_admin', 'admin'));
