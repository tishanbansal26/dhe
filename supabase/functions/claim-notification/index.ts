import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()

    // We only care about UPDATE events on the claims table
    if (payload.type !== 'UPDATE') {
      return new Response(JSON.stringify({ message: 'Not an update event' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const newRecord = payload.record
    const oldRecord = payload.old_record

    // Check if status changed
    if (newRecord.status === oldRecord.status) {
      return new Response(JSON.stringify({ message: 'Status unchanged' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const customerEmail = 'customer@example.com' // In reality, fetch from Supabase auth.users

    const htmlContent = `
      <h2>Claim Status Update</h2>
      <p>Your claim (ID: ${newRecord.id}) status has been updated to: <strong>${newRecord.status}</strong></p>
      <p>Amount: $${newRecord.amount}</p>
      <p>Thank you for choosing Radhe Investments.</p>
    `

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Radhe Investments <updates@resend.dev>',
        to: [customerEmail],
        subject: `Claim Update: ${newRecord.status}`,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
