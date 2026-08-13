import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { uploadDocument } from '../../lib/SupabaseStorageService';
import EmptyState from '../EmptyState';
export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policy_number: '',
    customer_id: '',
    plan_id: '',
    agent_id: '',
    sum_insured: '',
    start_date: '',
    start_date: '',
    end_date: '',
    status: 'active',
    document_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPolicies();
    fetchDropdownData();
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

  const fetchDropdownData = async () => {
    const [cRes, pRes, aRes] = await Promise.all([
      supabase.from('customers').select('id, name, email'),
      supabase.from('insurance_plans').select('id, name'),
      supabase.from('agents').select('id, name')
    ]);
    if (cRes.data) setCustomers(cRes.data);
    if (pRes.data) setPlans(pRes.data);
    if (aRes.data) setAgents(aRes.data);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('policies').update({ status }).eq('id', id);
    if (!error) fetchPolicies();
    else toast.error('Failed to update status: ' + error.message);
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    if (!newPolicy.policy_number || !newPolicy.customer_id || !newPolicy.plan_id || !newPolicy.start_date || !newPolicy.end_date) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        policy_number: newPolicy.policy_number,
        customer_id: newPolicy.customer_id,
        plan_id: newPolicy.plan_id,
        agent_id: newPolicy.agent_id || null,
        sum_insured: newPolicy.sum_insured ? parseFloat(newPolicy.sum_insured) : null,
        start_date: newPolicy.start_date,
        end_date: newPolicy.end_date,
        status: newPolicy.status,
        document_url: newPolicy.document_url
      };

      if (selectedFile) {
        toast.loading('Uploading document...', { id: 'upload' });
        const { data: uploadData, error: uploadError } = await uploadDocument('documents', 'policies', selectedFile);
        if (uploadError) throw uploadError;
        payload.document_url = uploadData.url;
        toast.dismiss('upload');
      }

      const { error } = await supabase.from('policies').insert([payload]);
      
      if (error) throw error;
      
      toast.success('Policy added successfully!');
      setIsAddModalOpen(false);
      setSelectedFile(null);
      setNewPolicy({
        policy_number: '',
        customer_id: '',
        plan_id: '',
        agent_id: '',
        sum_insured: '',
        start_date: '',
        end_date: '',
        status: 'active',
        document_url: ''
      });
      fetchPolicies();
    } catch (err) {
      toast.error('Failed to add policy: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Policy Management</h3>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Policy
        </button>
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
                <th className="px-4 py-3">Doc</th>
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
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-8"></div></td>
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
                <th className="px-4 py-3">Doc</th>
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
                    {p.document_url ? (
                      <a href={p.document_url} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300">View</a>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
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
                  <td colSpan="8" className="px-4 py-8">
                    <EmptyState 
                      title="No Policies Found" 
                      description="There are currently no policies in the system."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Policy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center sticky top-0 bg-slate-800 z-10 rounded-t-3xl">
              <h3 className="text-xl font-bold text-white">Add New Policy</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="add-policy-form" onSubmit={handleAddPolicy} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Policy Number *</label>
                    <input 
                      type="text" 
                      required
                      value={newPolicy.policy_number}
                      onChange={e => setNewPolicy({...newPolicy, policy_number: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                      placeholder="e.g. POL-2023-1001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer *</label>
                    <select
                      required
                      value={newPolicy.customer_id}
                      onChange={e => setNewPolicy({...newPolicy, customer_id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="">Select Customer...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Plan *</label>
                    <select
                      required
                      value={newPolicy.plan_id}
                      onChange={e => setNewPolicy({...newPolicy, plan_id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="">Select Plan...</option>
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Assign Agent</label>
                    <select
                      value={newPolicy.agent_id}
                      onChange={e => setNewPolicy({...newPolicy, agent_id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="">Unassigned (Direct)</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sum Insured (₹)</label>
                    <input 
                      type="number"
                      value={newPolicy.sum_insured}
                      onChange={e => setNewPolicy({...newPolicy, sum_insured: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
                    <select
                      required
                      value={newPolicy.status}
                      onChange={e => setNewPolicy({...newPolicy, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                    <input 
                      type="date"
                      required
                      value={newPolicy.start_date}
                      onChange={e => setNewPolicy({...newPolicy, start_date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label>
                    <input 
                      type="date"
                      required
                      value={newPolicy.end_date}
                      onChange={e => setNewPolicy({...newPolicy, end_date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Policy Document (PDF)</label>
                    <div className="relative">
                      <input 
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-700/50 bg-slate-800 rounded-b-3xl sticky bottom-0 z-10 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="add-policy-form"
                disabled={isSubmitting}
                className="bg-teal-500 hover:bg-teal-600 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Policy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
