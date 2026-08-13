import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    
    let toEmail = "";
    let subject = "";
    let htmlBody = "";

    // 1. Handle New Lead
    if (payload.table === 'leads' && payload.type === 'INSERT') {
      const lead = payload.record;
      
      // Pull admin email from environment variables, fallback to owner's email
      toEmail = Deno.env.get("ADMIN_EMAIL") || "ertishanbansal@gmail.com"; 
      subject = `New Lead Received: ${lead.plan_interest}`;
      htmlBody = `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${lead.name || 'Anonymous'}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Age:</strong> ${lead.age || 'N/A'}</p>
        <p><strong>Plan Interest:</strong> ${lead.plan_interest}</p>
        <p><strong>PIN:</strong> ${lead.pincode}</p>
        <br/>
        <p>Please log in to the Admin/Agent portal to view and assign this lead.</p>
      `;
    } 
    // 2. Handle New Claim
    else if (payload.table === 'claims' && payload.type === 'INSERT') {
      const claim = payload.record;
      
      let customerEmail = "customer@example.com"; // Fallback
      if (claim.customer_id) {
          const { data } = await supabaseAdmin.auth.admin.getUserById(claim.customer_id);
          if (data?.user?.email) {
              customerEmail = data.user.email;
          }
      }

      toEmail = customerEmail;
      subject = `Claim Received - Ref: ${claim.reference_number || claim.id.substring(0, 8)}`;
      htmlBody = `
        <h2>Claim Successfully Filed</h2>
        <p>Hello,</p>
        <p>Your claim has been successfully submitted to our system.</p>
        <p><strong>Claim Reference:</strong> ${claim.reference_number || claim.id}</p>
        <p><strong>Type:</strong> ${claim.claim_type || claim.type}</p>
        <p><strong>Status:</strong> ${claim.status}</p>
        <br/>
        <p>Our support team will review this shortly. You can track the status of your claim in your dashboard.</p>
        <br/>
        <p>Thank you,<br/>Radhe Investments</p>
      `;
    } else {
      return new Response(JSON.stringify({ message: "Unsupported table or action" }), { status: 400 });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Radhe Investments <notifications@radheinv.site>",
        to: [toEmail],
        subject: subject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resend API Error: ${errorText}`);
    }

    const resData = await res.json();
    return new Response(JSON.stringify({ success: true, id: resData.id }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
