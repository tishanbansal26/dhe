import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Search, Plus, User, Shield, Edit2, Trash2, CheckCircle, XCircle, Loader2, Users, Mail } from 'lucide-react';

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent',
    type: 'sub',
    gwp: '₹0',
    company_name: []
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
        // Just update agent details
        const { error } = await supabase
          .from('agents')
          .update({
            name: formData.name,
            role: formData.role,
            type: formData.type,
            gwp: formData.gwp,
            company_name: formData.company_name
          })
          .eq('id', editingAgent.id);
        if (error) throw error;
        toast.success('Agent updated');
      } else {
        // Create new user via Edge Function
        if (!formData.email) {
          toast.error("Email is required to invite a new employee.");
          setSaving(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('invite-employee', {
          body: {
            email: formData.email,
            name: formData.name,
            role: formData.role,
            type: formData.type,
            gwp: formData.gwp,
            company_name: formData.company_name
          }
        });

        if (error) throw error;
        toast.success('Invitation sent securely!');
      }
      setShowModal(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save agent: ' + (err.message || 'Unknown error'));
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
      toast.success("Agent deleted");
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
        email: agent.email || '', // In case email isn't in agents table
        role: agent.role,
        type: agent.type,
        gwp: agent.gwp || '₹0',
        company_name: Array.isArray(agent.company_name) ? agent.company_name : (agent.company_name ? [agent.company_name] : [])
      });
    } else {
      setEditingAgent(null);
      setFormData({
        name: '',
        email: '',
        role: 'agent',
        type: 'sub',
        gwp: '₹0',
        company_name: []
      });
    }
    setShowModal(true);
  };

  const filteredAgents = agents.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.id?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Team Management</h3>
        <button 
          onClick={() => openModal()} 
          className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search by name, ID, or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {loading ? (
        <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-gray-300">
              <tr>
                <th className="px-4 py-3">Employee</th>
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
                <th className="px-4 py-3">Employee</th>
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
                      No team members found.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgents.map(agent => (
                  <tr key={agent.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          {agent.name?.charAt(0) || <User className="w-4 h-4"/>}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {agent.name}
                            {agent.role === 'admin' && <Shield className="w-3 h-3 text-teal-400" />}
                          </p>
                          <p className="text-xs text-gray-400">{agent.email || agent.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium capitalize">{agent.role}</p>
                      <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${agent.type === 'leader' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-gray-400'}`}>
                        {agent.type === 'leader' ? 'Leader' : 'Sub-Agent'}
                      </span>
                      {agent.company_name && agent.company_name.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 max-w-[200px]">
                          {agent.company_name.map(c => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-gray-400">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-teal-400 font-bold">{agent.gwp}</p>
                      <p className="text-xs text-gray-400">{agent.policies || 0} Policies</p>
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
            <h3 className="text-xl font-bold text-white mb-4">
              {editingAgent ? 'Edit Employee Details' : 'Invite New Employee'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" placeholder="John Doe" />
              </div>
              
              {!editingAgent && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" placeholder="john@example.com" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Companies (Select multiple)</label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-800/50 border border-slate-600 rounded-xl">
                  {[
                    "Tata AIA", "HDFC Life", "LIC", "Max Life", "SBI Life", "ICICI Prudential",
                    "Bajaj Allianz", "Kotak Life", "PNB MetLife", "Reliance Nippon", "Star Health",
                    "Niva Bupa", "Care Health", "Aditya Birla", "Other"
                  ].map(company => {
                    const isSelected = formData.company_name.includes(company);
                    return (
                      <button
                        type="button"
                        key={company}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({...formData, company_name: formData.company_name.filter(c => c !== company)});
                          } else {
                            setFormData({...formData, company_name: [...formData.company_name, company]});
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${isSelected ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' : 'bg-slate-700/50 text-gray-400 border-slate-600 hover:bg-slate-700'}`}
                      >
                        {company}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">System Role</label>
                  <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500">
                    <option value="agent">Agent</option>
                    <option value="staff">Staff (Backend)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Agent Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500">
                    <option value="sub">Sub-Agent</option>
                    <option value="leader">Leader</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Initial GWP Target</label>
                <input type="text" value={formData.gwp} onChange={e => setFormData({...formData, gwp: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" placeholder="₹10 Cr" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingAgent ? 'Save Changes' : 'Send Invite')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
