import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, BarChart, Settings, ShieldCheck, Building2, BriefcaseMedical, Shield, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminOverview from '../components/admin/AdminOverview';
import AdminAgents from '../components/admin/AdminAgents';
import AdminCompanies from '../components/admin/AdminCompanies';
import AdminPlans from '../components/admin/AdminPlans';
import AdminPolicies from '../components/admin/AdminPolicies';
import AdminClaims from '../components/admin/AdminClaims';
import AdminRenewals from '../components/admin/AdminRenewals';
import AdminAudit from '../components/admin/AdminAudit';
import AdminSettings from '../components/admin/AdminSettings';
import EmptyState from '../components/EmptyState';
export default function AdminPortal() {
  const { user, agentProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'leads', 'agents', 'companies', 'plans', 'policies', 'claims', 'renewals'
  
  useEffect(() => {
    document.title = 'Admin Portal - Radhe Investments';
  }, []);

  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if admin
  useEffect(() => {
    if (agentProfile && agentProfile.role !== 'admin') {
      window.location.href = window.location.protocol + '//' + window.location.hostname.replace('portal.', 'www.') + '/employee';
    }
  }, [agentProfile]);

  useEffect(() => {
    if (agentProfile?.role === 'admin') {
      fetchData();
    }
  }, [agentProfile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAgents(), fetchLeads(), fetchPolicies(), fetchClaims()]);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase.from('agents').select('*');
      if (error) throw error;
      setAgents(data || []);
    } catch (e) {
      console.error('Failed to fetch agents', e);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (e) {
      console.error('Failed to fetch leads', e);
    }
  };

  const fetchPolicies = async () => {
    try {
      const { data } = await supabase.from('policies').select('*');
      setPolicies(data || []);
    } catch (e) {
      console.error('Failed to fetch policies', e);
    }
  };

  const fetchClaims = async () => {
    try {
      const { data } = await supabase.from('claims').select('*');
      setClaims(data || []);
    } catch (e) {
      console.error('Failed to fetch claims', e);
    }
  };

  const updateLeadAgent = async (leadId, agentId) => {
    try {
      const { error } = await supabase.from('leads').update({ agent_id: agentId || null }).eq('id', leadId);
      if (error) throw error;
      setLeads(leads.map(l => l.id === leadId ? { ...l, agent_id: agentId || null } : l));
    } catch (e) {
      toast.error('Failed to assign lead.');
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', leadId);
      if (error) throw error;
      setLeads(leads.filter(l => l.id !== leadId));
      toast.success('Lead deleted successfully.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete lead.');
    }
  };

  if (!agentProfile || agentProfile.role !== 'admin') {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-700/50 pb-6 gap-4">
            <div className="w-64 h-10 bg-slate-800/50 rounded-xl animate-pulse"></div>
            <div className="w-96 h-10 bg-slate-800/50 rounded-xl animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-32 animate-pulse flex flex-col justify-between">
                  <div className="w-24 h-4 bg-slate-700 rounded"></div>
                  <div className="w-16 h-8 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="glass-panel h-96 rounded-3xl border border-slate-700/50 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const newLeads = leads.filter(l => l.status === 'new').length;

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-700/50 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
              <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
            </div>
            <p className="text-gray-400 mt-1">Platform overview and management.</p>
          </div>
          <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'overview' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <BarChart className="w-4 h-4" /> Overview
            </button>
            <button onClick={() => setActiveTab('leads')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'leads' ? 'bg-teal-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}>
              <Phone className="w-4 h-4" /> Leads
            </button>
            <button onClick={() => setActiveTab('agents')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'agents' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              <Users className="w-4 h-4" /> Agents
            </button>
            <button onClick={() => setActiveTab('companies')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'companies' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <Building2 className="w-4 h-4" /> Companies
            </button>
            <button onClick={() => setActiveTab('plans')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'plans' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <BriefcaseMedical className="w-4 h-4" /> Plans
            </button>
            <button onClick={() => setActiveTab('policies')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'policies' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <Shield className="w-4 h-4" /> Policies
            </button>
            <button onClick={() => setActiveTab('claims')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'claims' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <AlertCircle className="w-4 h-4" /> Claims
            </button>
            <button onClick={() => setActiveTab('renewals')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'renewals' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}>
              <Calendar className="w-4 h-4" /> Renewals
            </button>
            <button onClick={() => setActiveTab('audit')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'audit' ? 'bg-slate-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <Settings className="w-4 h-4" /> Audit
            </button>
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === 'content' ? 'bg-teal-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}>
              <Settings className="w-4 h-4" /> Site Content
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-32 animate-pulse flex flex-col justify-between">
                  <div className="w-24 h-4 bg-slate-700 rounded"></div>
                  <div className="w-16 h-8 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="glass-panel h-96 rounded-3xl border border-slate-700/50 animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <AdminOverview leads={leads} agents={agents} policies={policies} claims={claims} />
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Master Lead List</h3>
                  <button 
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + "Date,Interest,Phone,Status,Agent ID\n" 
                        + leads.map(l => `${new Date(l.created_at).toLocaleDateString()},${l.plan_interest},${l.phone},${l.status},${l.agent_id || 'Unassigned'}`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "leads_report.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-slate-800 text-teal-400 border border-teal-500/30 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/50 text-gray-300">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Date</th>
                        <th className="px-4 py-3">Interest</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Assigned To</th>
                        <th className="px-4 py-3 rounded-r-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-4 text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-4 font-medium text-teal-400">{lead.plan_interest}</td>
                          <td className="px-4 py-4 text-white">{lead.phone}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                              lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                              lead.status === 'converted' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>{lead.status.toUpperCase()}</span>
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={lead.agent_id || ''}
                              onChange={(e) => updateLeadAgent(lead.id, e.target.value)}
                              className="px-2 py-1.5 rounded-lg border border-slate-600 bg-slate-800 text-sm focus:outline-none focus:border-rose-500"
                            >
                              <option value="">Unassigned</option>
                              {agents.filter(a => a.role !== 'admin').map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <button 
                              onClick={() => deleteLead(lead.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-4 py-8">
                            <EmptyState 
                              title="No Leads Found" 
                              description="There are currently no leads in the system."
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Agents Tab */}
            {activeTab === 'agents' && <AdminAgents />}

            {/* Companies Tab */}
            {activeTab === 'companies' && <AdminCompanies />}

            {/* Plans Tab */}
            {activeTab === 'plans' && <AdminPlans />}

            {/* Policies Tab */}
            {activeTab === 'policies' && <AdminPolicies />}

            {/* Claims Tab */}
            {activeTab === 'claims' && <AdminClaims />}

            {/* Renewals Tab */}
            {activeTab === 'renewals' && <AdminRenewals />}

            {/* Audit Tab */}
            {activeTab === 'audit' && <AdminAudit />}

            {/* Content Tab */}
            {activeTab === 'content' && <AdminSettings />}
          </>
        )}
      </div>
    </div>
  );
}
