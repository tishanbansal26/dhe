import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.radheinv.site';

// Static routes for the sitemap
const routes = [
  '/',
  '/compare',
  '/claims/new',
  '/claims/existing',
  '/claims/info',
  '/claims/track',
  '/claims/cashless',
  '/login',
  '/signup',
  '/privacy',
  '/terms',
  '/cookies'
];

// Note: Dynamic routes like /category/:type and /plan/:id can be fetched from Supabase here during a real SSG build. 
// For now, we will add the known static categories.
const categories = [
  '/category/health',
  '/category/life',
  '/category/motor',
  '/category/travel'
];

const calculators = [
  '/calculators',
  '/calculators/life-insurance-cover-calculator',
  '/calculators/term-insurance-calculator',
  '/calculators/health-insurance-cover-calculator',
  '/calculators/insurance-gap-calculator',
  '/calculators/family-health-insurance-calculator',
  '/calculators/senior-citizen-health-insurance-calculator',
  '/calculators/retirement-calculator'
];

const allRoutes = [...routes, ...categories, ...calculators];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('').trim()}
</urlset>`;

// Write to the dist folder (this script should run after vite build)
const distPath = path.resolve(__dirname, '../dist/sitemap.xml');
fs.writeFileSync(distPath, sitemap);
console.log('Sitemap successfully generated at dist/sitemap.xml');
