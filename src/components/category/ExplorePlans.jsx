import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Building2, Layers, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ExplorePlans({ plans, categoryName, onQuoteRequest }) {
  const navigate = useNavigate();
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const toggleCompare = (planId) => {
    if (selectedForCompare.includes(planId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== planId));
    } else {
      if (selectedForCompare.length >= 3) {
        toast.error('You can compare a maximum of 3 plans at once.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, planId]);
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length < 2) {
      toast('Select at least 2 plans to compare.', { icon: 'ℹ️' });
      return;
    }
    navigate(`/compare?plans=${selectedForCompare.join(',')}`);
  };

  return (
    <section id="explore-plans" className="py-20 bg-slate-900 border-t border-slate-800 relative">
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
              const isSelected = selectedForCompare.includes(plan.id);

              return (
                <div 
                  key={plan.id} 
                  className={`bg-slate-800 rounded-2xl border ${isSelected ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-700'} overflow-hidden hover:border-slate-500 transition-all flex flex-col group shadow-xl relative`}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-700 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl -mr-10 -mt-10 ${highlightColor}`}></div>
                    
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        <Building2 className="w-4 h-4" /> {companyName}
                      </div>
                      
                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(plan.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-teal-500 text-slate-950 shadow' 
                            : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                        {isSelected ? 'Selected' : 'Compare'}
                      </button>
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
                      onClick={() => onQuoteRequest ? onQuoteRequest(plan) : navigate(`/quote-generator?planId=${plan.id}`)}
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

      {/* Floating Comparison Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 rounded-2xl py-3.5 px-6 shadow-2xl shadow-teal-500/20 flex items-center gap-4 animate-fade-in-up">
          <div className="text-xs sm:text-sm text-slate-300">
            <span className="text-teal-400 font-bold">{selectedForCompare.length}</span> of 3 plans selected
          </div>
          <button
            onClick={handleLaunchCompare}
            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow flex items-center gap-2"
          >
            <Layers className="w-4 h-4" /> Compare Now &rarr;
          </button>
          <button
            onClick={() => setSelectedForCompare([])}
            title="Clear comparison selection"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
