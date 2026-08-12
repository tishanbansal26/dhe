import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function ComparePlans() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planIds = searchParams.get('plans')?.split(',') || [];
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Compare Insurance Plans - Radhe Investments';
  }, []);

  useEffect(() => {
    if (planIds.length > 0) {
      fetchPlans();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('insurance_plans')
      .select('*, insurance_companies(name, logo_url)')
      .in('id', planIds);
      
    if (!error && data) {
      // Keep them in the order they were selected
      const orderedPlans = planIds.map(id => data.find(p => p.id === id)).filter(Boolean);
      setPlans(orderedPlans);
    }
    setLoading(false);
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
      <div className="pt-32 pb-20 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-white mb-4">No plans selected to compare.</h2>
        <button onClick={() => navigate('/#plans')} className="text-teal-400 underline">Go back to plans</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="text-3xl font-bold text-white">Compare Plans</h2>
          <p className="text-gray-400 mt-2">Compare features side-by-side to find the best fit for you.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr>
                <th className="p-4 w-1/4"></th>
                {plans.map(plan => (
                  <th key={plan.id} className="p-4 w-1/4 align-top">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden h-full flex flex-col justify-between">
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${plan.metadata?.color || 'from-teal-500 to-blue-500'}`}></div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{plan.insurance_companies?.name}</span>
                        <h3 className="text-lg font-bold text-white mt-1 mb-2">{plan.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{plan.metadata?.summary}</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white mb-4">{plan.metadata?.premium || 'N/A'}</div>
                        <button onClick={() => navigate(`/plan/${plan.id}`)} className="w-full bg-teal-500 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr>
                <td className="p-4 font-medium text-gray-300">Category</td>
                {plans.map(plan => <td key={plan.id} className="p-4 text-white text-center">{plan.category}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-300">Type</td>
                {plans.map(plan => <td key={plan.id} className="p-4 text-white text-center">{plan.type || 'Standard'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-300">Claim Settlement Ratio</td>
                {plans.map(plan => <td key={plan.id} className="p-4 text-white text-center">{plan.metadata?.csr || 'N/A'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-300">Network Hospitals</td>
                {plans.map(plan => <td key={plan.id} className="p-4 text-white text-center">{plan.metadata?.networkHospitals || 'N/A'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-300 align-top pt-8">Key Benefits</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-4 align-top pt-8">
                    <ul className="space-y-3">
                      {(plan.metadata?.benefits || []).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
