import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nzdqkfxjotdicmkfvfom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZHFrZnhqb3RkaWNta2Z2Zm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDQzMjYsImV4cCI6MjEwMTgyMDMyNn0.kZ61mSMtyDJQ3MiexTkwFyKYbdIEUi_Eza5xgpJdS-g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('--- STARTING FINAL ACCEPTANCE AUDIT TESTS ---\n');
  
  // 1. Test Existing Data Safety
  console.log('[1] Testing Existing Data Safety');
  const { data: negativePolicies } = await supabase.from('policies').select('*').lt('sum_insured', 0);
  console.log('Negative Policy Sums:', negativePolicies?.length || 0);
  
  const { data: negativeClaims } = await supabase.from('claims').select('*').lt('claim_amount', 0);
  console.log('Negative Claim Amounts:', negativeClaims?.length || 0);

  // 2. Unauthenticated Access
  console.log('\n[2] Testing Unauthenticated RLS (Should be empty or fail)');
  const { data: policiesData, error: pErr } = await supabase.from('policies').select('*').limit(5);
  console.log('Unauthenticated Policies Read:', policiesData?.length || 0, 'Error:', pErr?.message || 'none');
  
  // Authenticate as a user (customer)
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'tishanbansal4152@gmail.com',
    password: 'Tishan@123'
  });
  
  if (authErr) {
    console.error('Failed to auth as customer:', authErr.message);
  } else {
    console.log('\n[3] Authenticated IDOR Testing (as tishanbansal4152@gmail.com)');
    // Try to read all claims (should only return their own)
    const { data: allClaims } = await supabase.from('claims').select('*');
    console.log('Customer readable claims count:', allClaims?.length || 0);
    
    // Attempt to spoof audit log
    const { error: spoofErr } = await supabase.from('audit_logs').insert([{
        user_id: '00000000-0000-0000-0000-000000000000', // spoofed ID
        action: 'test',
        entity: 'test'
    }]);
    console.log('Audit Log Spoofing Error (Should fail RLS):', spoofErr?.message || 'none');
  }

  // Auth as Admin
  const { data: adminAuth, error: adminErr } = await supabase.auth.signInWithPassword({
    email: 'ertishanbansal@gmail.com',
    password: 'Tishan@123'
  });

  if (adminErr) {
      console.error('Failed to auth as admin:', adminErr.message);
  } else {
      console.log('\n[4] Testing Database CHECK constraints');
      const { error: checkErr } = await supabase.from('policies').insert([{
          customer_id: '00000000-0000-0000-0000-000000000000',
          plan_id: '00000000-0000-0000-0000-000000000000',
          policy_number: 'TEST-123',
          sum_insured: -500, // NEGATIVE
          status: 'active',
          start_date: '2024-01-01',
          end_date: '2025-01-01'
      }]);
      console.log('Negative Sum Insured Insert Error (Should fail constraint):', checkErr?.message || 'none');
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests().catch(console.error);
