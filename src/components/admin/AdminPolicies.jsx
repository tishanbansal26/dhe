import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { 
  Plus, Edit2, Trash2, X, Upload, Hash, User, Shield, Briefcase, 
  DollarSign, Activity, Calendar, UploadCloud, ShieldCheck, Heart, 
  Car, Award, Users, CheckSquare, Sparkles, FileText, CheckCircle2, 
  ChevronRight, MessageCircle, AlertTriangle, Clock, Copy, Send, 
  ExternalLink, Filter, Search, Phone
} from 'lucide-react';
import { uploadDocument } from '../../lib/SupabaseStorageService';
import EmptyState from '../EmptyState';

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Filters
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState('health'); // 'health' | 'life' | 'motor'
  const [filterExpiry, setFilterExpiry] = useState('all'); // 'all' | 'urgent' | 'soon' | 'expired' | 'healthy'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'health' | 'life' | 'motor'
  const [filterAgent, setFilterAgent] = useState('all'); // 'all' | agentId
  const [searchTerm, setSearchTerm] = useState('');
  
  // WhatsApp Reminder Modal state
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedPolicyForReminder, setSelectedPolicyForReminder] = useState(null);
  const [reminderPhone, setReminderPhone] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');

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
      .select('*, customers(name, email, phone), agents(id, name, email, phone), insurance_plans(name, category)')
      .order('created_at', { ascending: false });
    
    if (!error) setPolicies(data || []);
    setLoading(false);
  };

  const fetchDropdownData = async () => {
    const [cRes, pRes, aRes] = await Promise.all([
      supabase.from('customers').select('id, name, email, phone').order('name'),
      supabase.from('insurance_plans').select('id, name, category').order('name'),
      supabase.from('agents').select('id, name, email, phone').order('name')
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

  // Expiry calculation helper
  const getExpiryInfo = (endDateStr) => {
    if (!endDateStr) return { daysLeft: 999, statusText: 'No Date', badgeColor: 'gray' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(endDateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { daysLeft, statusText: `Expired (${Math.abs(daysLeft)}d ago)`, badgeColor: 'red', type: 'expired' };
    } else if (daysLeft === 0) {
      return { daysLeft, statusText: 'Expires Today', badgeColor: 'rose', type: 'urgent' };
    } else if (daysLeft <= 7) {
      return { daysLeft, statusText: `Urgent (${daysLeft}d left)`, badgeColor: 'orange', type: 'urgent' };
    } else if (daysLeft <= 30) {
      return { daysLeft, statusText: `${daysLeft}d left`, badgeColor: 'amber', type: 'soon' };
    } else {
      return { daysLeft, statusText: `${daysLeft}d remaining`, badgeColor: 'emerald', type: 'healthy' };
    }
  };

  // Generate WhatsApp Message Template
  const generateWhatsAppMessage = (p) => {
    const customerName = p.customers?.name || 'Valued Customer';
    const planName = p.insurance_plans?.name || 'Insurance Policy';
    const policyNum = p.policy_number || 'N/A';
    const expDate = p.end_date ? new Date(p.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Soon';
    const expiryInfo = getExpiryInfo(p.end_date);
    const cat = (p.policy_type || p.insurance_plans?.category || 'health').toLowerCase();

    let text = '';
    if (cat.includes('motor') || cat.includes('car')) {
      const regNo = p.metadata?.vehicle_reg_number ? ` (${p.metadata.vehicle_reg_number})` : '';
      const makeModel = p.metadata?.vehicle_make_model || 'Vehicle';
      text = `Namaste *${customerName}* Ji 🙏,\n\nThis is an important reminder from *Radhe Investments* regarding your *Motor Insurance Policy*.\n\n🚗 *Vehicle & Policy Details:*\n• Vehicle: *${makeModel}${regNo}*\n• Policy Number: *${policyNum}*\n• Plan: *${planName}*\n• Expiry Date: *${expDate}* (${expiryInfo.statusText})\n\n⚠️ *Protect Your No Claim Bonus (NCB):*\nRenewing before *${expDate}* protects your NCB discount and avoids costly traffic fines or vehicle break-in inspection.\n\n👉 Reply directly to this message to renew in 2 minutes with Zero-Depreciation & 24x7 Roadside Assistance.\n\nWarm Regards,\n*Radhe Investments & Advisory*\n📞 Helpline: +91 98765 43210\n🌐 https://radheinv.site`;
    } else if (cat.includes('life') || cat.includes('term')) {
      const sumAssured = p.sum_insured ? `₹${parseFloat(p.sum_insured).toLocaleString('en-IN')}` : 'Full Cover';
      const nominee = p.metadata?.nominee_name ? `\n• Nominee: *${p.metadata.nominee_name}*` : '';
      text = `Namaste *${customerName}* Ji 🙏,\n\nGreetings from *Radhe Investments*.\n\n🛡️ This is a gentle reminder that your *Life / Term Insurance Premium* for policy *#${policyNum}* (*${planName}*) is due.\n\n• Sum Assured: *${sumAssured}*${nominee}\n• Due Date: *${expDate}* (${expiryInfo.statusText})\n\nKeeping your term policy active ensures uninterrupted financial security for your family.\n\n👉 Reply to this message for instant payment link or support.\n\nWarm Regards,\n*Radhe Investments & Advisory*\n📞 Helpline: +91 98765 43210\n🌐 https://radheinv.site`;
    } else {
      const sumInsured = p.sum_insured ? `₹${parseFloat(p.sum_insured).toLocaleString('en-IN')}` : 'Full Cover';
      text = `Namaste *${customerName}* Ji 🙏,\n\nThis is a friendly reminder from *Radhe Investments* regarding your *Health Insurance Policy*.\n\n🏥 *Policy Details:*\n• Policy Number: *${policyNum}*\n• Plan: *${planName}*\n• Sum Insured: *${sumInsured}*\n• Expiration Date: *${expDate}* (${expiryInfo.statusText})\n\n⚠️ *Why renew on time?*\nRenewing before expiry ensures continuous coverage for pre-existing diseases and saves your accumulated 100% No Claim Bonus.\n\n👉 Reply here or call our advisor desk at +91 98765 43210 to renew with cashless hospital benefits.\n\nWarm Regards,\n*Radhe Investments & Advisory*\n🌐 https://radheinv.site`;
    }

    return text;
  };

  const handleOpenWhatsAppModal = (p) => {
    setSelectedPolicyForReminder(p);
    let phone = p.customers?.phone || '';
    // Clean phone number
    phone = phone.replace(/[^0-9]/g, '');
    if (phone.length === 10) phone = '91' + phone;
    setReminderPhone(phone);
    setReminderMessage(generateWhatsAppMessage(p));
    setIsWhatsappModalOpen(true);
  };

  const handleSendWhatsApp = () => {
    if (!reminderPhone) {
      toast.error('Please enter a valid mobile number with country code (e.g. 919876543210)');
      return;
    }
    const cleanNumber = reminderPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(reminderMessage);
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`;
    window.open(url, '_blank');
    toast.success('WhatsApp Web / App opened with pre-filled message!');
    setIsWhatsappModalOpen(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(reminderMessage);
    toast.success('Message copied to clipboard!');
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

  // Metric calculations
  const totalPolicies = policies.length;
  const healthPoliciesCount = policies.filter(p => {
    const cat = (p.policy_type || p.insurance_plans?.category || 'health').toLowerCase();
    return cat.includes('health') || cat.includes('mediclaim');
  }).length;
  const lifePoliciesCount = policies.filter(p => {
    const cat = (p.policy_type || p.insurance_plans?.category || '').toLowerCase();
    return cat.includes('life') || cat.includes('term');
  }).length;
  const motorPoliciesCount = policies.filter(p => {
    const cat = (p.policy_type || p.insurance_plans?.category || '').toLowerCase();
    return cat.includes('motor') || cat.includes('car') || cat.includes('vehicle');
  }).length;

  const urgentRenewals = policies.filter(p => {
    const info = getExpiryInfo(p.end_date);
    return info.type === 'urgent';
  }).length;
  const soonRenewals = policies.filter(p => {
    const info = getExpiryInfo(p.end_date);
    return info.type === 'soon';
  }).length;
  const expiredPolicies = policies.filter(p => {
    const info = getExpiryInfo(p.end_date);
    return info.type === 'expired';
  }).length;

  // Filter policies based on Category, Advisor, Expiry tab & Search query
  const filteredPolicies = policies.filter(p => {
    const expiryInfo = getExpiryInfo(p.end_date);
    const cat = (p.policy_type || p.insurance_plans?.category || 'health').toLowerCase();
    
    // Filter by Category
    if (filterCategory !== 'all') {
      if (filterCategory === 'health' && !cat.includes('health') && !cat.includes('mediclaim')) return false;
      if (filterCategory === 'life' && !cat.includes('life') && !cat.includes('term')) return false;
      if (filterCategory === 'motor' && !cat.includes('motor') && !cat.includes('car') && !cat.includes('vehicle')) return false;
    }

    // Filter by Advisor
    if (filterAgent !== 'all') {
      if (filterAgent === 'unassigned' && p.agent_id) return false;
      if (filterAgent !== 'unassigned' && p.agent_id !== filterAgent) return false;
    }

    // Filter by Expiry Tab
    if (filterExpiry === 'urgent' && expiryInfo.type !== 'urgent') return false;
    if (filterExpiry === 'soon' && expiryInfo.type !== 'soon') return false;
    if (filterExpiry === 'expired' && expiryInfo.type !== 'expired') return false;
    if (filterExpiry === 'healthy' && expiryInfo.type !== 'healthy') return false;

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const numMatch = p.policy_number?.toLowerCase().includes(q);
      const nameMatch = p.customers?.name?.toLowerCase().includes(q);
      const emailMatch = p.customers?.email?.toLowerCase().includes(q);
      const planMatch = p.insurance_plans?.name?.toLowerCase().includes(q);
      const agentMatch = p.agents?.name?.toLowerCase().includes(q);
      const regMatch = p.metadata?.vehicle_reg_number?.toLowerCase().includes(q);
      return numMatch || nameMatch || emailMatch || planMatch || agentMatch || regMatch;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Renewal Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Active Policies</p>
            <h4 className="text-2xl font-bold text-white mt-1">{totalPolicies}</h4>
            <p className="text-[11px] text-teal-400 mt-0.5">Across Health, Life & Motor</p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => setFilterExpiry('urgent')}
          className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
            filterExpiry === 'urgent' 
              ? 'border-orange-500 bg-orange-950/30 ring-1 ring-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
              : 'border-slate-700/60 bg-slate-900/60 hover:border-orange-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-300 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Urgent Renewals
              </p>
              <h4 className="text-2xl font-bold text-orange-400 mt-1">{urgentRenewals}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Expiring in ≤ 7 Days</p>
            </div>
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilterExpiry('soon')}
          className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
            filterExpiry === 'soon' 
              ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
              : 'border-slate-700/60 bg-slate-900/60 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Expiring Soon
              </p>
              <h4 className="text-2xl font-bold text-amber-400 mt-1">{soonRenewals}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Due in 8 to 30 Days</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilterExpiry('expired')}
          className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
            filterExpiry === 'expired' 
              ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
              : 'border-slate-700/60 bg-slate-900/60 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-300 uppercase tracking-wider">Lapsed / Expired</p>
              <h4 className="text-2xl font-bold text-rose-400 mt-1">{expiredPolicies}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Needs Immediate Revival</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. Main Policy Table Container */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50 relative space-y-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Policy & Renewal Management
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Track policy lines (Health, Life, Motor), servicing advisors, and dispatch 1-click WhatsApp alerts.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Advisor Dropdown Filter */}
            <div className="relative">
              <select
                value={filterAgent}
                onChange={e => setFilterAgent(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-teal-300 focus:outline-none focus:border-teal-500"
              >
                <option value="all">👥 All Advisors ({agents.length})</option>
                <option value="unassigned">🏢 Direct / House Account</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>👤 {a.name}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search policy #, customer, advisor, reg..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button 
              onClick={() => {
                setNewPolicy(initialPolicyState);
                setIsAddModalOpen(true);
              }}
              className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Policy
            </button>
          </div>
        </div>

        {/* Category & Expiry Filter Pills */}
        <div className="space-y-2 border-y border-slate-800 py-3">
          
          {/* Row 1: Category Domains */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
              <Shield className="w-3.5 h-3.5 text-teal-400" /> Category:
            </span>

            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCategory === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800/60 text-gray-300 hover:bg-slate-800'
              }`}
            >
              All Lines ({totalPolicies})
            </button>

            <button
              onClick={() => setFilterCategory('health')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                filterCategory === 'health' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <Heart className="w-3 h-3" />
              Health Insurance ({healthPoliciesCount})
            </button>

            <button
              onClick={() => setFilterCategory('life')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                filterCategory === 'life' ? 'bg-purple-500 text-white font-bold' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              <Shield className="w-3 h-3" />
              Life & Term Cover ({lifePoliciesCount})
            </button>

            <button
              onClick={() => setFilterCategory('motor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                filterCategory === 'motor' ? 'bg-blue-500 text-white font-bold' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <Car className="w-3 h-3" />
              Motor Insurance ({motorPoliciesCount})
            </button>
          </div>

          {/* Row 2: Expiry Status Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> Expiry:
            </span>

            <button
              onClick={() => setFilterExpiry('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterExpiry === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All Statuses
            </button>

            <button
              onClick={() => setFilterExpiry('urgent')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                filterExpiry === 'urgent' ? 'bg-orange-500 text-white font-bold' : 'text-orange-400 hover:bg-orange-500/10'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Urgent ≤ 7 Days ({urgentRenewals})
            </button>

            <button
              onClick={() => setFilterExpiry('soon')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                filterExpiry === 'soon' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Clock className="w-3 h-3" />
              Expiring in 30 Days ({soonRenewals})
            </button>

            <button
              onClick={() => setFilterExpiry('expired')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
                filterExpiry === 'expired' ? 'bg-rose-500 text-white font-bold' : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              Lapsed / Expired ({expiredPolicies})
            </button>

            <button
              onClick={() => setFilterExpiry('healthy')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterExpiry === 'healthy' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              Healthy Cover (&gt; 30d)
            </button>
          </div>

        </div>

        {/* Table Content */}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-gray-300">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Insurance Line</th>
                  <th className="px-4 py-3">Policy Number</th>
                  <th className="px-4 py-3">Customer & Contact</th>
                  <th className="px-4 py-3">Plan Details</th>
                  <th className="px-4 py-3">Assigned Advisor</th>
                  <th className="px-4 py-3">Sum Insured</th>
                  <th className="px-4 py-3">Expiry Countdown</th>
                  <th className="px-4 py-3 text-center">1-Click Renewal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded-full w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                    <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-20"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-16"></div></td>
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
                  <th className="px-4 py-3 rounded-l-lg">Insurance Line</th>
                  <th className="px-4 py-3">Policy Number</th>
                  <th className="px-4 py-3">Customer & Contact</th>
                  <th className="px-4 py-3">Plan Details</th>
                  <th className="px-4 py-3">Assigned Advisor</th>
                  <th className="px-4 py-3">Sum Insured</th>
                  <th className="px-4 py-3">Expiry Countdown</th>
                  <th className="px-4 py-3 text-center">1-Click Renewal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredPolicies.map(p => {
                  const type = (p.policy_type || p.insurance_plans?.category || 'health').toLowerCase();
                  const expiryInfo = getExpiryInfo(p.end_date);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      
                      {/* 1. Insurance Line (Domain) */}
                      <td className="px-4 py-4">
                        {type.includes('motor') || type.includes('car') || type.includes('vehicle') ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm">
                            <Car className="w-3.5 h-3.5" /> Motor
                          </span>
                        ) : type.includes('life') || type.includes('term') ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm">
                            <Shield className="w-3.5 h-3.5" /> Life
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
                            <Heart className="w-3.5 h-3.5" /> Health
                          </span>
                        )}
                      </td>

                      {/* 2. Policy Number & Vehicle info */}
                      <td className="px-4 py-4 font-semibold text-white">
                        <span className="font-mono text-sm">{p.policy_number}</span>
                        {p.metadata?.vehicle_reg_number && (
                          <div className="text-[11px] text-blue-300 font-mono mt-0.5 flex items-center gap-1">
                            <Car className="w-3 h-3" /> {p.metadata.vehicle_reg_number}
                          </div>
                        )}
                      </td>

                      {/* 3. Customer Contact */}
                      <td className="px-4 py-4">
                        <span className="text-teal-400 font-medium">{p.customers?.name || 'Unknown'}</span>
                        <div className="text-xs text-gray-400">{p.customers?.email}</div>
                        {p.customers?.phone && (
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-teal-500" /> {p.customers.phone}
                          </div>
                        )}
                      </td>

                      {/* 4. Plan Details */}
                      <td className="px-4 py-4 text-gray-200">
                        <div className="font-medium">{p.insurance_plans?.name || 'Custom Plan'}</div>
                        {p.document_url && (
                          <a href={p.document_url} target="_blank" rel="noreferrer" className="text-[11px] text-teal-400 hover:underline inline-flex items-center gap-0.5 mt-0.5">
                            <FileText className="w-3 h-3" /> View PDF
                          </a>
                        )}
                      </td>

                      {/* 5. Assigned Advisor */}
                      <td className="px-4 py-4">
                        {p.agents?.name ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs shrink-0 shadow-sm">
                              {p.agents.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium text-xs flex items-center gap-1">
                                {p.agents.name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">
                                {p.agents.phone || p.agents.email || 'Licensed Advisor'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-gray-400 border border-slate-700">
                            <Briefcase className="w-3 h-3 text-slate-500" /> Direct / House Account
                          </span>
                        )}
                      </td>

                      {/* 6. Sum Insured */}
                      <td className="px-4 py-4 text-emerald-400 font-semibold">
                        {p.sum_insured ? `₹${parseFloat(p.sum_insured).toLocaleString('en-IN')}` : '-'}
                      </td>

                      {/* 7. Expiry Countdown */}
                      <td className="px-4 py-4">
                        <div className="text-xs text-gray-300">
                          {p.end_date ? new Date(p.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                            expiryInfo.type === 'expired' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                            expiryInfo.type === 'urgent' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 animate-pulse' :
                            expiryInfo.type === 'soon' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {expiryInfo.statusText}
                          </span>
                        </div>
                      </td>

                      {/* 8. 1-Click WhatsApp Renewal */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppModal(p)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] inline-flex items-center gap-1.5 group"
                          title="Open WhatsApp Renewal Dispatcher"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-slate-950 group-hover:scale-110 transition-transform" />
                          <span>WhatsApp</span>
                        </button>
                      </td>

                      {/* 9. Status */}
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                          p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {p.status ? p.status.toUpperCase() : 'ACTIVE'}
                        </span>
                      </td>

                      {/* 10. Manage */}
                      <td className="px-4 py-4">
                        <select 
                          value={p.status || 'active'}
                          onChange={(e) => updateStatus(p.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-gray-200 focus:outline-none focus:border-teal-500"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="expired">Expired</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPolicies.length === 0 && (
          <EmptyState
            title="No Policies Match Criteria"
            description="Try adjusting your insurance category, advisor selection, expiry filter, or search keywords."
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. 1-CLICK WHATSAPP RENEWAL REMINDER DISPATCHER MODAL */}
      {/* ============================================================ */}
      {isWhatsappModalOpen && selectedPolicyForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl my-8 relative flex flex-col shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl">
                  <MessageCircle className="w-6 h-6 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    WhatsApp Renewal Dispatcher
                  </h3>
                  <p className="text-xs text-gray-400">
                    Review and dispatch instant renewal notice to {selectedPolicyForReminder.customers?.name || 'Customer'}.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsWhatsappModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Recipient Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Customer Mobile Number (With Country Code e.g. 91...)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input 
                    type="text"
                    value={reminderPhone}
                    onChange={e => setReminderPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Message Content Preview */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Message Preview & Customization
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Text
                  </button>
                </div>
                <textarea
                  rows={10}
                  value={reminderMessage}
                  onChange={e => setReminderMessage(e.target.value)}
                  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Policy Quick Summary Pill */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs text-gray-300">
                <div>
                  <span className="text-gray-400">Policy: </span>
                  <span className="font-semibold text-white">{selectedPolicyForReminder.policy_number}</span>
                  <span className="text-gray-500 mx-2">|</span>
                  <span className="text-gray-400">Plan: </span>
                  <span className="font-semibold text-white">{selectedPolicyForReminder.insurance_plans?.name}</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {getExpiryInfo(selectedPolicyForReminder.end_date).statusText}
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 rounded-b-3xl flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsWhatsappModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-slate-700"
                >
                  <Copy className="w-4 h-4" /> Copy Message
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Open in WhatsApp Web / App
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. DYNAMIC CATEGORY-SPECIFIC ADD POLICY MODAL */}
      {/* ============================================================ */}
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
                        {plans.map(p => (
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
