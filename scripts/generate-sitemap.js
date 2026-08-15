import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.radheinv.site';
const TODAY = new Date().toISOString().split('T')[0];

// Static routes
const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/compare', changefreq: 'weekly', priority: '0.8' },
  { path: '/quote-generator', changefreq: 'weekly', priority: '0.9' },
  { path: '/login', changefreq: 'monthly', priority: '0.3' },
  { path: '/signup', changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.2' },
];

// Claims / Support pages
const claimsRoutes = [
  '/claims/new',
  '/claims/existing',
  '/claims/info',
  '/claims/track',
  '/claims/cashless',
].map(p => ({ path: p, changefreq: 'monthly', priority: '0.6' }));

// Category pages
const categoryRoutes = [
  '/category/health',
  '/category/life',
  '/category/motor',
  '/category/investment',
  '/category/travel',
  '/category/term',
].map(p => ({ path: p, changefreq: 'weekly', priority: '0.9' }));

// Calculator pages
const calculatorRoutes = [
  '/calculators',
  '/calculators/life-insurance-cover-calculator',
  '/calculators/term-insurance-calculator',
  '/calculators/health-insurance-cover-calculator',
  '/calculators/insurance-gap-calculator',
  '/calculators/family-health-insurance-calculator',
  '/calculators/senior-citizen-health-insurance-calculator',
  '/calculators/retirement-calculator',
].map(p => ({ path: p, changefreq: 'monthly', priority: '0.7' }));

async function fetchDynamicPlanRoutes() {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase credentials not found in env, skipping dynamic plan routes.');
      return [];
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('insurance_plans')
      .select('id, updated_at')
      .eq('status', 'published')
      .eq('active', true);
    
    if (error) {
      console.warn('Failed to fetch plans for sitemap:', error.message);
      return [];
    }
    
    return (data || []).map(plan => ({
      path: `/plan/${plan.id}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: plan.updated_at ? plan.updated_at.split('T')[0] : TODAY
    }));
  } catch (e) {
    console.warn('Supabase fetch skipped:', e.message);
    return [];
  }
}

async function generate() {
  const dynamicPlans = await fetchDynamicPlanRoutes();
  
  const allRoutes = [
    ...staticRoutes,
    ...categoryRoutes,
    ...calculatorRoutes,
    ...claimsRoutes,
    ...dynamicPlans
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allRoutes.map(route => `
  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod || TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`;

  const distPath = path.resolve(__dirname, '../dist/sitemap.xml');
  fs.writeFileSync(distPath, sitemap.trim());
  console.log(`Sitemap successfully generated at dist/sitemap.xml (${allRoutes.length} URLs)`);
}

generate();
