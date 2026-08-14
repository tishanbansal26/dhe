import React from 'react';
import { Plus, Trash2, Clock, Sparkles, AlertCircle, ShieldCheck, Scale, Award, Info } from 'lucide-react';

export default function WaitingPeriodsTab({ data, updateData }) {
  const category = (data.category || 'Health').toLowerCase();
  const waitingPeriods = data.waiting_periods || [];

  // Official IRDAI 2024/2025 compliant standard presets
  const categoryPresets = {
    health: [
      { 
        name: 'Initial Waiting Period', 
        duration: '30 Days', 
        description: 'IRDAI Regulation: Mandatory 30-day waiting period for illness hospitalization. Accidental injury hospitalization is covered from Day 1.' 
      },
      { 
        name: 'Specific Illnesses / Surgeries', 
        duration: '24 Months (IRDAI Cap)', 
        description: 'IRDAI Capped Limit: Max 24 months for named conditions (Cataract, Hernia, Hydrocele, Joint Replacements, Piles, Sinusitis, Kidney/Gall Bladder stones).' 
      },
      { 
        name: 'Pre-Existing Diseases (PED)', 
        duration: '36 Months (Strict IRDAI 2024 Cap)', 
        description: 'IRDAI Master Circular 2024: Maximum PED waiting period is legally capped at 36 months (reduced from 48m). No claim can be rejected on PED grounds post 3 years.' 
      },
      { 
        name: 'Moratorium / Incontestability Period', 
        duration: '5 Continuous Years (60 Months)', 
        description: 'IRDAI 2024 Mandate: After 5 consecutive years of continuous coverage, the policy cannot be contested or repudiated for non-disclosure except proven active fraud.' 
      },
      { 
        name: 'Cashless Pre-Auth & Discharge TAT', 
        duration: '1 Hour Pre-Auth / 3 Hours Discharge', 
        description: 'IRDAI Cashless Everywhere Norm: Hospital cashless pre-authorization decision within 60 minutes and final discharge authorization within 3 hours.' 
      },
      { 
        name: 'Maternity & Newborn Waiting Period', 
        duration: '24 Months', 
        description: 'Standard IRDAI defined waiting period for maternity expenses, normal/C-section delivery, and 90-day newborn vaccination coverage.' 
      }
    ],
    life: [
      { 
        name: 'Section 45 Indisputability Clause', 
        duration: '3 Years (36 Months)', 
        description: 'Insurance Act 1938 Section 45: A life insurance policy cannot be questioned or repudiated on any ground whatsoever after 3 continuous years from inception.' 
      },
      { 
        name: 'Suicide Exclusion Clause', 
        duration: '12 Months', 
        description: 'IRDAI Life Regulations: In case of death due to suicide within 12 months, 80% of total premiums paid (or surrender value) is refunded to the legal nominee.' 
      },
      { 
        name: 'Free-Look Cancellation Period', 
        duration: '30 Days (Electronic Dispatch)', 
        description: 'IRDAI Consumer Protection: Unconditional 30-day trial return window with 100% premium refund from receipt of electronic/digital policy document.' 
      },
      { 
        name: 'Premium Grace Period', 
        duration: '30 Days (15 Days Monthly)', 
        description: 'IRDAI Mandated Grace: 30 days grace period for annual/half-yearly/quarterly modes and 15 days for monthly NACH mode without loss of life cover.' 
      },
      { 
        name: 'Policy Revival Window', 
        duration: '5 Years', 
        description: 'IRDAI Norm: 5-year timeframe from the date of first unpaid premium to revive a lapsed policy with accumulated guaranteed bonuses intact.' 
      }
    ],
    motor: [
      { 
        name: 'Compulsory Personal Accident (CPA)', 
        duration: '₹15 Lakhs Mandate', 
        description: 'Indian Motor Tariff: Mandatory ₹15 Lakhs CPA cover for owner-driver covering accidental death and permanent total disability.' 
      },
      { 
        name: 'Third-Party Property Damage (TPPD)', 
        duration: '₹7.5 Lakhs Statutory Cap', 
        description: 'Motor Vehicles Act: Statutory cover up to ₹7.5 Lakhs for third-party property damage with unlimited liability for bodily injuries.' 
      },
      { 
        name: 'No Claim Bonus (NCB) Retention', 
        duration: '90 Days Window', 
        description: 'IRDAI Tariff: Accumulated NCB discount (20% to 50%) is protected and fully transferable across Indian general insurers within 90 days of policy expiry.' 
      },
      { 
        name: 'Survey & Claim Settlement TAT', 
        duration: '48 Hours Survey / 30 Days Settlement', 
        description: 'IRDAI Protection of Policyholders Regulations: Surveyor deputation within 48 hours and final claim settlement within 30 days of documentation.' 
      }
    ]
  };

  const handleAdd = () => {
    const newPeriod = { name: '', duration: '', description: '' };
    updateData({ waiting_periods: [...waitingPeriods, newPeriod] });
  };

  const handleLoadPreset = () => {
    const presetKey = category.includes('motor') ? 'motor' : category.includes('life') ? 'life' : 'health';
    const presets = categoryPresets[presetKey] || categoryPresets.health;
    updateData({ waiting_periods: presets });
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...waitingPeriods];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ waiting_periods: updated });
  };

  const handleDelete = (index) => {
    const updated = waitingPeriods.filter((_, i) => i !== index);
    updateData({ waiting_periods: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* IRDAI Regulatory Guidance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-blue-500/10 to-transparent border border-teal-500/30 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold shrink-0 mt-0.5">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-sm">
              IRDAI Regulatory Compliance & Standard Guidelines
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
              Official Norms
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            All waiting periods and statutory terms are structured in strict compliance with the 
            <strong className="text-teal-300"> IRDAI Master Circular on Health Insurance (2024)</strong>, 
            <strong className="text-teal-300"> Insurance Act 1938 (Section 45)</strong>, and 
            <strong className="text-teal-300"> Indian Motor Tariff</strong>. Under the 2024 regulations, Pre-Existing Diseases (PED) waiting periods are capped at a maximum of <strong className="text-white">36 Months</strong>, and full incontestability applies post <strong className="text-white">5 Years</strong>.
          </p>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-teal-400" />
            IRDAI Waiting Periods & Statutory Clauses
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure statutory waiting timelines, incontestability clauses, and grace windows for this plan.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadPreset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Load IRDAI {category.toUpperCase()} Presets
          </button>
          
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Add Clause
          </button>
        </div>
      </div>

      {/* Waiting Periods List */}
      {waitingPeriods.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Waiting Periods Configured</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Click below to automatically load the standardized IRDAI regulatory waiting periods and consumer clauses.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              type="button" 
              onClick={handleLoadPreset} 
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Load Standard IRDAI {category.toUpperCase()} Presets
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {waitingPeriods.map((wp, index) => (
            <div key={index} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 relative group hover:border-slate-700 transition-all shadow-sm">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute right-4 top-4 text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition-all"
                title="Remove Clause"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Clause / Period Name *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Initial Waiting Period"
                    value={wp.name || ''}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Duration / Timeline *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm font-semibold text-teal-300 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. 30 Days / 24 Months"
                    value={wp.duration || ''}
                    onChange={(e) => handleUpdate(index, 'duration', e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">IRDAI Statutory Scope & Legal Terms</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs font-sans leading-relaxed focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Provide full legal coverage condition details per IRDAI standards..."
                    rows={2}
                    value={wp.description || ''}
                    onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
