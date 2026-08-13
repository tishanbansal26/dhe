import React from 'react';
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExplorePlans({ plans, categoryName, onQuoteRequest }) {
  const navigate = useNavigate();

  return (
    <section id="explore-plans" className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore {categoryName || 'Insurance'} Plans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Compare and choose from our curated selection of verified insurance products.
          </p>
        </div>

        {plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              // Extract benefits from metadata, fallback to empty array
              const benefits = plan.metadata?.benefits || [];
              const highlightColor = plan.metadata?.color || 'bg-teal-500';
              const companyName = plan.insurance_companies?.name || 'Insurance Provider';

              return (
                <div key={plan.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-500 transition-all flex flex-col group shadow-xl">
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-700 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl -mr-10 -mt-10 ${highlightColor}`}></div>
                    
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">
                      <Building2 className="w-4 h-4" /> {companyName}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
                      {plan.metadata?.summary || plan.description || 'Comprehensive coverage for your needs.'}
                    </p>
                  </div>

                  {/* Card Body (Features) */}
                  <div className="p-6 flex-grow bg-slate-800/50">
                    <ul className="space-y-3">
                      {benefits.slice(0, 4).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                          <span className="text-slate-300 text-sm">{benefit}</span>
                        </li>
                      ))}
                      {benefits.length === 0 && (
                        <li className="text-slate-500 text-sm italic">Standard features included. View plan for details.</li>
                      )}
                    </ul>
                  </div>

                  {/* Card Footer (Actions) */}
                  <div className="p-6 border-t border-slate-700 bg-slate-900 flex items-center justify-between gap-4">
                    <button 
                      onClick={() => navigate(`/plan/${plan.id}`)}
                      className="text-white hover:text-teal-400 font-medium text-sm transition-colors flex-1 text-center"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => onQuoteRequest(plan)}
                      className="bg-white text-slate-900 hover:bg-teal-50 font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 flex-1"
                    >
                      Get Quote <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-slate-400 mb-4">No published plans found in this category at the moment.</p>
            <button 
              onClick={() => document.getElementById('quote-journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              Contact our advisors for custom options &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
