import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai'
import { getExtractionPrompt } from '../_shared/ai_schema.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    const body = await req.json();
    const { import_id } = body;

    if (!import_id) throw new Error('import_id required');

    // 1. Fetch import details and associated documents
    const { data: importJob, error } = await supabase
      .from('product_ai_imports')
      .select('*')
      .eq('id', import_id)
      .single();

    if (error || !importJob) throw new Error('Import job not found');

    const { data: documents } = await supabase
      .from('product_documents')
      .select('*')
      .eq('import_id', import_id);

    if (!documents || documents.length === 0) {
      // Skip to review if no documents
       await supabase.from('product_ai_imports').update({ status: 'READY_FOR_REVIEW' }).eq('id', import_id);
       return new Response(JSON.stringify({ success: true }));
    }

    // For this prototype, we'll process the first document. 
    // In production, this would map over all documents and merge.
    const primaryDoc = documents[0];
    
    // Download document from storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('product_documents')
      .download(primaryDoc.file_url);
      
    if (fileError) throw fileError;

    const fileBuffer = await fileData.arrayBuffer();
    const mimeType = primaryDoc.file_type || 'application/pdf';

    // Call Gemini File API or inline depending on size. We'll use inline base64 for now, 
    // assuming reasonable file sizes. For huge PDFs, use File API.
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const contextStr = `Product Name: ${importJob.input_product_name}\nInsurer: ${importJob.input_insurer}\n`;
    const prompt = getExtractionPrompt('DOCUMENT', contextStr);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: btoa(String.fromCharCode(...new Uint8Array(fileBuffer))),
          mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    const parsedData = JSON.parse(text);

    // 3. Process and insert extractions
    const extractionsToInsert = [];
    const processField = (path: string, obj: any) => {
      if (!obj) return;
      if (obj.value !== undefined) {
        extractionsToInsert.push({
          import_id,
          field_path: path,
          value: JSON.stringify(obj.value),
          confidence: obj.confidence || null,
          source_type: 'OFFICIAL_DOCUMENT',
          source_url: primaryDoc.file_name,
          source_snippet: obj.source_snippet || null,
          verification_status: (obj.confidence && obj.confidence < 80) ? 'NEEDS_REVIEW' : 'AI_EXTRACTED'
        });
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
           extractionsToInsert.push({
             import_id,
             field_path: `${path}[${index}]`,
             value: JSON.stringify(item),
             confidence: item.confidence || null,
             source_type: 'OFFICIAL_DOCUMENT',
             source_url: primaryDoc.file_name,
             source_snippet: item.source_snippet || null,
             verification_status: 'NEEDS_REVIEW'
           });
        });
      }
    };

    processField('name', parsedData.name);
    processField('category', parsedData.category);
    processField('description', parsedData.description);
    processField('image_keywords', parsedData.image_keywords);
    
    if (parsedData.coverage) {
      Object.keys(parsedData.coverage).forEach(key => processField(`coverage.${key}`, parsedData.coverage[key]));
    }
    if (parsedData.eligibility) {
      Object.keys(parsedData.eligibility).forEach(key => processField(`eligibility.${key}`, parsedData.eligibility[key]));
    }
    if (parsedData.premium_data) {
      Object.keys(parsedData.premium_data).forEach(key => processField(`premium_data.${key}`, parsedData.premium_data[key]));
    }
    processField('benefits', parsedData.benefits);
    processField('waiting_periods', parsedData.waiting_periods);
    processField('exclusions', parsedData.exclusions);
    processField('highlights', parsedData.highlights);
    processField('faqs', parsedData.faqs);
    processField('premium_tables', parsedData.premium_tables);

    if (extractionsToInsert.length > 0) {
      await supabase.from('product_ai_extractions').insert(extractionsToInsert);
    }

    // 4. Update state to DETECTING_CONFLICTS / READY_FOR_REVIEW
    await supabase.from('product_ai_imports').update({ status: 'DETECTING_CONFLICTS' }).eq('id', import_id);
    await supabase.from('product_ai_imports').update({ status: 'READY_FOR_REVIEW' }).eq('id', import_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Document processor error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
