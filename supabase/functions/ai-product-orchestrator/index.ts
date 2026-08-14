import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js'

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

    const body = await req.json();
    const { import_id } = body;

    if (!import_id) {
      throw new Error('import_id is required');
    }

    // Update status to RESEARCHING_WEB
    await supabase.from('product_ai_imports').update({ status: 'RESEARCHING_WEB' }).eq('id', import_id);

    // Call ai-web-researcher asynchronously
    // This is a placeholder for triggering the next step in the async pipeline.
    supabase.functions.invoke('ai-web-researcher', {
      body: { import_id }
    }).catch(err => console.error("Web researcher failed:", err));

    return new Response(JSON.stringify({ success: true, message: "Job queued" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Orchestrator error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
