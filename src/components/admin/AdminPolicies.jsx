import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { 
  Plus, Edit2, Trash2, X, Upload, Hash, User, Shield, Briefcase, 
  DollarSign, Activity, Calendar, UploadCloud, ShieldCheck, Heart, 
  Car, Award, Users, CheckSquare, Sparkles, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';
import { uploadDocument } from '../../lib/SupabaseStorageService';
import EmptyState from '../EmptyState';

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState('health'); // 'health' | 'life' | 'motor'

  const initialPolicyState = {
    policy_number: '',
    customer_id: '',
    plan_id: '',
    agent_id: '',
    sum_insured: '',
    start_date: '',
    end_date: '',
    status: 'active',
    document_url: '',
    // Category-specific fields stored in metadata
    metadata: {
      // Health
      tpa_name: 'Medi Assist TPA',
      room_rent_type: 'No Capping / Single Private Room',
      copay: '0%',
      members_count: '1',
      members_list: '',
      ped_declared: 'None',
      
      // Life
      policy_term_years: '30',
      ppt_years: 'Regular Pay',
      premium_frequency: 'Annual',
      premium_amount: '',
      nominee_name: '',
      nominee_relation: 'Spouse',
      nominee_age: '',
      riders: ['Accidental Death Benefit'],

      // Motor
      vehicle_type: '4-Wheeler (Car)',
      vehicle_reg_number: '',
      vehicle_make_model: '',
      manufacturing_year: new Date().getFullYear().toString(),
      fuel_type: 'Petrol',
      idv_amount: '',
      ncb_percentage: '20%',
      motor_coverage_type: 'Comprehensive Package',
      addons: ['Zero Depreciation (Bumper to Bumper)', '24x7 Roadside Assistance (RSA)']
    }
  };

  const [newPolicy, setNewPolicy] = useState(initialPolicyState);
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
      supabase.from('customers').select('id, name, email').order('name'),
      supabase.from('insurance_plans').select('id, name, category').order('name'),
      supabase.from('agents').select('id, name').order('name')
    ]);
    if (cRes.data) setCustomers(cRes.data);
    if (pRes.data) setPlans(pRes.data);
    if (aRes.data) setAgents(aRes.data);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('policies').update({ status }).eq('id', id);
    if (!error) {
      toast.success('Status updated');
      fetchPolicies();
    } else {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const handleMetadataChange = (field, value) => {
    setNewPolicy(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const toggleArrayAddon = (arrayField, item) => {
    const currentList = newPolicy.metadata[arrayField] || [];
    const updated = currentList.includes(item)
      ? currentList.filter(x => x !== item)
      : [...currentList, item];
    handleMetadataChange(arrayField, updated);
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    if (!newPolicy.policy_number || !newPolicy.customer_id || !newPolicy.plan_id || !newPolicy.start_date || !newPolicy.end_date) {
      toast.error('Please fill all required basic fields (Policy #, Customer, Plan, Dates)');
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
        policy_type: policyType,
        metadata: {
          ...newPolicy.metadata,
          category_proforma: policyType
        },
        document_url: newPolicy.document_url
      };

      if (selectedFile) {
        toast.loading('Uploading policy document...', { id: 'upload' });
        const { data: uploadData, error: uploadError } = await uploadDocument('documents', 'policies', selectedFile);
        if (uploadError) throw uploadError;
        payload.document_url = uploadData.url;
        toast.dismiss('upload');
      }

      const { error } = await supabase.from('policies').insert([payload]);
      
      if (error) throw error;
      
      toast.success(`${policyType.toUpperCase()} Policy added successfully!`);
      setIsAddModalOpen(false);
      setSelectedFile(null);
      setNewPolicy(initialPolicyState);
      fetchPolicies();
    } catch (err) {
      toast.error('Failed to add policy: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter plans matching current category if available
  const filteredPlans = plans.filter(p => {
    if (!p.category) return true;
    const cat = p.category.toLowerCase();
    if (policyType === 'health') return cat.includes('health') || cat.includes('medical');
    if (policyType === 'life') return cat.includes('life') || cat.includes('term') || cat.includes('pension');
    if (policyType === 'motor') return cat.includes('motor') || cat.includes('car') || cat.includes('vehicle');
    return true;
  });

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            Policy Management
          </h3>
          <p className="text-xs text-gray-400 mt-1">Manage active policies across Health, Life, and Motor portfolios.</p>
        </div>
        <button 
          onClick={() => {
            setNewPolicy(initialPolicyState);
            setIsAddModalOpen(true);
          }}
          className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
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
                <th className="px-4 py-3 rounded-l-lg">Type</th>
                <th className="px-4 py-3">Policy Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Sum Insured</th>
                <th className="px-4 py-3">Validity</th>
                <th className="px-4 py-3">Doc</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded-full w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
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
                <th className="px-4 py-3 rounded-l-lg">Type</th>
                <th className="px-4 py-3">Policy Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Sum Insured</th>
                <th className="px-4 py-3">Validity</th>
                <th className="px-4 py-3">Doc</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {policies.map(p => {
                const type = (p.policy_type || p.insurance_plans?.category || 'health').toLowerCase();
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4">
                      {type.includes('motor') || type.includes('car') || type.includes('vehicle') ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Car className="w-3.5 h-3.5" /> Motor
                        </span>
                      ) : type.includes('life') || type.includes('term') ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Shield className="w-3.5 h-3.5" /> Life
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Heart className="w-3.5 h-3.5" /> Health
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">
                      {p.policy_number}
                      {p.metadata?.vehicle_reg_number && (
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">{p.metadata.vehicle_reg_number}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-teal-400 font-medium">{p.customers?.name || 'Unknown'}</span>
                      <div className="text-xs text-gray-400">{p.customers?.email}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-200">
                      {p.insurance_plans?.name || 'Custom Plan'}
                    </td>
                    <td className="px-4 py-4 text-emerald-400 font-semibold">
                      {p.sum_insured ? `₹${parseFloat(p.sum_insured).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">
                      <div><span className="text-gray-500">From:</span> {p.start_date ? new Date(p.start_date).toLocaleDateString() : '-'}</div>
                      <div><span className="text-gray-500">To:</span> {p.end_date ? new Date(p.end_date).toLocaleDateString() : '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      {p.document_url ? (
                        <a href={p.document_url} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300 underline text-xs font-semibold">
                          View PDF
                        </a>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                        p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {p.status ? p.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={p.status || 'active'}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-gray-200 focus:outline-none focus:border-teal-500"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {policies.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-12">
                    <EmptyState 
                      title="No Policies Found" 
                      description="There are currently no active policies issued in the system."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dynamic Category-Specific Add Policy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl my-8 relative flex flex-col max-h-[92vh] shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur-sm z-20 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  Add Customer Policy
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Select the insurance category below to open the dedicated proforma.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* STEP 1: Interactive Category Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Step 1: Choose Insurance Proforma
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Health */}
                  <button
                    type="button"
                    onClick={() => setPolicyType('health')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      policyType === 'health' 
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${policyType === 'health' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Health Insurance</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Mediclaim, TPA, Co-pay & Members</p>
                    </div>
                  </button>

                  {/* Life */}
                  <button
                    type="button"
                    onClick={() => setPolicyType('life')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      policyType === 'life' 
                        ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${policyType === 'life' ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-purple-400'}`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Life & Term Cover</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Nominee, PPT, Term & Riders</p>
                    </div>
                  </button>

                  {/* Motor */}
                  <button
                    type="button"
                    onClick={() => setPolicyType('motor')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      policyType === 'motor' 
                        ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${policyType === 'motor' ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-blue-400'}`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Motor Insurance</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Vehicle Reg, IDV, NCB & Zero-Dep</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* STEP 2: Dedicated Proforma Form */}
              <form id="add-policy-form" onSubmit={handleAddPolicy} className="space-y-6">
                
                {/* 1. Core Policy Information */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <h4 className="font-bold text-white text-sm">1. Core Policy & Account Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Policy Number *</label>
                      <input 
                        type="text" 
                        required
                        value={newPolicy.policy_number}
                        onChange={e => setNewPolicy({...newPolicy, policy_number: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                        placeholder="e.g. POL-2026-9812"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Customer / Policyholder *</label>
                      <select
                        required
                        value={newPolicy.customer_id}
                        onChange={e => setNewPolicy({...newPolicy, customer_id: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                      >
                        <option value="">Select Customer...</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Insurance Plan *</label>
                      <select
                        required
                        value={newPolicy.plan_id}
                        onChange={e => setNewPolicy({...newPolicy, plan_id: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                      >
                        <option value="">Select Plan...</option>
                        {(filteredPlans.length > 0 ? filteredPlans : plans).map(p => (
                          <option key={p.id} value={p.id}>{p.name} {p.category ? `(${p.category})` : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Servicing Agent</label>
                      <select
                        value={newPolicy.agent_id}
                        onChange={e => setNewPolicy({...newPolicy, agent_id: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                      >
                        <option value="">Direct / Head Office (Unassigned)</option>
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. DEDICATED PROFORMA SECTION ACCORDING TO CATEGORY */}
                
                {/* 🏥 HEALTH PROFORMA */}
                {policyType === 'health' && (
                  <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/30 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3">
                      <Heart className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-emerald-300 text-sm">2. Health Insurance Proforma Specifications</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Sum Insured (₹) *</label>
                        <input 
                          type="number"
                          required
                          value={newPolicy.sum_insured}
                          onChange={e => setNewPolicy({...newPolicy, sum_insured: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. 500000 (5 Lakhs)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">TPA (Third Party Administrator)</label>
                        <input 
                          type="text"
                          value={newPolicy.metadata.tpa_name || ''}
                          onChange={e => handleMetadataChange('tpa_name', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. Medi Assist / Raksha TPA / In-House"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Co-Payment</label>
                        <select
                          value={newPolicy.metadata.copay || '0%'}
                          onChange={e => handleMetadataChange('copay', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        >
                          <option value="0%">0% (Zero Co-pay)</option>
                          <option value="10%">10% Co-pay</option>
                          <option value="20%">20% Co-pay</option>
                          <option value="Senior Citizen 20%">Senior Citizen 20%</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Room Rent Eligibility</label>
                        <select
                          value={newPolicy.metadata.room_rent_type || 'No Capping / Single Private Room'}
                          onChange={e => handleMetadataChange('room_rent_type', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        >
                          <option value="No Capping / Single Private AC Room">No Capping / Single Private AC Room</option>
                          <option value="1% of Sum Insured per Day">1% of Sum Insured per Day</option>
                          <option value="Twin Sharing Room">Twin Sharing Room</option>
                          <option value="Any Room (Including Suite)">Any Room (Including Suite)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Covered Members Count</label>
                        <select
                          value={newPolicy.metadata.members_count || '1'}
                          onChange={e => handleMetadataChange('members_count', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        >
                          <option value="1">1 (Individual Self)</option>
                          <option value="2">2 (1 Adult + 1 Child / Self + Spouse)</option>
                          <option value="3">3 (2 Adults + 1 Child)</option>
                          <option value="4">4 (2 Adults + 2 Children)</option>
                          <option value="5+">5+ (Family Floater + Parents)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Insured Members Breakdown & PED Disclosures</label>
                        <input 
                          type="text"
                          value={newPolicy.metadata.members_list || ''}
                          onChange={e => handleMetadataChange('members_list', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. Self (Age 34), Spouse (Age 31), Child 1 (Age 5) | PED: Hypertension (Self)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 🛡️ LIFE PROFORMA */}
                {policyType === 'life' && (
                  <div className="bg-purple-950/20 p-5 rounded-2xl border border-purple-500/30 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <h4 className="font-bold text-purple-300 text-sm">2. Life & Term Insurance Proforma Specifications</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Sum Assured / Death Benefit (₹) *</label>
                        <input 
                          type="number"
                          required
                          value={newPolicy.sum_insured}
                          onChange={e => setNewPolicy({...newPolicy, sum_insured: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="e.g. 10000000 (1 Crore)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Policy Term (Years)</label>
                        <input 
                          type="text"
                          value={newPolicy.metadata.policy_term_years || '30'}
                          onChange={e => handleMetadataChange('policy_term_years', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="e.g. 30 Years / Till Age 75"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Premium Paying Term (PPT)</label>
                        <select
                          value={newPolicy.metadata.ppt_years || 'Regular Pay'}
                          onChange={e => handleMetadataChange('ppt_years', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                        >
                          <option value="Regular Pay">Regular Pay (Equal to Policy Term)</option>
                          <option value="Limited 5 Pay">Limited 5 Pay (Pay 5 Years)</option>
                          <option value="Limited 10 Pay">Limited 10 Pay (Pay 10 Years)</option>
                          <option value="Pay till 60">Pay Till Age 60</option>
                          <option value="Single Pay">Single Pay (One-Time)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Premium Payment Frequency</label>
                        <select
                          value={newPolicy.metadata.premium_frequency || 'Annual'}
                          onChange={e => handleMetadataChange('premium_frequency', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                        >
                          <option value="Annual">Annual</option>
                          <option value="Half-Yearly">Half-Yearly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Monthly">Monthly (NACH / Auto-Debit)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Nominee Full Name</label>
                        <input 
                          type="text"
                          value={newPolicy.metadata.nominee_name || ''}
                          onChange={e => handleMetadataChange('nominee_name', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="e.g. Priya Sharma"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Nominee Relationship & Age</label>
                        <div className="flex gap-2">
                          <select
                            value={newPolicy.metadata.nominee_relation || 'Spouse'}
                            onChange={e => handleMetadataChange('nominee_relation', e.target.value)}
                            className="w-2/3 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                          >
                            <option value="Spouse">Spouse</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Brother">Brother</option>
                          </select>
                          <input 
                            type="number"
                            value={newPolicy.metadata.nominee_age || ''}
                            onChange={e => handleMetadataChange('nominee_age', e.target.value)}
                            className="w-1/3 px-2 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                            placeholder="Age"
                          />
                        </div>
                      </div>

                      {/* Riders */}
                      <div className="md:col-span-3 pt-2">
                        <label className="block text-xs font-medium text-gray-300 mb-2">Attached Policy Riders</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            'Accidental Death Benefit',
                            'Critical Illness Benefit',
                            'Waiver of Premium (WOP)',
                            'Accidental Total Disability'
                          ].map(rider => {
                            const isChecked = (newPolicy.metadata.riders || []).includes(rider);
                            return (
                              <button
                                key={rider}
                                type="button"
                                onClick={() => toggleArrayAddon('riders', rider)}
                                className={`text-xs p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                                  isChecked 
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold' 
                                    : 'bg-slate-900 border-slate-700 text-gray-400 hover:border-slate-600'
                                }`}
                              >
                                <CheckSquare className={`w-3.5 h-3.5 ${isChecked ? 'text-purple-400' : 'text-slate-600'}`} />
                                <span className="truncate">{rider}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🚗 MOTOR PROFORMA */}
                {policyType === 'motor' && (
                  <div className="bg-blue-950/20 p-5 rounded-2xl border border-blue-500/30 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 border-b border-blue-500/20 pb-3">
                      <Car className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold text-blue-300 text-sm">2. Motor Insurance Proforma Specifications</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Vehicle Type</label>
                        <select
                          value={newPolicy.metadata.vehicle_type || '4-Wheeler (Car)'}
                          onChange={e => handleMetadataChange('vehicle_type', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="4-Wheeler (Car)">4-Wheeler (Private Car)</option>
                          <option value="2-Wheeler (Two-Wheeler/Bike)">2-Wheeler (Bike/Scooter)</option>
                          <option value="Commercial Vehicle">Commercial Vehicle (Taxi / Goods)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Registration Number *</label>
                        <input 
                          type="text"
                          value={newPolicy.metadata.vehicle_reg_number || ''}
                          onChange={e => handleMetadataChange('vehicle_reg_number', e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-mono tracking-wider focus:outline-none focus:border-blue-500"
                          placeholder="e.g. PB-31-AA-1234"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Vehicle Make & Model</label>
                        <input 
                          type="text"
                          value={newPolicy.metadata.vehicle_make_model || ''}
                          onChange={e => handleMetadataChange('vehicle_make_model', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g. Hyundai Creta 1.5 SX"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Manufacturing Year</label>
                        <input 
                          type="number"
                          value={newPolicy.metadata.manufacturing_year || ''}
                          onChange={e => handleMetadataChange('manufacturing_year', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="2023"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Fuel Type</label>
                        <select
                          value={newPolicy.metadata.fuel_type || 'Petrol'}
                          onChange={e => handleMetadataChange('fuel_type', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric (EV)">Electric (EV)</option>
                          <option value="CNG">CNG / LPG</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Insured Declared Value (IDV ₹) *</label>
                        <input 
                          type="number"
                          value={newPolicy.sum_insured}
                          onChange={e => {
                            setNewPolicy({...newPolicy, sum_insured: e.target.value});
                            handleMetadataChange('idv_amount', e.target.value);
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g. 1150000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">No Claim Bonus (NCB)</label>
                        <select
                          value={newPolicy.metadata.ncb_percentage || '20%'}
                          onChange={e => handleMetadataChange('ncb_percentage', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="0%">0% (New Vehicle / Claim Made)</option>
                          <option value="20%">20% (1 Claim-Free Year)</option>
                          <option value="25%">25% (2 Claim-Free Years)</option>
                          <option value="35%">35% (3 Claim-Free Years)</option>
                          <option value="45%">45% (4 Claim-Free Years)</option>
                          <option value="50%">50% (5+ Claim-Free Years)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Motor Coverage Plan Type</label>
                        <select
                          value={newPolicy.metadata.motor_coverage_type || 'Comprehensive Package'}
                          onChange={e => handleMetadataChange('motor_coverage_type', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="Comprehensive Package">Comprehensive Package (OD + TP)</option>
                          <option value="Zero Depreciation (Bumper-to-Bumper)">Zero Depreciation (Bumper-to-Bumper Comprehensive)</option>
                          <option value="Standalone Own Damage (OD)">Standalone Own Damage (OD)</option>
                          <option value="Third Party Only (TP)">Third Party Only (TP Legal Liability)</option>
                        </select>
                      </div>

                      {/* Add-ons */}
                      <div className="md:col-span-3 pt-2">
                        <label className="block text-xs font-medium text-gray-300 mb-2">Selected Motor Add-on Bundles</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            'Zero Depreciation (Bumper to Bumper)',
                            '24x7 Roadside Assistance (RSA)',
                            'Engine & Gearbox Protector',
                            'Return to Invoice (RTI)',
                            'Consumables Cover',
                            'Key & Lock Replacement',
                            'Compulsory Personal Accident (CPA ₹15L)'
                          ].map(addon => {
                            const isChecked = (newPolicy.metadata.addons || []).includes(addon);
                            return (
                              <button
                                key={addon}
                                type="button"
                                onClick={() => toggleArrayAddon('addons', addon)}
                                className={`text-xs p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                                  isChecked 
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-semibold' 
                                    : 'bg-slate-900 border-slate-700 text-gray-400 hover:border-slate-600'
                                }`}
                              >
                                <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${isChecked ? 'text-blue-400' : 'text-slate-600'}`} />
                                <span className="truncate">{addon}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Validity & Document Upload */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-white text-sm">3. Policy Validity & Digital Copy</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Policy Status *</label>
                      <select
                        required
                        value={newPolicy.status}
                        onChange={e => setNewPolicy({...newPolicy, status: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                      >
                        <option value="active">Active (In Force)</option>
                        <option value="pending">Pending Issuance</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Start Date *</label>
                      <input 
                        type="date"
                        required
                        value={newPolicy.start_date}
                        onChange={e => setNewPolicy({...newPolicy, start_date: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Expiry / End Date *</label>
                      <input 
                        type="date"
                        required
                        value={newPolicy.end_date}
                        onChange={e => setNewPolicy({...newPolicy, end_date: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="md:col-span-3 pt-2">
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Policy Document (PDF / Scan)</label>
                      <input 
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-500/20 file:text-teal-300 hover:file:bg-teal-500/30"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm rounded-b-3xl sticky bottom-0 z-20 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                Ready to issue {policyType.toUpperCase()} policy
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="add-policy-form"
                  disabled={isSubmitting}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : `Save ${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Policy`}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
