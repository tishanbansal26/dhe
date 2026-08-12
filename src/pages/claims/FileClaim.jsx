import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function FileClaim() {
  const { customerProfile, user } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  
  const [formData, setFormData] = useState({
    policy_id: '',
    incident_date: '',
    claim_type: 'medical',
    claim_amount: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'File a Claim - Radhe Investments';
  }, []);

  useEffect(() => {
    if (customerProfile) {
      // Fetch user's active policies
      supabase
        .from('policies')
        .select('id, policy_number, insurance_plans(name)')
        .eq('customer_id', customerProfile.id)
        .eq('status', 'active')
        .then(({ data }) => {
          if (data) setPolicies(data);
        });
    }
  }, [customerProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerProfile) {
      setError('You must be logged in as a customer to file a claim.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('claims').insert([{
        customer_id: customerProfile.id,
        policy_id: formData.policy_id,
        claim_type: formData.claim_type,
        claim_amount: parseFloat(formData.claim_amount) || 0,
        incident_date: formData.incident_date,
        description: formData.description,
        status: 'pending'
      }]);

      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit claim.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-slate-700/50 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Claim Submitted!</h2>
          <p className="text-gray-400 mb-6">Your claim has been successfully filed and is currently under review. Our team will contact you shortly.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full glow-button bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 glass-panel rounded-3xl border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">File a New Claim</h2>
          <p className="text-gray-400">Initiate your insurance claim process directly with us.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Policy</label>
              <select 
                required
                value={formData.policy_id}
                onChange={e => setFormData({...formData, policy_id: e.target.value})}
                className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                <option value="">-- Choose Policy --</option>
                {policies.map(p => (
                  <option key={p.id} value={p.id}>{p.policy_number} - {p.insurance_plans?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Claim Type</label>
              <select 
                required
                value={formData.claim_type}
                onChange={e => setFormData({...formData, claim_type: e.target.value})}
                className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                <option value="medical">Medical / Health</option>
                <option value="death">Death</option>
                <option value="damage">Vehicle / Property Damage</option>
                <option value="theft">Theft</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Incident</label>
              <input 
                type="date" 
                required
                value={formData.incident_date}
                onChange={e => setFormData({...formData, incident_date: e.target.value})}
                className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Claim Amount (₹)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.claim_amount}
                onChange={e => setFormData({...formData, claim_amount: e.target.value})}
                className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500" 
                placeholder="e.g. 50000" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Brief Description</label>
            <textarea 
              rows="4" 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500" 
              placeholder="Please describe the incident..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full glow-button bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? 'Submitting...' : 'Submit Claim Request'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
