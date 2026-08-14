import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.14.0";
import { encode } from "https://deno.land/std@0.192.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer, accept',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Server configuration error: Gemini API key is missing.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Extract authorization from request to ensure caller is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { import_id, product_id, documents } = await req.json();

    if (!import_id || !documents || documents.length === 0) {
      throw new Error('Missing import_id or documents payload');
    }

    // 1. Update status to PROCESSING
    await supabase.from('product_ai_imports').update({ status: 'PROCESSING' }).eq('id', import_id);

    // 2. Fetch documents from storage
    const fileParts = [];
    for (const doc of documents) {
      const { data, error } = await supabase.storage.from('policy-documents').download(doc);
      if (error) {
        console.error(`Failed to download ${doc}:`, error);
        continue;
      }
      
      const buffer = await data.arrayBuffer();
      const base64Data = encode(buffer);
      
      fileParts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf' // Assuming PDF for now, expand later
        }
      });
    }

    if (fileParts.length === 0) {
      throw new Error('Could not read any valid documents from storage.');
    }

    // 3. Update status to EXTRACTING
    await supabase.from('product_ai_imports').update({ status: 'EXTRACTING' }).eq('id', import_id);

    // 4. Call Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert insurance data extractor.
Read the provided insurance policy document/brochure.
Extract the following information perfectly and return it ONLY as a JSON object matching this schema.
Include a "confidence" score (0-100) and the "source_page" number for every nested extracted field based on how clearly it was stated in the document.
If a field is not found, leave its value null or empty, but still include the field.

{
  "name": { "value": "String", "confidence": Number, "source_page": Number },
  "category": { "value": "String", "confidence": Number, "source_page": Number },
  "description": { "value": "String", "confidence": Number, "source_page": Number },
  "coverage": {
    "roomRent": { "value": "String", "confidence": Number, "source_page": Number },
    "icuLimit": { "value": "String", "confidence": Number, "source_page": Number },
    "preHospitalization": { "value": "String", "confidence": Number, "source_page": Number },
    "postHospitalization": { "value": "String", "confidence": Number, "source_page": Number },
    "ambulance": { "value": "String", "confidence": Number, "source_page": Number },
    "noClaimBonus": { "value": "String", "confidence": Number, "source_page": Number }
  },
  "eligibility": {
    "minAgeAdult": { "value": "String", "confidence": Number, "source_page": Number },
    "maxAge": { "value": "String", "confidence": Number, "source_page": Number },
    "minAgeChild": { "value": "String", "confidence": Number, "source_page": Number }
  },
  "premium_data": {
    "startingPremium": { "value": "Number", "confidence": Number, "source_page": Number }
  },
  "benefits": [
    { "name": "String", "description": "String", "confidence": Number, "source_page": Number }
  ],
  "waiting_periods": [
    { "name": "String", "duration": "String", "confidence": Number, "source_page": Number }
  ],
  "exclusions": [
    { "name": "String", "source_page": Number }
  ]
}`;

    const result = await model.generateContent([prompt, ...fileParts]);
    const response = await result.response;
    const text = response.text();
    
    const parsedData = JSON.parse(text);

    // 5. Update status to VALIDATING
    await supabase.from('product_ai_imports').update({ status: 'VALIDATING' }).eq('id', import_id);

    // 6. Save extracted fields into product_ai_extractions
    const extractionsToInsert = [];
    
    // Helper function to flatten and format JSON for insertion
    const processField = (path, obj, sourceDoc) => {
      if (!obj) return;
      if (obj.value !== undefined) {
        extractionsToInsert.push({
          import_id,
          field_path: path,
          value: JSON.stringify(obj.value),
          confidence: obj.confidence || null,
          source_document: sourceDoc,
          source_page: obj.source_page || null,
          verification_status: (obj.confidence && obj.confidence < 80) ? 'NEEDS_REVIEW' : 'NEEDS_REVIEW'
        });
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
           extractionsToInsert.push({
             import_id,
             field_path: `${path}[${index}]`,
             value: JSON.stringify(item),
             confidence: item.confidence || null,
             source_document: sourceDoc,
             source_page: item.source_page || null,
             verification_status: 'NEEDS_REVIEW'
           });
        });
      }
    };

    processField('name', parsedData.name, documents[0]);
    processField('category', parsedData.category, documents[0]);
    processField('description', parsedData.description, documents[0]);
    
    if (parsedData.coverage) {
      Object.keys(parsedData.coverage).forEach(key => {
        processField(`coverage.${key}`, parsedData.coverage[key], documents[0]);
      });
    }
    if (parsedData.eligibility) {
      Object.keys(parsedData.eligibility).forEach(key => {
        processField(`eligibility.${key}`, parsedData.eligibility[key], documents[0]);
      });
    }
    if (parsedData.premium_data) {
      Object.keys(parsedData.premium_data).forEach(key => {
        processField(`premium_data.${key}`, parsedData.premium_data[key], documents[0]);
      });
    }
    processField('benefits', parsedData.benefits, documents[0]);
    processField('waiting_periods', parsedData.waiting_periods, documents[0]);
    processField('exclusions', parsedData.exclusions, documents[0]);

    if (extractionsToInsert.length > 0) {
      await supabase.from('product_ai_extractions').insert(extractionsToInsert);
    }

    // 7. Update status to REVIEW_REQUIRED
    await supabase.from('product_ai_imports').update({ status: 'REVIEW_REQUIRED' }).eq('id', import_id);

    return new Response(JSON.stringify({ success: true, import_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("AI processing error:", error);
    
    // Attempt to parse body to get import_id for failure update
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.json();
      if (body.import_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from('product_ai_imports').update({ status: 'FAILED' }).eq('id', body.import_id);
      }
    } catch (e) {
      // Ignore
    }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Return 200 so the frontend can read the JSON error message instead of throwing a generic 500 error
    });
  }
});
