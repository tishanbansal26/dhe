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

    // 1. Fetch import details
    const { data: importJob, error } = await supabase
      .from('product_ai_imports')
      .select('*')
      .eq('id', import_id)
      .single();

    if (error || !importJob) throw new Error('Import job not found');

    const productName = importJob.input_product_name || 'Unknown Insurance Product';
    const insurer = importJob.input_insurer || '';
    const urls = importJob.input_urls || [];
    
    // Construct context
    let contextStr = `Product Name: ${productName}\nInsurer: ${insurer}\n`;
    if (urls.length > 0) {
      contextStr += `Prioritize these official URLs: ${urls.join(', ')}\n`;
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      tools: [{ googleSearch: {} }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = getExtractionPrompt('WEB', contextStr) + 
      `\n\nUse Google Search to look up official facts about this specific policy name (${productName} by ${insurer}). Prioritize the official insurer website. Do not invent details.`;

    // 2. Call Gemini
    const result = await model.generateContent(prompt);
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
          source_type: 'OFFICIAL_INSURER', // Assumed for web search if grounding succeeds
          source_url: 'Google Search / Web', 
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
             source_type: 'OFFICIAL_INSURER',
             source_url: 'Google Search / Web',
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

    // 4. Trigger next step (Document Processing) if there are documents, else trigger CONFLICT resolution
    if (importJob.total_documents > 0) {
       await supabase.from('product_ai_imports').update({ status: 'PROCESSING_DOCUMENTS' }).eq('id', import_id);
       await supabase.functions.invoke('ai-document-processor', { body: { import_id } });
    } else {
       // Skip directly to conflict/validation since there are no documents
       await supabase.from('product_ai_imports').update({ status: 'DETECTING_CONFLICTS' }).eq('id', import_id);
       // Here you would trigger the conflict resolver, but we can just mark it ready for now
       await supabase.from('product_ai_imports').update({ status: 'READY_FOR_REVIEW' }).eq('id', import_id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Web researcher error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
