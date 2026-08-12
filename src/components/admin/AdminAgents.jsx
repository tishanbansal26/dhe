import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Search, Plus, User, Shield, Edit2, Trash2, CheckCircle, XCircle, Loader2, Users } from 'lucide-react';

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Agent',
    type: 'sub',
    gwp: '₹0'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAgent) {
        const { error } = await supabase
          .from('agents')
          .update(formData)
          .eq('id', editingAgent.id);
        if (error) throw error;
      } else {
        const newId = 'AGT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const { error } = await supabase
          .from('agents')
          .insert([{ ...formData, id: newId, policies: 0, active_clients: 0 }]);
        if (error) throw error;
      }
      setShowModal(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save agent');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      const { error } = await supabase.from('agents').delete().eq('id', id);
      if (error) throw error;
      setAgents(agents.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete agent');
    }
  };

  const openModal = (agent = null) => {
    if (agent) {
      setEditingAgent(agent);
      setFormData({
        name: agent.name,
        role: agent.role,
        type: agent.type,
        gwp: agent.gwp || '₹0'
      });
    } else {
      setEditingAgent(null);
      setFormData({
        name: '',
        role: 'Agent',
        type: 'sub',
        gwp: '₹0'
      });
    }
    setShowModal(true);
  };

  const filteredAgents = agents.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Agent Management</h3>
        <button 
          onClick={() => openModal()} 
          className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Agent
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 glass-panel rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500" 
          placeholder="Search agents..." 
        />
      </div>

      {loading ? (
        <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-gray-300">
              <tr>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Role & Type</th>
                <th className="px-4 py-3">Performance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700/50"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700/50 rounded w-32"></div>
                        <div className="h-3 bg-slate-700/50 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-24"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4 space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-20"></div>
                    <div className="h-3 bg-slate-700/50 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <div className="w-8 h-8 bg-slate-700/50 rounded-lg"></div>
                      <div className="w-8 h-8 bg-slate-700/50 rounded-lg"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-gray-300">
              <tr>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Role & Type</th>
                <th className="px-4 py-3">Performance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-10 h-10 text-slate-600 mb-3" />
                      No agents found.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgents.map(agent => (
                  <tr key={agent.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          {agent.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{agent.name}</p>
                          <p className="text-xs text-gray-400">{agent.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{agent.role}</p>
                      <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${agent.type === 'leader' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-gray-400'}`}>
                        {agent.type === 'leader' ? 'Leader' : 'Sub-Agent'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-teal-400 font-bold">{agent.gwp}</p>
                      <p className="text-xs text-gray-400">{agent.policies} Policies</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(agent)} className="p-1.5 bg-slate-700 text-gray-300 hover:text-white rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(agent.id)} className="p-1.5 bg-slate-700 text-gray-300 hover:text-red-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{editingAgent ? 'Edit Agent' : 'Add New Agent'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" placeholder="e.g. Sales Director" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500">
                    <option value="sub">Sub-Agent</option>
                    <option value="leader">Leader</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Initial GWP</label>
                <input type="text" value={formData.gwp} onChange={e => setFormData({...formData, gwp: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" placeholder="₹0" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
