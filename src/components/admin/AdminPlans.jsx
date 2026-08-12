import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, company_id: '', name: '', category: 'Health', 
    type: '', tag: '', active: true,
    summary: '', premium: '', iconName: 'Shield'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [plansRes, compRes] = await Promise.all([
      supabase.from('insurance_plans').select('*, insurance_companies(name)').order('name'),
      supabase.from('insurance_companies').select('*').order('name')
    ]);
    if (!plansRes.error) setPlans(plansRes.data || []);
    if (!compRes.error) setCompanies(compRes.data || []);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const metadata = {
      summary: formData.summary,
      premium: formData.premium,
      iconName: formData.iconName,
      iconColor: 'text-teal-400',
      color: 'from-teal-500/20 to-blue-500/10',
      borderColor: 'border-teal-500/30'
    };

    const payload = {
      company_id: formData.company_id,
      name: formData.name,
      category: formData.category,
      type: formData.type,
      tag: formData.tag,
      active: formData.active,
      metadata: metadata
    };

    if (formData.id) {
      const { error } = await supabase.from('insurance_plans').update(payload).eq('id', formData.id);
      if (!error) { setShowModal(false); fetchData(); } else toast.error(error.message);
    } else {
      const { error } = await supabase.from('insurance_plans').insert([payload]);
      if (!error) { setShowModal(false); fetchData(); } else toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      await supabase.from('insurance_plans').delete().eq('id', id);
      fetchData();
    }
  };

  const openEdit = (plan) => {
    setFormData({
      id: plan.id,
      company_id: plan.company_id,
      name: plan.name,
      category: plan.category,
      type: plan.type,
      tag: plan.tag,
      active: plan.active,
      summary: plan.metadata?.summary || '',
      premium: plan.metadata?.premium || '',
      iconName: plan.metadata?.iconName || 'Shield'
    });
    setShowModal(true);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Insurance Plans</h3>
        <button 
          onClick={() => { 
            setFormData({ id: null, company_id: companies[0]?.id || '', name: '', category: 'Health', type: '', tag: '', active: true, summary: '', premium: '', iconName: 'Shield' }); 
            setShowModal(true); 
          }}
          className="bg-teal-500 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Plan Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Premium</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4 flex gap-2">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-700/50 rounded-lg"></div>
                  </td>
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
                <th className="px-4 py-3 rounded-l-lg">Plan Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Premium</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {plans.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-4 text-teal-400">{p.insurance_companies?.name}</td>
                  <td className="px-4 py-4 text-gray-300">{p.category}</td>
                  <td className="px-4 py-4 text-gray-300">{p.metadata?.premium || 'N/A'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">{formData.id ? 'Edit Plan' : 'Add Plan'}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Plan Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Company</label>
                <select required value={formData.company_id} onChange={e => setFormData({...formData, company_id: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white">
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white">
                  <option value="Health">Health</option>
                  <option value="Life">Life</option>
                  <option value="Term">Term</option>
                  <option value="Investment">Investment</option>
                  <option value="Motor">Motor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Premium Info (e.g. Starting ₹750 / month)</label>
                <input type="text" value={formData.premium} onChange={e => setFormData({...formData, premium: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Tag (e.g. Bestseller)</label>
                <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Summary</label>
                <textarea rows="2" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"></textarea>
              </div>

              <div className="md:col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded bg-slate-800 border-slate-600 text-teal-500" />
                <label className="text-sm text-gray-400">Active</label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-900 font-bold rounded-lg">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
