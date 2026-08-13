import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://nzdqkfxjotdicmkfvfom.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZHFrZnhqb3RkaWNta2Z2Zm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDQzMjYsImV4cCI6MjEwMTgyMDMyNn0.kZ61mSMtyDJQ3MiexTkwFyKYbdIEUi_Eza5xgpJdS-g';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertAll() {
  const data = JSON.parse(fs.readFileSync('parsed_all_hospitals.json', 'utf8'));
  console.log(`Starting insertion of ${data.length} hospitals into Supabase...`);

  const chunkSize = 250;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const { error } = await supabase.from('hospitals').insert(chunk);
    if (error) {
      console.error(`Chunk ${i / chunkSize} failed:`, error.message);
      failCount += chunk.length;
    } else {
      successCount += chunk.length;
      console.log(`Progress: ${successCount} / ${data.length} inserted...`);
    }
  }

  console.log(`Finished! Total Success: ${successCount}, Failed: ${failCount}`);
}

insertAll().catch(console.error);
