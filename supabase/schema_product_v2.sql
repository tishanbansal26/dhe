-- Final Policy Product Builder Architecture Upgrade

-- 1. Enum for status if not already enforced
-- We'll just use text with check constraints to avoid complex enum migrations on production.
ALTER TABLE public.insurance_plans
ADD CONSTRAINT valid_status_check 
CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived'));

-- Ensure status has a default
ALTER TABLE public.insurance_plans
ALTER COLUMN status SET DEFAULT 'draft';

-- Fix existing null statuses to draft
UPDATE public.insurance_plans SET status = 'draft' WHERE status IS NULL;

-- 2. New tables for AI Pipeline and Document Security

CREATE TABLE IF NOT EXISTS public.product_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.insurance_plans(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'Brochure', 'Policy Wording', 'Prospectus', etc.
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.product_ai_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.insurance_plans(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'UPLOADING', 'PROCESSING', 'EXTRACTING', 'VALIDATING', 'REVIEW_REQUIRED', 'COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED')),
    documents JSONB, -- list of document paths being processed
    pages_processed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.product_ai_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id UUID REFERENCES public.product_ai_imports(id) ON DELETE CASCADE,
    field_path TEXT NOT NULL,
    value JSONB,
    confidence INTEGER,
    source_document TEXT,
    source_page INTEGER,
    source_snippet TEXT,
    verification_status TEXT DEFAULT 'NEEDS_REVIEW' CHECK (verification_status IN ('NEEDS_REVIEW', 'APPROVED', 'REJECTED', 'CONFLICT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. RLS Policies

-- Secure insurance_plans
-- DROP the existing insecure public policy
DROP POLICY IF EXISTS "Public read plans" ON public.insurance_plans;

-- Recreate policy so ONLY published and active plans are visible to the public
CREATE POLICY "Public read plans" ON public.insurance_plans
FOR SELECT
TO public
USING (status = 'published' AND active = true);

-- product_documents RLS
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public documents" ON public.product_documents
FOR SELECT
TO public
USING (is_public = true);

CREATE POLICY "Admins can manage documents" ON public.product_documents
FOR ALL
TO authenticated
USING (get_auth_role() IN ('super_admin', 'admin', 'staff'));

-- product_ai_imports RLS
ALTER TABLE public.product_ai_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage AI imports" ON public.product_ai_imports
FOR ALL
TO authenticated
USING (get_auth_role() IN ('super_admin', 'admin'));

-- product_ai_extractions RLS
ALTER TABLE public.product_ai_extractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage AI extractions" ON public.product_ai_extractions
FOR ALL
TO authenticated
USING (get_auth_role() IN ('super_admin', 'admin'));

-- Enable realtime for AI imports to stream status updates to UI
ALTER PUBLICATION supabase_realtime ADD TABLE product_ai_imports;
