-- AI Agent Schema Upgrade
-- Run this in your Supabase SQL Editor

-- 1. Enhance product_ai_imports
ALTER TABLE product_ai_imports ADD COLUMN IF NOT EXISTS input_product_name TEXT;
ALTER TABLE product_ai_imports ADD COLUMN IF NOT EXISTS input_insurer TEXT;
ALTER TABLE product_ai_imports ADD COLUMN IF NOT EXISTS input_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE product_ai_imports ADD COLUMN IF NOT EXISTS input_documents JSONB DEFAULT '[]'::jsonb;
ALTER TABLE product_ai_imports ADD COLUMN IF NOT EXISTS total_documents INTEGER DEFAULT 0;
ALTER TABLE product_ai_imports ADD COLUMN IF NOT EXISTS total_pages INTEGER DEFAULT 0;
-- Status is already a TEXT column, but we will now support new states like 'RESEARCHING_WEB', etc.

-- 2. Enhance product_ai_extractions
ALTER TABLE product_ai_extractions ADD COLUMN IF NOT EXISTS source_type TEXT; -- e.g., 'OFFICIAL_INSURER', 'OFFICIAL_DOCUMENT'
ALTER TABLE product_ai_extractions ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE product_ai_extractions ADD COLUMN IF NOT EXISTS source_snippet TEXT;

-- 3. Create product_documents (for tracking uploaded PDFs/Files per import)
CREATE TABLE IF NOT EXISTS product_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES insurance_plans(id) ON DELETE CASCADE,
    import_id UUID REFERENCES product_ai_imports(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_url TEXT NOT NULL,
    page_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create product_media (for tracking discovered images and rights)
CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES insurance_plans(id) ON DELETE CASCADE,
    import_id UUID REFERENCES product_ai_imports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    source_type TEXT NOT NULL, -- e.g., 'USER_UPLOADED', 'OFFICIAL_INSURER_ASSET'
    source_url TEXT,
    suggested_use TEXT, -- e.g., 'HERO', 'BENEFIT'
    rights_status TEXT NOT NULL, -- e.g., 'LICENSED', 'UNKNOWN_RIGHTS'
    status TEXT DEFAULT 'PENDING_REVIEW', -- 'KEEP', 'REJECT'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Ensure you have created a Storage Bucket named 'product_documents' to hold the uploaded PDFs.
