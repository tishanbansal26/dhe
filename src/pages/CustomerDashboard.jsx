import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, FileText, AlertCircle, Clock, ShieldX, FileX, User, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import DocumentUploader from '../components/DocumentUploader';
import { useSiteSettings } from '../lib/useSiteSettings';
import IsolatedBoundary from '../components/resilience/IsolatedBoundary';
import StatusBadge from '../components/ui/StatusBadge';
import ActionableEmptyState from '../components/ui/ActionableEmptyState';
import { executeResilientQuery } from '../lib/resilience/apiClient';
import { sanitizeString } from '../lib/security/validator';

export default function CustomerDashboard() {
  const { user, customerProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('policies'); // policies, claims, documents
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { settings } = useSiteSettings();
  const rawContactPhone = settings?.contact_phone || '+91 96036 10000';
  const cleanContactPhone = rawContactPhone.replace(/[^0-9]/g, '');
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    dob: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (customerProfile) {
      document.title = `Dashboard - ${customerProfile.name} | Radhe Investments`;
      setProfileForm({
        name: customerProfile.name || '',
        phone: customerProfile.phone || '',
        dob: customerProfile.dob || '',
        address: customerProfile.address || '',
        city: customerProfile.city || ''
      });
      fetchData();
    }
  }, [user, customerProfile, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Resilient policies fetch with offline caching
      const policiesRes = await executeResilientQuery('supabase_policies', () => 
        supabase
          .from('policies')
          .select('*, insurance_plans(name, category)')
          .eq('customer_id', customerProfile.id),
        { cacheKey: `policies_${customerProfile.id}`, fallbackData: [] }
      );
      if (policiesRes.data) setPolicies(policiesRes.data);

      // 2. Resilient claims fetch
      const claimsRes = await executeResilientQuery('supabase_claims', () =>
        supabase
          .from('claims')
          .select('*, policies(policy_number, insurance_plans(name))')
          .eq('customer_id', customerProfile.id),
        { cacheKey: `claims_${customerProfile.id}`, fallbackData: [] }
      );
      if (claimsRes.data) setClaims(claimsRes.data);

      // 3. Resilient documents fetch
      const docsRes = await executeResilientQuery('supabase_documents', () =>
        supabase
          .from('documents')
          .select('*')
          .eq('entity_type', 'customer')
          .eq('entity_id', customerProfile.id),
        { cacheKey: `docs_${customerProfile.id}`, fallbackData: [] }
      );
      if (docsRes.data) setDocuments(docsRes.data);

    } catch (err) {
      console.error('Customer dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const cleanName = sanitizeString(profileForm.name);
      const cleanPhone = sanitizeString(profileForm.phone);
      const cleanAddress = sanitizeString(profileForm.address);
      const cleanCity = sanitizeString(profileForm.city);

      const { error } = await supabase
        .from('customers')
        .update({
          name: cleanName,
          phone: cleanPhone,
          dob: profileForm.dob || null,
          address: cleanAddress,
          city: cleanCity
        })
        .eq('id', customerProfile.id);
        
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!customerProfile) {
    return (
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-4">
        <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse mb-8"></div>
        <div className="h-96 bg-slate-800/50 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <Helmet>
        <title>{`Dashboard - ${customerProfile.name || 'Customer'} | Radhe Investments`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-700/50 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {customerProfile.name?.includes('@') ? customerProfile.name.split('@')[0] : (customerProfile.name || 'Customer')}!
            </h1>
            <p className="text-gray-400 mt-1">Manage your policies, track claims, and access documents.</p>
          </div>
          <div role="tablist" aria-label="Customer dashboard tabs" className="flex flex-wrap gap-2 bg-slate-800/50 p-1 rounded-xl">
            <button 
              role="tab"
              aria-selected={activeTab === 'policies'}
              onClick={() => setActiveTab('policies')} 
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'policies' ? 'bg-teal-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}
            >
              <Shield className="w-4 h-4" /> Policies
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'claims'}
              onClick={() => setActiveTab('claims')} 
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'claims' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <AlertCircle className="w-4 h-4" /> Claims
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'documents'}
              onClick={() => setActiveTab('documents')} 
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'documents' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <FileText className="w-4 h-4" /> Documents
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')} 
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'profile' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> Profile
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-700/50 h-48 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <IsolatedBoundary name="Customer Dashboard Tab Content">
            {/* Policies Tab */}
            {activeTab === 'policies' && (() => {
              // Expiry calculation helper
              const getExpiryDetails = (endDateStr) => {
                if (!endDateStr) return { daysLeft: 999, text: 'Active', isUrgent: false, isSoon: false, isExpired: false };
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expiry = new Date(endDateStr);
                expiry.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                return {
                  daysLeft: diffDays,
                  text: diffDays < 0 ? `Expired (${Math.abs(diffDays)}d ago)` : diffDays === 0 ? 'Expires Today' : `${diffDays} days left`,
                  isUrgent: diffDays >= 0 && diffDays <= 7,
                  isSoon: diffDays > 7 && diffDays <= 30,
                  isExpired: diffDays < 0
                };
              };

              const expiringPolicies = policies.filter(p => {
                const exp = getExpiryDetails(p.end_date);
                return exp.isUrgent || exp.isSoon || exp.isExpired;
              });

              return (
                <div className="space-y-6">
                  
                  {/* Renewal Alert Banner if any policy is expiring */}
                  {expiringPolicies.length > 0 && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-lg">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base flex items-center gap-2">
                            Policy Renewal Notice
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {expiringPolicies.length} Policy Due
                            </span>
                          </h4>
                          <p className="text-xs text-gray-300 mt-0.5">
                            Renew before expiration to protect your No Claim Bonus (NCB) and continuous disease waiting period benefits.
                          </p>
                        </div>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=${cleanContactPhone}&text=${encodeURIComponent(
                          `Namaste Radhe Investments, I would like to renew my policy (${expiringPolicies[0]?.policy_number} - ${expiringPolicies[0]?.insurance_plans?.name}). Please assist with the renewal link.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
                      >
                        <Shield className="w-4 h-4 fill-slate-950" />
                        Renew via WhatsApp Advisor
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Your Insurance Policies</h3>
                    <span className="text-xs text-gray-400">{policies.length} Total Policies</span>
                  </div>

                  {policies.length === 0 ? (
                    <div className="glass-panel p-8 text-center text-gray-400 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center">
                      <ShieldX className="w-12 h-12 text-slate-500 mb-4" />
                      You don't have any active policies yet. <br />
                      <button onClick={() => navigate('/#products')} className="mt-4 text-teal-400 underline font-medium hover:text-teal-300">Explore Available Plans</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {policies.map(p => {
                        const exp = getExpiryDetails(p.end_date);
                        const cat = (p.policy_type || p.insurance_plans?.category || 'health').toLowerCase();
                        const sumInsured = p.sum_insured ? `₹${parseFloat(p.sum_insured).toLocaleString('en-IN')}` : 'Full Cover';

                        return (
                          <div key={p.id} className="glass-panel p-6 rounded-2xl border border-slate-700/60 relative overflow-hidden group hover:border-slate-600 transition-all">
                            
                            {/* Top Status Badges */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                {cat.includes('motor') ? (
                                  <Shield className="w-6 h-6 text-blue-400" />
                                ) : cat.includes('life') ? (
                                  <Shield className="w-6 h-6 text-purple-400" />
                                ) : (
                                  <Shield className="w-6 h-6 text-emerald-400" />
                                )}
                              </div>
                              
                              <div className="flex flex-col items-end gap-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}>
                                  {p.status ? p.status.toUpperCase() : 'ACTIVE'}
                                </span>

                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                  exp.isExpired ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                  exp.isUrgent ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse' :
                                  exp.isSoon ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                  'bg-slate-800 text-gray-400 border-slate-700'
                                }`}>
                                  {exp.text}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-lg font-bold text-white mb-1 truncate">{p.insurance_plans?.name || 'Insurance Plan'}</h4>
                            <p className="text-xs text-gray-400 font-mono mb-4">Policy #{p.policy_number}</p>
                            
                            {/* Metadata Details */}
                            {p.metadata?.vehicle_reg_number && (
                              <div className="mb-3 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono flex items-center justify-between">
                                <span>Vehicle Reg:</span>
                                <span className="font-bold">{p.metadata.vehicle_reg_number}</span>
                              </div>
                            )}

                            <div className="space-y-2 text-xs border-t border-slate-700/50 pt-4 mt-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Sum Insured / Assured</span>
                                <span className="text-emerald-400 font-bold">{sumInsured}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Start Date</span>
                                <span className="text-gray-300">{p.start_date ? new Date(p.start_date).toLocaleDateString('en-IN') : '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Expiry Date</span>
                                <span className="text-white font-medium">{p.end_date ? new Date(p.end_date).toLocaleDateString('en-IN') : '-'}</span>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="mt-5 pt-4 border-t border-slate-700/50 flex gap-2">
                              {p.document_url ? (
                                <a 
                                  href={p.document_url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold text-center border border-slate-700 transition-colors"
                                >
                                  View PDF
                                </a>
                              ) : null}

                              <a
                                href={`https://api.whatsapp.com/send?phone=${cleanContactPhone}&text=${encodeURIComponent(
                                  `Namaste, I need assistance with my policy #${p.policy_number} (${p.insurance_plans?.name}). Please connect me with an advisor.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold text-center transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              >
                                💬 WhatsApp Support
                              </a>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Claims Tab */}
            {activeTab === 'claims' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Your Claims</h3>
                  <button onClick={() => navigate('/claims/new')} className="bg-teal-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm">File New Claim</button>
                </div>
                {claims.length === 0 ? (
                  <div className="glass-panel p-8 text-center text-gray-400 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center">
                    <FileX className="w-12 h-12 text-slate-500 mb-4" />
                    You have no claim history.
                  </div>
                ) : (
                  <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800/50 text-gray-300">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Claim ID</th>
                          <th className="px-4 py-3">Policy</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 rounded-r-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {claims.map(c => (
                          <tr key={c.id} className="hover:bg-slate-800/30">
                            <td className="px-4 py-4 text-teal-400 font-medium">#{c.id.substring(0,8)}</td>
                            <td className="px-4 py-4 text-white">{c.policies?.insurance_plans?.name}</td>
                            <td className="px-4 py-4 text-gray-400 capitalize">{c.claim_type}</td>
                            <td className="px-4 py-4 text-white">₹{c.claim_amount}</td>
                            <td className="px-4 py-4 text-gray-400">{new Date(c.incident_date).toLocaleDateString()}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                c.status === 'submitted' ? 'bg-blue-500/20 text-blue-400' :
                                c.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {c.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Your Documents</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    {documents.length === 0 ? (
                      <div className="glass-panel p-8 text-center text-gray-400 rounded-3xl border border-slate-700/50">
                        No documents found. Upload your KYC or medical documents here.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map(d => (
                          <div key={d.id} className="glass-panel p-4 rounded-xl border border-slate-700/50 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-teal-400" />
                              <div>
                                <p className="text-white font-medium truncate w-40" title={d.file_name}>{d.file_name}</p>
                                <p className="text-xs text-gray-400 uppercase">{d.document_type}</p>
                              </div>
                            </div>
                            <a href={d.file_url} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300 text-sm font-medium px-3 py-1 bg-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-1">
                    <DocumentUploader 
                      entityType="customer" 
                      entityId={customerProfile.id} 
                      onUploadComplete={fetchData} 
                      title="Upload New Document"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="text-xl font-bold text-white">Personal Profile</h3>
                
                <form onSubmit={handleUpdateProfile} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-700/50 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={profileForm.name}
                        onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address (Read-only)</label>
                      <input 
                        type="email" 
                        disabled
                        value={customerProfile.email || ''}
                        className="w-full bg-slate-800/80 border border-slate-700 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Contact support to change your login email.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileForm.phone}
                        onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="+91"
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        value={profileForm.dob}
                        onChange={e => setProfileForm({...profileForm, dob: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                      <textarea 
                        rows="2"
                        value={profileForm.address}
                        onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                      <input 
                        type="text" 
                        value={profileForm.city}
                        onChange={e => setProfileForm({...profileForm, city: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={savingProfile}
                      className="bg-rose-500 hover:bg-rose-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 min-w-[150px]"
                    >
                      {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <><Save className="w-5 h-5" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </IsolatedBoundary>
        )}
      </div>
    </div>
  );
}
