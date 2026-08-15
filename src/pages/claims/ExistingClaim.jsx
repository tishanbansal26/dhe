import React, { useState } from 'react';
import { Search, Info, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';

export default function ExistingClaim() {
  const [insurer, setInsurer] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <SEO 
        title="Existing Insurance Claim Support" 
        description="Already filed a claim with your insurer? Get expert assistance from Radhe Investments to track, escalate and resolve your existing insurance claim." 
        canonicalUrl="https://www.radheinv.site/claims/existing" 
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Claim Already Filed with Insurer</h2>
          <p className="text-gray-400">If you have already initiated a claim directly with your insurer, you can link it here for our team to assist you.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p>Linking your claim allows our dedicated support team to track its progress and advocate on your behalf with the insurer.</p>
          </div>

          {success ? (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Claim Linked Successfully!</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Our support team has been notified. We will track claim {claimNumber} and keep you updated on its progress.
              </p>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setClaimNumber('');
                  setInsurer('');
                }}
                className="text-teal-400 hover:text-teal-300 font-medium"
              >
                Link another claim
              </button>
            </div>
          ) : (
            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!insurer || !claimNumber) return;
                setLoading(true);
                try {
                  const { error } = await supabase.from('claims').insert([{
                    type: 'existing_link',
                    insurer_name: insurer,
                    reference_number: claimNumber,
                    status: 'pending'
                  }]);
                  if (error) throw error;
                  setSuccess(true);
                } catch (err) {
                  console.error('Error linking claim:', err);
                  toast.error('Failed to link claim: ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Insurer Name</label>
                  <select 
                    value={insurer}
                    onChange={(e) => setInsurer(e.target.value)}
                    required
                    className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select Insurer...</option>
                    <option value="HDFC Life">HDFC Life</option>
                    <option value="Niva Bupa">Niva Bupa</option>
                    <option value="Star Health">Star Health</option>
                    <option value="ICICI Lombard">ICICI Lombard</option>
                    <option value="Care Health">Care Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Claim Reference Number</label>
                  <input 
                    type="text" 
                    value={claimNumber}
                    onChange={(e) => setClaimNumber(e.target.value)}
                    required
                    className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500" 
                    placeholder="e.g. CLM-098765" 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto glow-button bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg mx-auto flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Link Claim'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
