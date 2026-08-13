import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const searchCategories = {
  health: {
    title: 'Health Insurance',
    links: [
      { label: 'Health Insurance', url: '/category/health' },
      { label: 'Family Health Insurance', url: '/calculators/family-health-insurance-calculator' },
      { label: 'Senior Citizen Health Insurance', url: '/calculators/senior-citizen-health-insurance-calculator' },
      { label: 'Health Insurance Cover Calculator', url: '/calculators/health-insurance-cover-calculator' },
      { label: 'Health Insurance Claim Process', url: '/claims/new' }
    ]
  },
  life: {
    title: 'Life Insurance',
    links: [
      { label: 'Life Insurance', url: '/category/life' },
      { label: 'Term Insurance', url: '/category/term' },
      { label: 'Life Insurance Cover Calculator', url: '/calculators/life-insurance-cover-calculator' },
      { label: 'Insurance Gap Calculator', url: '/calculators/insurance-gap-calculator' },
      { label: 'Life Insurance Claim Process', url: '/claims/new' }
    ]
  },
  term: {
    title: 'Term Insurance',
    links: [
      { label: 'Term Insurance', url: '/category/term' },
      { label: 'Term Insurance Calculator', url: '/calculators/term-insurance-calculator' },
      { label: 'Term Insurance Coverage', url: '/calculators/term-insurance-calculator' },
      { label: 'Compare Term Plans', url: '/compare' },
      { label: 'Life Insurance vs Term Insurance', url: '/category/life' }
    ]
  },
  family: {
    title: 'Family Protection',
    links: [
      { label: 'Family Health Insurance', url: '/calculators/family-health-insurance-calculator' },
      { label: 'Family Floater Plans', url: '/category/health' },
      { label: 'Health Insurance for Parents', url: '/calculators/senior-citizen-health-insurance-calculator' },
      { label: 'Life Insurance for Families', url: '/calculators/life-insurance-cover-calculator' }
    ]
  },
  claims: {
    title: 'Claims & Support',
    links: [
      { label: 'Insurance Claim Process', url: '/claims/info' },
      { label: 'File a Claim', url: '/claims/new' },
      { label: 'Track Claim Status', url: '/claims/track' },
      { label: 'Cashless Network Hospitals', url: '/claims/cashless' }
    ]
  },
  retirement: {
    title: 'Retirement & Pension',
    links: [
      { label: 'Retirement Planning', url: '/category/investment' },
      { label: 'Pension Calculator', url: '/calculators/retirement-calculator' },
      { label: 'Guaranteed Income Plans', url: '/category/investment' },
      { label: 'Senior Citizen Savings', url: '/category/investment' }
    ]
  },
  motor: {
    title: 'Motor Insurance',
    links: [
      { label: 'Car Insurance', url: '/category/motor' },
      { label: 'Two Wheeler Insurance', url: '/category/motor' },
      { label: 'Commercial Vehicle Insurance', url: '/category/motor' },
      { label: 'Motor Claim Process', url: '/claims/info' }
    ]
  },
  investment: {
    title: 'Investment & Savings',
    links: [
      { label: 'Investment Plans', url: '/category/investment' },
      { label: 'ULIP Plans', url: '/category/investment' },
      { label: 'Tax Saving Investments', url: '/category/investment' },
      { label: 'Child Education Plans', url: '/category/investment' }
    ]
  },
  locations: {
    title: 'Insurance by Location',
    links: [
      { label: 'Best Insurance in Mansa', url: '/contact' },
      { label: 'Health Insurance in Punjab', url: '/category/health' },
      { label: 'Insurance Advisor in Bathinda', url: '/contact' },
      { label: 'Life Insurance in Chandigarh', url: '/category/life' },
      { label: 'Term Insurance in Ludhiana', url: '/category/term' },
      { label: 'Insurance Agents in Punjab', url: '/contact' }
    ]
  },
  radhe: {
    title: 'Radhe Investments',
    links: [
      { label: 'Radhe Investments Mansa', url: '/' },
      { label: 'Radhe Investment Insurance Advisor', url: '/contact' },
      { label: 'Best Insurance Agency in Punjab', url: '/' },
      { label: 'Radhe Investments Bathinda', url: '/contact' },
      { label: 'Radhe Investments Health Insurance', url: '/category/health' }
    ]
  }
};

export default function PopularSearches({ activeCategory = null }) {
  // Determine order of categories to display based on the activeCategory prop
  // If activeCategory matches a key, we put it first, then local, then a few others.
  const allKeys = Object.keys(searchCategories);
  
  let orderedKeys = allKeys;
  if (activeCategory && allKeys.includes(activeCategory)) {
    const remaining = allKeys.filter(k => k !== activeCategory && k !== 'locations' && k !== 'radhe');
    orderedKeys = [activeCategory, 'radhe', 'locations', ...remaining];
  } else {
    // Default order
    orderedKeys = ['radhe', 'health', 'life', 'term', 'family', 'retirement', 'locations', 'investment', 'claims', 'motor'];
  }

  return (
    <div className="bg-slate-900 border-t border-slate-800 py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-sm font-semibold mb-4">
            <Search className="w-4 h-4" /> Internal Discovery
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Explore Popular Insurance Searches</h2>
          <p className="text-gray-400">Explore insurance topics, guides and tools commonly used by customers researching insurance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {orderedKeys.map(key => {
            const categoryData = searchCategories[key];
            return (
              <div key={key}>
                <h3 className="text-lg font-bold text-slate-300 mb-4 pb-2 border-b border-slate-800">
                  {categoryData.title}
                </h3>
                <ul className="space-y-3">
                  {categoryData.links.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        to={link.url}
                        className="text-gray-400 hover:text-teal-400 text-sm transition-colors block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
