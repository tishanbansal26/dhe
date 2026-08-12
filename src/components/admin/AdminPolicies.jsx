import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('policies')
      .select('*, customers(name, email), agents(name), insurance_plans(name, category)')
      .order('created_at', { ascending: false });
    
    if (!error) setPolicies(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('policies').update({ status }).eq('id', id);
    if (!error) fetchPolicies();
    else toast.error('Failed to update status: ' + error.message);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Policy Management</h3>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Policy Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-24"></div><div className="h-3 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-3 bg-slate-700/50 rounded w-24"></div><div className="h-3 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-16"></div></td>
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
                <th className="px-4 py-3 rounded-l-lg">Policy Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {policies.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-white font-medium">{p.policy_number}</td>
                  <td className="px-4 py-4 text-teal-400">{p.customers?.name}<br/><span className="text-xs text-gray-400">{p.customers?.email}</span></td>
                  <td className="px-4 py-4 text-gray-300">{p.insurance_plans?.name}</td>
                  <td className="px-4 py-4 text-gray-400">{p.agents?.name || 'Unassigned'}</td>
                  <td className="px-4 py-4 text-gray-400 text-xs">
                    Start: {new Date(p.start_date).toLocaleDateString()}<br/>
                    End: {new Date(p.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 
                      p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-sm focus:outline-none focus:border-teal-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">No policies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
