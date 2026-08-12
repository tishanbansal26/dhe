import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function InsurancePlans() {
  const [activePlan, setActivePlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from('insurance_plans')
          .select('*, insurance_companies(name)');
        
        if (error) throw error;
        
        const formattedPlans = data.map(plan => {
          const meta = typeof plan.metadata === 'string' ? JSON.parse(plan.metadata) : (plan.metadata || {});
          return {
            id: plan.id,
            name: plan.name,
            provider: plan.insurance_companies?.name,
            premium: meta.premium || '',
            summary: meta.summary || '',
            benefits: meta.benefits || [],
            tag: meta.tag || '',
            color: meta.color || '',
            borderColor: meta.borderColor || '',
            iconName: meta.iconName || 'Shield',
            iconColor: meta.iconColor || 'text-white'
          };
        });
        setPlans(formattedPlans);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section id="plans" className="py-20 relative border-t border-white/5 bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-semibold tracking-wider text-sm uppercase">Curated Portfolios</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Explore Our <span className="text-teal-400">Premium Plans</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover tailor-made insurance solutions designed to secure your health, life, and future wealth.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel rounded-3xl p-8 border border-slate-700/50 h-[450px] animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-slate-700/50 mb-6"></div>
                <div className="h-8 bg-slate-700/50 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700/50 rounded w-5/6 mb-8"></div>
                <div className="border-t border-slate-700/50 pt-6 mb-6">
                  <div className="h-3 bg-slate-700/50 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-slate-700/50 rounded w-1/2"></div>
                </div>
                <div className="h-12 bg-slate-700/50 rounded-xl w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const IconComponent = Icons[plan.iconName] || Icons.Shield;
              return (
                <div 
                  key={plan.id}
                  className={`relative glass-panel rounded-3xl p-8 border transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
                    ${activePlan === plan.id ? `ring-2 ring-teal-500 scale-105 shadow-[0_0_30px_rgba(45,212,191,0.2)] ${plan.borderColor}` : 'border-slate-700/50 hover:border-slate-500/50 hover:-translate-y-2'}
                  `}
                  onClick={() => setActivePlan(activePlan === plan.id ? null : plan.id)}
                >
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 transition-opacity duration-300 ${activePlan === plan.id ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-slate-800/80 border ${plan.borderColor} flex items-center justify-center shadow-lg`}>
                        <IconComponent className={`w-8 h-8 ${plan.iconColor}`} />
                      </div>
                      {plan.tag && (
                        <span className="bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-500/30 font-medium tracking-wide">
                          {plan.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6 h-10">{plan.summary}</p>
                    
                    <div className="border-t border-slate-700/50 pt-6 mb-6">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-white">{plan.premium}</p>
                    </div>

                    {/* Expanded Details */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${activePlan === plan.id ? 'max-h-64 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {plan.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plan/${plan.id}`);
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300
                      ${activePlan === plan.id 
                        ? 'bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}
                    `}>
                      {activePlan === plan.id ? 'Get Started' : 'View Details'} 
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
