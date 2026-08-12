import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, role, name, type, gwp, company_name } = await req.json();

    if (!email || !role || !name) {
      throw new Error('Email, role, and name are required.');
    }

    // 1. Create Supabase client with the SERVICE_ROLE key for admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Verify that the user calling this function is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create a regular client using the user's token to check their identity
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if caller is admin (metadata)
    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'super_admin';
    if (!isAdmin) {
        // Fallback to checking the public.users table just in case
        const { data: userData } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single();
        if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
            throw new Error('Forbidden: Only admins can invite employees');
        }
    }

    // 3. Invite the new user!
    console.log(`Inviting ${email} as ${role}...`);
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          role: role,
          name: name
        }
      }
    );

    if (inviteError) {
      console.error("Error inviting user:", inviteError);
      throw inviteError;
    }

    const newUserId = inviteData.user.id;

    // 4. Also insert them into the agents table so they show up on the dashboard
    if (['agent', 'staff', 'admin'].includes(role)) {
        const { error: agentError } = await supabaseAdmin.from('agents').insert([
            {
                user_id: newUserId,
                name: name,
                status: 'active',
                gwp: gwp || '₹0',
                company_name: Array.isArray(company_name) ? company_name : (company_name ? [company_name] : [])
            }
        ]);
        if (agentError) {
            console.error("Error creating agent record:", agentError);
            // We don't throw here because the invite succeeded
        }
    }

    return new Response(
      JSON.stringify({ message: "Employee invited successfully", user: inviteData.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Edge Function Error:", error);
    
    // Add detailed error properties if available
    const errorMsg = error.message || String(error);
    const errorStatus = error.status || 400;

    return new Response(
      JSON.stringify({ error: errorMsg, details: error }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: errorStatus,
      }
    );
  }
});
