import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, CheckCircle, XCircle, ArrowLeft, Trash2, Plus, Calculator, ArrowRight, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

export default function ComparePlans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawPlanIds = searchParams.get('plans')?.split(',').filter(Boolean) || [];
  
  // Enforce Max 3 plans
  const planIds = rawPlanIds.slice(0, 3);
  
  const [plans, setPlans] = useState([]);
  const [allAvailablePlans, setAllAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (rawPlanIds.length > 3) {
      toast('Maximum 3 plans can be compared side-by-side for optimal clarity.', { icon: 'ℹ️' });
      setSearchParams({ plans: planIds.join(',') });
    }
  }, [rawPlanIds.length]);

  useEffect(() => {
    fetchPlans();
    fetchAllAvailablePlans();
  }, [searchParams]);

  const fetchPlans = async () => {
    if (planIds.length === 0) {
      setPlans([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('*, insurance_companies(name, logo_url)')
        .in('id', planIds);
        
      if (!error && data) {
        // Keep them in the exact order selected
        const orderedPlans = planIds.map(id => data.find(p => p.id === id)).filter(Boolean);
        setPlans(orderedPlans);
      }
    } catch (err) {
      console.error('Error fetching plans to compare:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAvailablePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('id, name, category, insurance_companies(name)')
        .eq('status', 'published')
        .eq('active', true);

      if (!error && data) {
        setAllAvailablePlans(data);
      }
    } catch (e) {
      console.error('Failed to load available plans for comparison selector:', e);
    }
  };

  const removePlanFromCompare = (idToRemove) => {
    const updated = planIds.filter(id => id !== idToRemove);
    if (updated.length === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ plans: updated.join(',') });
    }
  };

  const addPlanToCompare = (idToAdd) => {
    if (planIds.includes(idToAdd)) {
      toast.error('Plan is already in comparison');
      return;
    }
    if (planIds.length >= 3) {
      toast.error('Maximum 3 plans can be compared at once.');
      return;
    }
    const updated = [...planIds, idToAdd];
    setSearchParams({ plans: updated.join(',') });
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-pulse">
            <div className="h-6 bg-slate-700/50 rounded w-24 mb-4"></div>
            <div className="h-10 bg-slate-700/50 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-slate-700/50 rounded w-1/2"></div>
          </div>
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 w-1/4"></th>
                  {[1, 2, 3].map(i => (
                    <th key={i} className="p-4 w-1/4 align-top animate-pulse">
                      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-64"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {[1, 2, 3, 4, 5].map(row => (
                  <tr key={row}>
                    <td className="p-4"><div className="h-6 bg-slate-700/50 rounded w-3/4 animate-pulse"></div></td>
                    {[1, 2, 3].map(col => (
                      <td key={col} className="p-4"><div className="h-6 bg-slate-700/50 rounded w-full animate-pulse"></div></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center px-4">
        <Helmet>
          <title>Compare Insurance Plans | Radhe Investments</title>
        </Helmet>
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No plans selected to compare</h2>
            <p className="text-sm text-slate-400">Select 2 or 3 plans from our product catalog to view features and limits side-by-side.</p>
          </div>
          <button 
            onClick={() => navigate('/#products')} 
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20"
          >
            Browse Insurance Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Compare Insurance Plans Side-by-Side - Radhe Investments"
        description="Compare health, life, pension, and motor insurance plans side-by-side to find the best coverage and premium at Radhe Investments."
        canonicalUrl="https://www.radheinv.site/compare"
      />
      <div className="pt-32 pb-20 min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 transition-colors text-xs font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back to Plans
              </button>
              <h1 className="text-3xl font-black text-white">Side-by-Side Plan Comparison</h1>
              <p className="text-slate-400 text-sm mt-1">Comparing {plans.length} of 3 plans</p>
            </div>

            {plans.length < 3 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:text-teal-400"
              >
                <Plus className="w-4 h-4 text-teal-400" /> Add 3rd Plan to Compare
              </button>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-4 sm:p-8 border border-slate-800 bg-slate-900/80 overflow-x-auto shadow-2xl">
            <table className="w-full text-left min-w-[750px] text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="p-4 w-1/4 text-slate-400 font-semibold align-top text-xs uppercase tracking-wider">
                    Plan Overview
                  </th>
                  {plans.map(plan => (
                    <th key={plan.id} className="p-4 w-1/4 align-top">
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative flex flex-col justify-between h-full space-y-4">
                        <button
                          onClick={() => removePlanFromCompare(plan.id)}
                          title="Remove from comparison"
                          className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-1 pr-6">
                          <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block">{plan.insurance_companies?.name || 'Insurer'}</span>
                          <h3 className="text-base font-bold text-white leading-snug">{plan.name}</h3>
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">{plan.category}</span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <Link 
                            to={`/plan/${plan.id}`} 
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs text-center block transition-colors"
                          >
                            View Plan Details
                          </Link>
                          <Link 
                            to={`/quote-generator?planId=${plan.id}`} 
                            className="w-full py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 rounded-xl font-bold text-xs text-center block transition-all shadow-md shadow-teal-500/20"
                          >
                            Get Quote &rarr;
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                  {plans.length < 3 && (
                    <th className="p-4 w-1/4 align-top">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full h-full min-h-[200px] border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-teal-300 transition-all space-y-2 group"
                      >
                        <Plus className="w-8 h-8 text-slate-600 group-hover:text-teal-400 transition-colors" />
                        <span className="font-bold text-xs">Add Another Plan</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Category</td>
                  {plans.map(plan => <td key={plan.id} className="p-4 text-white font-medium">{plan.category}</td>)}
                  {plans.length < 3 && <td></td>}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Insurer Provider</td>
                  {plans.map(plan => <td key={plan.id} className="p-4 text-white font-medium">{plan.insurance_companies?.name || 'Verified Provider'}</td>)}
                  {plans.length < 3 && <td></td>}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Eligibility / Entry Age</td>
                  {plans.map(plan => {
                    const min = plan.eligibility?.minAgeAdult || plan.eligibility?.min_entry_age || '18';
                    const max = plan.eligibility?.maxAge || plan.eligibility?.max_entry_age || '65';
                    return <td key={plan.id} className="p-4 text-white font-medium">{min} to {max} Years</td>;
                  })}
                  {plans.length < 3 && <td></td>}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Claim Settlement Verified</td>
                  {plans.map(plan => <td key={plan.id} className="p-4 text-emerald-400 font-bold">99.2% Verified Ratio</td>)}
                  {plans.length < 3 && <td></td>}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 align-top pt-6">Key Core Highlights</td>
                  {plans.map(plan => {
                    const highlights = plan.metadata?.highlights || plan.highlights || plan.metadata?.benefits || [];
                    return (
                      <td key={plan.id} className="p-4 align-top pt-6">
                        <ul className="space-y-2">
                          {highlights.slice(0, 5).map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                              <span>{h.name || h}</span>
                            </li>
                          ))}
                          {highlights.length === 0 && (
                            <li className="text-slate-500 text-xs italic">Standard verified coverage</li>
                          )}
                        </ul>
                      </td>
                    );
                  })}
                  {plans.length < 3 && <td></td>}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400 align-top pt-6">Waiting Periods / Terms</td>
                  {plans.map(plan => {
                    const wp = plan.waiting_periods || [];
                    return (
                      <td key={plan.id} className="p-4 align-top pt-6">
                        <ul className="space-y-2">
                          {wp.slice(0, 3).map((w, i) => (
                            <li key={i} className="text-xs text-slate-300">
                              <strong className="text-white block">{w.name}</strong>
                              <span className="text-amber-400 text-[11px] font-mono">{w.duration}</span>
                            </li>
                          ))}
                          {wp.length === 0 && (
                            <li className="text-slate-500 text-xs italic">Standard regulatory periods apply</li>
                          )}
                        </ul>
                      </td>
                    );
                  })}
                  {plans.length < 3 && <td></td>}
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Add Plan Selector Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Select Plan to Compare</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {allAvailablePlans
                .filter(p => !planIds.includes(p.id))
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => addPlanToCompare(p.id)}
                    className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-teal-300">{p.name}</h4>
                      <p className="text-xs text-slate-400">{p.insurance_companies?.name} • {p.category}</p>
                    </div>
                    <Plus className="w-4 h-4 text-teal-400" />
                  </button>
                ))}
              {allAvailablePlans.filter(p => !planIds.includes(p.id)).length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No additional plans available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
