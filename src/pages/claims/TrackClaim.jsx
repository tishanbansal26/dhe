import React, { useState } from 'react';
import { Search, Activity, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

export default function TrackClaim() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claim, setClaim] = useState(null);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <SEO 
        title="Track Your Insurance Claim Status" 
        description="Track the status of your insurance claim in real-time. Enter your claim reference number to get instant updates on your health, life or motor insurance claim." 
        canonicalUrl="https://www.radheinv.site/claims/track" 
        keywords="Track Insurance Claim, Claim Status Check, Insurance Claim Tracker India" 
      />
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Track Existing Claim</h2>
          <p className="text-gray-400">Enter your claim reference number or policy number to get real-time status updates.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
          <form 
            className="space-y-6 max-w-lg mx-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!searchQuery.trim()) return;
              
              setLoading(true);
              setError('');
              setClaim(null);
              
              try {
                const { data, error: fetchError } = await supabase
                  .from('claims')
                  .select('*')
                  .or(`id.eq.${searchQuery.trim()},reference_number.eq.${searchQuery.trim()}`)
                  .single();
                  
                if (fetchError) throw fetchError;
                if (!data) throw new Error('Claim not found');
                
                setClaim(data);
              } catch (err) {
                setError('Could not find a claim with that reference number. Please try again.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Claim Reference Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-lg"
                  placeholder="e.g. CLM-123456"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full glow-button bg-gradient-to-r from-orange-500 to-rose-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg text-lg flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Track Status'}
            </button>
          </form>

          {/* Results Area */}
          {error && (
            <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center">
              {error}
            </div>
          )}
          
          {claim && (
            <div className="mt-12 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-700/50">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Claim: {claim.reference_number || claim.id}</h3>
                  <p className="text-sm text-gray-400">Filed on {new Date(claim.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className={`px-4 py-2 rounded-lg font-bold text-sm inline-flex items-center gap-2 ${
                  claim.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                  claim.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {claim.status === 'approved' ? <CheckCircle2 className="w-4 h-4" /> :
                   claim.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                   <Clock className="w-4 h-4" />}
                  {claim.status}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Claim Type</p>
                  <p className="font-semibold text-white">{claim.claim_type || claim.type || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Claimed Amount</p>
                  <p className="font-semibold text-white">₹{claim.claim_amount?.toLocaleString('en-IN') || '0'}</p>
                </div>
                {claim.approved_amount && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Approved Amount</p>
                    <p className="font-semibold text-emerald-400">₹{claim.approved_amount.toLocaleString('en-IN')}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">Description / Notes</p>
                  <p className="text-gray-300 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    {claim.description || 'No additional notes.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!claim && !error && !loading && (
            <div className="mt-12 text-center text-gray-500 text-sm">
              Please enter a valid tracking number to view status timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
