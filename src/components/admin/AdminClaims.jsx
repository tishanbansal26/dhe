import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('claims')
      .select('*, customers(name, email), policies(policy_number, insurance_plans(name))')
      .order('created_at', { ascending: false });
    
    if (!error) setClaims(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('claims').update({ status }).eq('id', id);
    if (!error) fetchClaims();
    else toast.error('Failed to update status: ' + error.message);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Claims Management</h3>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Claim ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Policy / Plan</th>
                <th className="px-4 py-3">Type & Amount</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-24"></div><div className="h-3 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-20"></div><div className="h-3 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-20"></div><div className="h-4 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-3 bg-slate-700/50 rounded w-24"></div><div className="h-3 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-8 bg-slate-700/50 rounded w-24"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Claim ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Policy / Plan</th>
                <th className="px-4 py-3">Type & Amount</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {claims.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-white font-medium text-xs">
                    {c.reference_number || c.id.substring(0,8)}
                    <br/><span className="text-[10px] text-teal-500 uppercase">{c.type === 'new_claim' ? 'New' : 'Linked'}</span>
                  </td>
                  <td className="px-4 py-4 text-teal-400">{c.customers?.name || 'External'}<br/><span className="text-xs text-gray-400">{c.customers?.email}</span></td>
                  <td className="px-4 py-4 text-gray-300">{c.policies?.policy_number || c.insurer_name}<br/><span className="text-xs text-gray-500">{c.policies?.insurance_plans?.name}</span></td>
                  <td className="px-4 py-4 text-gray-300 capitalize">{c.claim_type || c.type}<br/><span className="font-bold">{c.claim_amount ? `₹${c.claim_amount}` : '-'}</span></td>
                  <td className="px-4 py-4 text-gray-400 text-xs">
                    Filed: {new Date(c.created_at).toLocaleDateString()}<br/>
                    {c.incident_date && `Incident: ${new Date(c.incident_date).toLocaleDateString()}`}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      c.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 
                      c.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                      c.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-sm focus:outline-none focus:border-teal-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">No claims found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
