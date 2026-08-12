import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', website: '', logo_url: '', active: true });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('insurance_companies').select('*').order('name');
    if (!error) setCompanies(data || []);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update
      const { error } = await supabase.from('insurance_companies').update({
        name: formData.name,
        website: formData.website,
        logo_url: formData.logo_url,
        active: formData.active
      }).eq('id', formData.id);
      if (!error) {
        setShowModal(false);
        fetchCompanies();
      } else toast.error(error.message);
    } else {
      // Insert
      const { error } = await supabase.from('insurance_companies').insert([{
        name: formData.name,
        website: formData.website,
        logo_url: formData.logo_url,
        active: formData.active
      }]);
      if (!error) {
        setShowModal(false);
        fetchCompanies();
      } else toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this company?')) {
      await supabase.from('insurance_companies').delete().eq('id', id);
      fetchCompanies();
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Insurance Companies</h3>
        <button 
          onClick={() => { setFormData({ id: null, name: '', website: '', logo_url: '', active: true }); setShowModal(true); }}
          className="bg-teal-500 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Name</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-40"></div></td>
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
                <th className="px-4 py-3 rounded-l-lg">Name</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-4 text-teal-400">{c.website || 'N/A'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <button onClick={() => { setFormData(c); setShowModal(true); }} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">{formData.id ? 'Edit Company' : 'Add Company'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website</label>
                <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded bg-slate-800 border-slate-600 text-teal-500" />
                <label className="text-sm text-gray-400">Active</label>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-900 font-bold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
