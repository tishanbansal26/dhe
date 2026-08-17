import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Phone, Calendar, CheckCircle, BarChart3, TrendingUp, IndianRupee, Clock, Activity, Plus, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import LeadDetailsModal from '../components/LeadDetailsModal';
import IsolatedBoundary from '../components/resilience/IsolatedBoundary';
import StatusBadge from '../components/ui/StatusBadge';
import ActionableEmptyState from '../components/ui/ActionableEmptyState';
import { executeResilientQuery } from '../lib/resilience/apiClient';
import { sanitizeString } from '../lib/security/validator';

export default function EmployeePortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'pipeline', 'team'
  const [agentSearch, setAgentSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Add Lead Modal State
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: '35',
    gender: 'male',
    pincode: '',
    plan_interest: 'Term Life Insurance',
    status: 'new',
    notes: ''
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [marketingAssets, setMarketingAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchAgents(), fetchLeads(), fetchMarketingAssets(), fetchClaims()]);
    setLoading(false);
  };

  const fetchAgents = async () => {
    try {
      const res = await executeResilientQuery('supabase_agents', () =>
        supabase.from('agents').select('*'),
        { cacheKey: 'employee_agents', fallbackData: [] }
      );
      setAgents(res.data || []);
    } catch (e) {
      console.error('Failed to fetch agents:', e);
      setAgents([]);
    }
  };

  const fetchMarketingAssets = async () => {
    try {
      const res = await executeResilientQuery('supabase_marketing', () =>
        supabase.from('marketing_assets').select('*'),
        { cacheKey: 'employee_marketing', fallbackData: [] }
      );
      setMarketingAssets(res.data || []);
    } catch (e) {
      console.error('Failed to fetch marketing assets:', e);
      setMarketingAssets([]);
    }
  };
  const [claims, setClaims] = useState([]);
  const fetchLeads = async () => {
    try {
      const res = await executeResilientQuery('supabase_leads', () =>
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false }),
        { cacheKey: 'employee_leads', fallbackData: [] }
      );
      setLeads(res.data || []);
    } catch (e) {
      console.error('Failed to fetch leads:', e);
      setLeads([]);
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await executeResilientQuery('supabase_claims', () =>
        supabase
          .from('claims')
          .select('*')
          .order('created_at', { ascending: false }),
        { cacheKey: 'employee_claims', fallbackData: [] }
      );
      setClaims(res.data || []);
    } catch (e) {
      console.error('Failed to fetch claims:', e);
      setClaims([]);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      
      // Update local state
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (e) {
      console.error('Failed to update status:', e);
      toast.error('Failed to update lead status.');
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLeadForm.name || newLeadForm.name.trim().length < 2) {
      toast.error('Please enter a valid client name');
      return;
    }
    if (!newLeadForm.phone || !/^[0-9]{10}$/.test(newLeadForm.phone.replace(/[^0-9]/g, '').slice(-10))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmittingLead(true);
    try {
      const payload = {
        name: sanitizeString(newLeadForm.name),
        phone: sanitizeString(newLeadForm.phone),
        email: sanitizeString(newLeadForm.email) || null,
        age: parseInt(newLeadForm.age) || 35,
        gender: newLeadForm.gender || 'male',
        pincode: sanitizeString(newLeadForm.pincode) || null,
        plan_interest: sanitizeString(newLeadForm.plan_interest) || 'General',
        status: newLeadForm.status || 'new',
        notes: sanitizeString(newLeadForm.notes) || null
      };

      const { data, error } = await supabase.from('leads').insert([payload]).select().single();
      if (error) throw error;

      toast.success(`Client "${payload.name}" successfully added!`);
      setIsAddLeadModalOpen(false);
      setNewLeadForm({
        name: '',
        phone: '',
        email: '',
        age: '35',
        gender: 'male',
        pincode: '',
        plan_interest: 'Term Life Insurance',
        status: 'new',
        notes: ''
      });
      fetchLeads();
    } catch (err) {
      console.error('Failed to create lead:', err);
      toast.error('Failed to add client: ' + (err.message || 'Database error'));
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const STAGES = ['new', 'contacted', 'converted', 'lost'];
  const getLeadsByStage = (stage) => leads.filter(l => l.status === stage);

  // Compute real chart data by bucketing agent leads by month
  const chartData = useMemo(() => {
    const dataMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const name = `${months[targetMonth.getMonth()]} '${String(targetMonth.getFullYear()).slice(-2)}`;
      dataMap[name] = { name, leads: 0, converted: 0 };
    }

    leads.forEach(l => {
      if (!l.created_at) return;
      const date = new Date(l.created_at);
      const m = `${months[date.getMonth()]} '${String(date.getFullYear()).slice(-2)}`;
      
      // Ensure the key exists in dataMap
      if (dataMap[m]) {
        dataMap[m].leads += 1;
        if (l.status === 'converted') {
          dataMap[m].converted += 1;
        }
      }
    });

    return Object.values(dataMap);
  }, [leads]);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <Helmet>
        <title>Employee Portal - Pipeline & Client Management | Radhe Investments</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase">Welcome Back</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-2">Employee <span className="text-blue-400">Portal</span></h1>
          <p className="text-gray-400">Manage your business, leads pipeline, and team.</p>
          {agents.length > 0 && agents.find(a => a.user_id === user.id)?.company_name && (
            <p className="inline-block mt-3 px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold rounded-full text-sm">
              🏢 {agents.find(a => a.user_id === user.id)?.company_name} Employee
            </p>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 p-1 rounded-xl flex flex-wrap gap-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <BarChart3 className="w-4 h-4" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'pipeline' ? 'bg-teal-500 text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Phone className="w-4 h-4" /> Lead Pipeline
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'team' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Users className="w-4 h-4" /> My Team
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'marketing' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <TrendingUp className="w-4 h-4" /> Marketing
            </button>
            <button 
              onClick={() => setActiveTab('claims')}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'claims' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Activity className="w-4 h-4" /> Claims
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 h-28 animate-pulse flex flex-col justify-between">
                  <div className="w-20 h-4 bg-slate-700 rounded"></div>
                  <div className="w-12 h-8 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="glass-panel h-[500px] rounded-3xl border border-slate-700/50 animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-3xl border border-slate-700/50 flex items-center gap-4">
                    <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl">
                      <Users className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">New Leads</p>
                      <h3 className="text-2xl font-bold text-white">{leads.filter(l => l.status === 'new').length}</h3>
                      <p className="text-xs text-blue-400 mt-2 font-medium flex items-center gap-1">Waiting contact</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-3xl border border-slate-700/50 flex items-center gap-4">
                    <div className="p-4 bg-teal-500/20 text-teal-400 rounded-2xl">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Converted</p>
                      <h3 className="text-2xl font-bold text-white">{leads.filter(l => l.status === 'converted').length}</h3>
                      <p className="text-xs text-teal-400 mt-2 font-medium flex items-center gap-1">Total won</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-3xl border border-slate-700/50 flex items-center gap-4">
                    <div className="p-4 bg-rose-500/20 text-rose-400 rounded-2xl">
                      <IndianRupee className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Est. Commission</p>
                      <h3 className="text-2xl font-bold text-white">
                        ₹{(leads.filter(l => l.status === 'converted').length * 2500).toLocaleString('en-IN')} {/* TODO: Fetch actual commission rates per policy from Supabase */}
                      </h3>
                      <p className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1">Approx. earned</p>  </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart */}
                  <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Pipeline Performance</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                            itemStyle={{ color: '#e2e8f0' }}
                          />
                          <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                          <Area type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConverted)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-3xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {leads.length === 0 ? (
                        <div className="text-center py-8 text-sm text-gray-600 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center">
                          <Activity className="w-8 h-8 text-slate-600 mb-2" />
                          No recent activity.
                        </div>
                      ) : leads.slice(0, 5).map(lead => (
                        <div key={lead.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                          <div className="flex items-center gap-4">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-white font-medium text-sm">Lead for {lead.plan_interest || 'General'}</p>
                              <p className="text-xs text-gray-400 mt-1">{lead.phone || 'No phone'} • {lead.pincode || 'No PIN'}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Kanban Pipeline View */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsAddLeadModalOpen(true)} 
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" /> Add New Client
                  </button>
                </div>
                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
                {STAGES.map(stage => (
                  <div key={stage} className="min-w-[300px] flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col max-h-[70vh] md:h-[70vh]">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                      <h3 className="font-bold text-gray-300 capitalize flex items-center gap-2">
                        {stage === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                        {stage === 'contacted' && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
                        {stage === 'converted' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                        {stage === 'lost' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        {stage}
                      </h3>
                      <span className="bg-slate-800 text-gray-400 text-xs px-2 py-1 rounded-full font-medium">
                        {getLeadsByStage(stage).length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {getLeadsByStage(stage).map(lead => (
                        <div key={lead.id} className="glass-panel bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white truncate max-w-[180px]">{lead.name || 'Anonymous User'}</h4>
                            <span className="text-[10px] text-gray-500 bg-slate-900 px-2 py-1 rounded">{new Date(lead.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-teal-400 font-medium mb-1">{lead.plan_interest}</p>
                          <p className="text-xs text-gray-400 mb-3">{lead.phone} • Age {lead.age}</p>
                          
                          {/* Quick Actions */}
                          <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                            <select 
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className="text-xs bg-slate-900 text-gray-300 border border-slate-700 rounded p-1 focus:outline-none focus:border-teal-500"
                            >
                              <option value="new">Move to New</option>
                              <option value="contacted">Move to Contacted</option>
                              <option value="converted">Convert</option>
                              <option value="lost">Mark as Lost</option>
                            </select>
                            <button onClick={() => setSelectedLead(lead)} className="text-xs font-medium text-blue-400 hover:text-blue-300">View</button>
                          </div>
                        </div>
                      ))}
                      {getLeadsByStage(stage).length === 0 && (
                        <div className="text-center py-8 text-sm text-gray-600 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center">
                          <Users className="w-8 h-8 text-slate-600 mb-2" />
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            )}

            {/* Team View */}
            {activeTab === 'team' && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={agentSearch}
                    onChange={e => setAgentSearch(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 glass-panel rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="Search team members by Name or ID..." 
                  />
                </div>

                <div className="glass-panel rounded-3xl p-6 md:p-10 border border-slate-700/50">
                  <div className="space-y-4">
                    {agents.filter(a => a.id.toLowerCase().includes(agentSearch.toLowerCase()) || a.name.toLowerCase().includes(agentSearch.toLowerCase())).map(agent => (
                      <div key={agent.id} className="bg-slate-800/80 border border-slate-600/50 p-4 rounded-xl flex items-center justify-between shadow-lg hover:bg-slate-700/80 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${agent.type === 'leader' ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-slate-700 border border-slate-500'}`}>
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                              {agent.type === 'leader' ? (
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded border border-blue-500/30 font-medium">{agent.role}</span>
                              ) : (
                                <span className="text-xs text-gray-400 border border-gray-600 px-2 py-0.5 rounded">{agent.role}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 font-mono mt-0.5">{agent.id}</p>
                          </div>
                        </div>
                        <div className="hidden sm:flex gap-6 text-right">
                          <div>
                            <p className="text-xs text-gray-500">GWP</p>
                            <p className="font-bold text-teal-400">{agent.gwp || '₹0'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Policies</p>
                            <p className="font-semibold text-white">{agent.policies || '0'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {agents.filter(a => a.id.toLowerCase().includes(agentSearch.toLowerCase()) || a.name.toLowerCase().includes(agentSearch.toLowerCase())).length === 0 && (
                      <div className="text-center text-gray-400 py-10 flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-slate-600 mb-4" />
                        No team members found matching "{agentSearch}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Marketing View */}
            {activeTab === 'marketing' && (
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Marketing Asset Library</h3>
                  <p className="text-sm text-gray-400">Download brochures, flyers, and social media posts to share with your clients.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {marketingAssets.length === 0 ? (
                    <div className="col-span-3 text-center py-10 text-gray-500 border-2 border-dashed border-slate-700 rounded-xl">
                      No marketing assets available.
                    </div>
                  ) : (
                    marketingAssets.map((asset) => (
                      <div key={asset.id} className="glass-panel p-5 rounded-2xl border border-slate-700/50 flex flex-col justify-between group hover:border-teal-500/50 transition-colors">
                        <div>
                          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-teal-400 font-bold mb-4">
                            {asset.type}
                          </div>
                          <h4 className="font-bold text-white mb-1">{asset.title}</h4>
                          <p className="text-xs text-gray-400 mb-4">Size: {asset.size}</p>
                        </div>
                        <a href={asset.url} className="w-full text-center py-2 bg-slate-800 group-hover:bg-teal-500 group-hover:text-slate-900 text-teal-400 font-medium rounded-lg transition-colors text-sm block">
                          Download
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {/* Claims View */}
            {activeTab === 'claims' && (
              <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Claims Management</h3>
                    <p className="text-sm text-gray-400">View and update claims assigned to you.</p>
                  </div>
                  <Link to="/claims/new" className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                    File New Claim
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {claims.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-500 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center">
                      <Activity className="w-12 h-12 text-slate-600 mb-4" />
                      No claims assigned to you yet.
                    </div>
                  ) : (
                    claims.map((claim) => (
                      <div key={claim.id} className="glass-panel p-5 rounded-2xl border border-slate-700/50 hover:border-orange-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                              {claim.type === 'new_claim' ? 'New Claim' : 'Existing Link'}
                            </span>
                            <h4 className="font-bold text-white mt-2 truncate">{claim.reference_number || claim.policy_id || 'Unknown Policy'}</h4>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            claim.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            claim.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                            claim.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {claim.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-xs text-gray-400"><span className="text-gray-500">Date:</span> {claim.incident_date || new Date(claim.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400"><span className="text-gray-500">Type:</span> {claim.claim_type || claim.insurer_name || 'General'}</p>
                          {claim.claim_amount && <p className="text-xs text-emerald-400 font-medium">Amount: ₹{claim.claim_amount.toLocaleString('en-IN')}</p>}
                        </div>
                        
                        <div className="pt-3 border-t border-slate-700">
                          <select 
                            value={claim.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              await supabase.from('claims').update({ status: newStatus }).eq('id', claim.id);
                              setClaims(claims.map(c => c.id === claim.id ? { ...c, status: newStatus } : c));
                            }}
                            className="w-full text-sm bg-slate-900 text-gray-300 border border-slate-700 rounded p-2 focus:outline-none focus:border-orange-500 transition-colors"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <LeadDetailsModal 
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={(id, updates) => {
          setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
        }}
      />

      {/* Add New Client Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddLeadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" /> Add New Client / Lead
              </h3>
              <p className="text-slate-400 text-xs">Record a new customer into your active sales pipeline.</p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={newLeadForm.age}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, age: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={newLeadForm.gender}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code</label>
                  <input
                    type="text"
                    placeholder="151505"
                    value={newLeadForm.pincode}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, pincode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Interest</label>
                  <select
                    value={newLeadForm.plan_interest}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, plan_interest: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="Term Life Insurance">Term Life Insurance</option>
                    <option value="Guaranteed Pension / Annuity">Guaranteed Pension / Annuity</option>
                    <option value="Motor / Vehicle Insurance">Motor / Vehicle Insurance</option>
                    <option value="Investment / Savings Plan">Investment / Savings Plan</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stage</label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="new">New (Uncontacted)</option>
                    <option value="contacted">Contacted (In Discussion)</option>
                    <option value="converted">Converted (Policy Issued)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Requirement</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Interested in 10L health cover for parents or 50L term cover"
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingLead ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
