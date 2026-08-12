import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Search Results for "${query}" - Radhe Investments`;
    
    async function performSearch() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('insurance_plans')
          .select('*, insurance_companies(name)')
          .or(`name.ilike.%${query}%,category.ilike.%${query}%`);
          
        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Search Results for <span className="text-teal-400">"{query}"</span>
          </h1>
          <p className="text-gray-400">Found {results.length} plans matching your criteria.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((plan) => {
              const meta = typeof plan.metadata === 'string' ? JSON.parse(plan.metadata) : (plan.metadata || {});
              return (
                <div key={plan.id} className={`glass-panel rounded-3xl p-6 md:p-8 border relative flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${meta.borderColor || 'border-slate-700'} group overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-b ${meta.color || 'from-slate-800 to-slate-900'} opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${meta.iconBg || 'bg-slate-800'} flex items-center justify-center`}>
                        <Package className={`w-7 h-7 ${meta.iconColor || 'text-white'}`} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${meta.iconBg || 'bg-slate-800'} ${meta.iconColor || 'text-white'} shadow-sm`}>
                        {meta.tag || plan.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                      {plan.name}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                      {meta.summary || `A comprehensive ${plan.category} plan from ${plan.insurance_companies?.name}.`}
                    </p>

                    <div className="mb-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                      <p className="text-sm text-gray-400 mb-1">Starting Premium</p>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-white">{meta.premium || '₹500'}</span>
                        <span className="text-gray-500 mb-1">/month</span>
                      </div>
                    </div>

                    <Link to={`/plan/${plan.id}`} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold transition-all">
                      View Plan Details <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No plans found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              We couldn't find any insurance plans matching "{query}". Try searching for categories like "Health", "Life", or "Motor".
            </p>
            <Link to="/#plans" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-slate-900 px-6 py-3 rounded-xl font-bold transition-colors">
              Browse All Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
