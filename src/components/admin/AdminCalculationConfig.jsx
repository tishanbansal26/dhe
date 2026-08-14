import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Calculator, 
  Save, 
  Layers, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  RefreshCw,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCalculationConfig({ planId, planData, onConfigUpdated }) {
  const [loading, setLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [changelogText, setChangelogText] = useState('');

  // Editable Calculation Config
  const [calcConfig, setCalcConfig] = useState({
    product_code: 'FG_PENSION',
    uin: '110N161V13',
    product_name: 'Tata AIA Life Insurance Fortune Guarantee Pension',
    insurer: 'Tata AIA Life Insurance Company Limited',
    free_look_days: 30,
    section_45_years: 3,
    suicide_clause_months: 12,
    suicide_refund_pct: 80,
    loan_max_sv_pct: 80,
    loan_max_annuity_interest_pct: 50,
    loan_interest_benchmark: '10-Yr G-Sec + 200 bps (9.00% p.a.)',
    revival_interest_benchmark: 'SBI 1-<2 Yr Term Deposit + 200 bps (8.40% p.a.)',
    nps_rate_bonus_pct: 1.0,
    bulk_annuity_rate_bonus_pct: 1.0,
    options: [],
    hpp_slabs: {
      single_pay_threshold: 500000,
      regular_pay_threshold: 100000,
      rate_uplift_bps: 25
    }
  });

  useEffect(() => {
    if (planId) {
      fetchVersions();
    }
  }, [planId]);

  useEffect(() => {
    if (planData) {
      const cfg = planData.metadata?.calculation_config || planData.premium_data?.calculation_config || planData.calculation_config;
      if (cfg) {
        setCalcConfig(prev => ({ ...prev, ...cfg }));
      }
    }
  }, [planData]);

  async function fetchVersions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('plan_versions')
        .select('*')
        .eq('plan_id', planId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
      if (data && data.length > 0) {
        setSelectedVersion(data[0]);
      }
    } catch (err) {
      console.error('Error loading versions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handlePublishNewVersion = async () => {
    if (!changelogText.trim()) {
      toast.error('Please enter a brief changelog describing the configuration updates.');
      return;
    }

    setIsPublishing(true);
    try {
      const nextVersionNum = (versions.length > 0 ? Math.max(...versions.map(v => v.version_number)) : 0) + 1;

      // 1. Insert into plan_versions
      const { data: newVer, error: verError } = await supabase
        .from('plan_versions')
        .insert([{
          plan_id: planId,
          version_number: nextVersionNum,
          status: 'active',
          configuration: calcConfig,
          changelog: changelogText
        }])
        .select()
        .single();

      if (verError) throw verError;

      // 2. Update insurance_plans master record
      const updatedMetadata = {
        ...(planData?.metadata || {}),
        calculation_config: calcConfig
      };

      const { error: planError } = await supabase
        .from('insurance_plans')
        .update({
          version: nextVersionNum,
          metadata: updatedMetadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId);

      if (planError) throw planError;

      toast.success(`Plan Version ${nextVersionNum} published successfully!`);
      setChangelogText('');
      fetchVersions();
      if (onConfigUpdated) onConfigUpdated(calcConfig, nextVersionNum);
    } catch (err) {
      console.error('Error publishing version:', err);
      toast.error('Failed to publish version: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Actuarial Calculation Configuration Studio</h2>
            <p className="text-xs text-slate-400">Manage rate slabs, Guaranteed Additions (GA), persistency boosters, and versioned rules.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-800 text-teal-400 font-mono text-xs font-bold rounded-lg border border-slate-700">
            Active Version: v{planData?.version || 1}
          </span>
        </div>
      </div>

      {/* Main Grid: Parameters & Version Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editable Parameters (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Core Regulatory & Statutory Multipliers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">IRDAI UIN Identifier</label>
                <input
                  type="text"
                  value={calcConfig.uin}
                  onChange={(e) => setCalcConfig({ ...calcConfig, uin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Free-Look Period (Days)</label>
                <input
                  type="number"
                  value={calcConfig.free_look_days}
                  onChange={(e) => setCalcConfig({ ...calcConfig, free_look_days: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Section 45 Indisputability (Years)</label>
                <input
                  type="number"
                  value={calcConfig.section_45_years}
                  onChange={(e) => setCalcConfig({ ...calcConfig, section_45_years: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Max Policy Loan (% of SV)</label>
                <input
                  type="number"
                  value={calcConfig.loan_max_sv_pct}
                  onChange={(e) => setCalcConfig({ ...calcConfig, loan_max_sv_pct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">NPS Subscriber Rate Bonus (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcConfig.nps_rate_bonus_pct}
                  onChange={(e) => setCalcConfig({ ...calcConfig, nps_rate_bonus_pct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Loan Interest Benchmark</label>
                <input
                  type="text"
                  value={calcConfig.loan_interest_benchmark}
                  onChange={(e) => setCalcConfig({ ...calcConfig, loan_interest_benchmark: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* High Purchase Price Slabs */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> High Purchase Price (HPP) Rate Uplifts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Single Pay Threshold (₹)</label>
                  <input
                    type="number"
                    value={calcConfig.hpp_slabs?.single_pay_threshold || 500000}
                    onChange={(e) => setCalcConfig({
                      ...calcConfig,
                      hpp_slabs: { ...calcConfig.hpp_slabs, single_pay_threshold: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Regular Pay Threshold (₹/yr)</label>
                  <input
                    type="number"
                    value={calcConfig.hpp_slabs?.regular_pay_threshold || 100000}
                    onChange={(e) => setCalcConfig({
                      ...calcConfig,
                      hpp_slabs: { ...calcConfig.hpp_slabs, regular_pay_threshold: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tier 2 Rate Uplift (bps)</label>
                  <input
                    type="number"
                    value={calcConfig.hpp_slabs?.rate_uplift_bps || 25}
                    onChange={(e) => setCalcConfig({
                      ...calcConfig,
                      hpp_slabs: { ...calcConfig.hpp_slabs, rate_uplift_bps: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Version Changelog & Publish Trigger */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Changelog / Release Notes for New Plan Version:
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Updated 10-Yr G-Sec loan benchmark and refined Option 4 GA-II monthly factor..."
                value={changelogText}
                onChange={(e) => setChangelogText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              />

              <button
                onClick={handlePublishNewVersion}
                disabled={isPublishing}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isPublishing ? 'Publishing Plan Version...' : 'Publish New Plan Version'}
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Immutable Version History (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-teal-400" /> Plan Version History
            </h3>

            {versions.length === 0 ? (
              <p className="text-xs text-slate-500">No previous versions found.</p>
            ) : (
              <div className="space-y-3">
                {versions.map(v => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-teal-400">Version {v.version_number}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase border border-emerald-500/20">
                        {v.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">
                      {v.changelog || 'No release notes.'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(v.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
