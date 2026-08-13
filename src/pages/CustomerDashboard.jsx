import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, FileText, AlertCircle, Clock, ShieldX, FileX, User, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DocumentUploader from '../components/DocumentUploader';

export default function CustomerDashboard() {
  const { user, customerProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('policies'); // policies, claims, documents
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      // Fetch policies
      const { data: pData } = await supabase
        .from('policies')
        .select('*, insurance_plans(name, category)')
        .eq('customer_id', customerProfile.id);
      if (pData) setPolicies(pData);

      // Fetch claims
      const { data: cData } = await supabase
        .from('claims')
        .select('*, policies(policy_number, insurance_plans(name))')
        .eq('customer_id', customerProfile.id);
      if (cData) setClaims(cData);

      // Fetch documents
      const { data: dData } = await supabase
        .from('documents')
        .select('*')
        .eq('entity_type', 'customer')
        .eq('entity_id', customerProfile.id);
      if (dData) setDocuments(dData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: profileForm.name,
          phone: profileForm.phone,
          dob: profileForm.dob || null,
          address: profileForm.address,
          city: profileForm.city
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-700/50 pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Welcome back, {customerProfile.name?.includes('@') ? customerProfile.name.split('@')[0] : (customerProfile.name || 'Customer')}!
            </h2>
            <p className="text-gray-400 mt-1">Manage your policies, track claims, and access documents.</p>
          </div>
          <div className="flex flex-wrap gap-2 bg-slate-800/50 p-1 rounded-xl">
            <button onClick={() => setActiveTab('policies')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'policies' ? 'bg-teal-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}>
              <Shield className="w-4 h-4" /> Policies
            </button>
            <button onClick={() => setActiveTab('claims')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'claims' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              <AlertCircle className="w-4 h-4" /> Claims
            </button>
            <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'documents' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <FileText className="w-4 h-4" /> Documents
            </button>
            <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'profile' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white'}`}>
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
          <>
            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Your Insurance Policies</h3>
                {policies.length === 0 ? (
                  <div className="glass-panel p-8 text-center text-gray-400 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center">
                    <ShieldX className="w-12 h-12 text-slate-500 mb-4" />
                    You don't have any active policies yet. <br />
                    <button onClick={() => navigate('/#plans')} className="mt-4 text-teal-400 underline">Explore Plans</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map(p => (
                      <div key={p.id} className="glass-panel p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                        <Shield className="w-10 h-10 text-teal-400 mb-4" />
                        <h4 className="text-xl font-bold text-white mb-1">{p.insurance_plans?.name}</h4>
                        <p className="text-sm text-gray-400 mb-4">Policy #{p.policy_number}</p>
                        
                        <div className="space-y-2 text-sm border-t border-slate-700/50 pt-4 mt-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Premium</span>
                            <span className="text-white">₹{p.premium_amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cover Amount</span>
                            <span className="text-white">₹{p.cover_amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Expiry Date</span>
                            <span className="text-white">{new Date(p.end_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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

          </>
        )}
      </div>
    </div>
  );
}
