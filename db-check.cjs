const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const supabaseUrl = 'https://nzdqkfxjotdicmkfvfom.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZHFrZnhqb3RkaWNta2Z2Zm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDQzMjYsImV4cCI6MjEwMTgyMDMyNn0.kZ61mSMtyDJQ3MiexTkwFyKYbdIEUi_Eza5xgpJdS-g'; // Anon key
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase.from('product_ai_imports').select('*').order('created_at', { ascending: false }).limit(3);
  
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Latest imports:', JSON.stringify(data, null, 2));
  }
}

run();
