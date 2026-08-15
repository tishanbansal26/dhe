import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPlan() {
  const { data: companies, error: compErr } = await supabase
    .from('insurance_companies')
    .select('id')
    .eq('name', 'Tata AIA Life Insurance');
    
  if (compErr || !companies || companies.length === 0) {
    console.error('Error finding company:', compErr);
    return;
  }
  
  const companyId = companies[0].id;
  
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'ULIP');
    
  let categoryId = null;
  if (categories && categories.length > 0) {
    categoryId = categories[0].id;
  } else {
    const { data: newCat } = await supabase
      .from('categories')
      .insert([{ name: 'ULIP', slug: 'ulip', icon: 'Shield', description: 'Unit Linked Insurance Plans' }])
      .select('id');
    if (newCat && newCat.length > 0) categoryId = newCat[0].id;
  }
  
  const planPayload = {
    name: 'Tata AIA Smart Sampoorna Raksha Supreme',
    company_id: companyId,
    category_id: categoryId,
    description: 'A highly flexible Unit-Linked Non-Participating Individual Life Insurance Savings Plan.',
    cover_amount: 5400000,
    claim_settlement_ratio: 99.01,
    features: ['105% ROP at Maturity', '120 Month Mortality Refund', 'Zero Alloc. Charges in Optima'],
    premium_data: { calculation_config: { options: ['classic', 'optima'] } },
    active: true
  };
  
  const { data: plan, error: planErr } = await supabase
    .from('insurance_plans')
    .insert([planPayload]);
    
  if (planErr) {
    console.error('Error inserting plan:', planErr);
  } else {
    console.log('Successfully inserted plan Smart Sampoorna Raksha Supreme!');
  }
}

addPlan();
