-- Migration to upgrade insurance_plans for the Policy Product Builder
-- Adds structured JSONB columns for advanced knowledge base capabilities

-- 1. Add new columns to insurance_plans
ALTER TABLE public.insurance_plans 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS coverage JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS eligibility JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS premium_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS riders JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS waiting_periods JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS claim_process JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS renewal_rules JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS seo_metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ai_metadata JSONB DEFAULT '{}'::jsonb;

-- Ensure existing plans are marked as published to not break current UI
UPDATE public.insurance_plans SET status = 'published' WHERE status = 'draft';

-- 2. Create product_documents table
CREATE TABLE IF NOT EXISTS public.product_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.insurance_plans(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    document_type TEXT NOT NULL, -- e.g., 'brochure', 'policy_wording', 'claim_form'
    version TEXT,
    is_public BOOLEAN DEFAULT false,
    ai_processed BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS for product_documents
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public documents" 
ON public.product_documents FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admins can manage product documents" 
ON public.product_documents FOR ALL 
TO authenticated 
USING (public.get_auth_role() IN ('super_admin', 'admin', 'agent'));

-- Trigger for updated_at
CREATE TRIGGER update_product_documents_updated_at 
BEFORE UPDATE ON public.product_documents 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
