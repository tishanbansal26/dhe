import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nzdqkfxjotdicmkfvfom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZHFrZnhqb3RkaWNta2Z2Zm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDQzMjYsImV4cCI6MjEwMTgyMDMyNn0.kZ61mSMtyDJQ3MiexTkwFyKYbdIEUi_Eza5xgpJdS-g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLeads() {
    console.log('Testing Lead Insertion (Backend Validation Bypass)');
    
    const { error: err1 } = await supabase.from('leads').insert([{
        name: 'A', // Too short
        phone: '123', // Invalid phone
        pincode: '0', // Invalid pincode
        age: 15, // Under 18
        plan_interest: 'Test',
        status: 'new'
    }]);
    
    console.log('Insert Bad Lead Error (Expected DB constraint error):', err1?.message || 'NONE (FAIL: Bad data inserted!)');

    console.log('\nTesting Rate Limiting / Duplication');
    let successCount = 0;
    for(let i=0; i<5; i++) {
        const { error } = await supabase.from('leads').insert([{
            name: 'Valid Name',
            phone: '9999999999',
            pincode: '400001',
            age: 30,
            plan_interest: 'Test Dupe',
            status: 'new'
        }]);
        if (!error) successCount++;
    }
    console.log(`Successfully inserted duplicate leads: ${successCount}/5`);
}

testLeads().catch(console.error);
