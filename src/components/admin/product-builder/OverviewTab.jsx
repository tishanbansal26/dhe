import React from 'react';
import { Heart, Shield, Car, TrendingUp, Sparkles, Building, Layers, CheckCircle2 } from 'lucide-react';

export default function OverviewTab({ data, updateData, companies }) {
  const currentCategory = data.category || 'Health';

  const categoryConfigs = {
    Health: {
      icon: Heart,
      color: 'emerald',
      label: 'Health Insurance',
      subtitle: 'Mediclaim, Super Top-up & Critical Illness',
      planTypes: [
        'Comprehensive Health Plan',
        'Family Floater Mediclaim',
        'Super Top-Up Plan',
        'Critical Illness Cover',
        'Senior Citizen Health Cover',
        'Maternity & Newborn Plan',
        'Personal Accident Cover'
      ],
      placeholderName: 'e.g. HDFC ERGO Optima Secure / Star Health Comprehensive'
    },
    Life: {
      icon: Shield,
      color: 'purple',
      label: 'Life & Term Cover',
      subtitle: 'Pure Term, Whole Life & Guaranteed Savings',
      planTypes: [
        'Pure Term Insurance Plan',
        'Term with Return of Premium (TROP)',
        'Whole Life Insurance Plan',
        'Guaranteed Income / Savings Plan',
        'Child Future Protection Plan',
        'Retirement Pension & Annuity'
      ],
      placeholderName: 'e.g. Tata AIA Fortune Guarantee / ICICI Pru iProtect Smart'
    },
    Motor: {
      icon: Car,
      color: 'blue',
      label: 'Motor Insurance',
      subtitle: 'Car, Two-Wheeler & Commercial Fleet',
      planTypes: [
        'Comprehensive Private Car Package',
        'Zero Depreciation (Bumper to Bumper)',
        'Comprehensive Two-Wheeler / Bike',
        'Standalone Own Damage (OD)',
        'Third-Party Only (TP)',
        'Commercial Goods / Passenger Vehicle'
      ],
      placeholderName: 'e.g. Bajaj Allianz DriveSmart / Go Digit Car Comprehensive'
    },
    Investment: {
      icon: TrendingUp,
      color: 'amber',
      label: 'Investment & ULIP',
      subtitle: 'Market-Linked Wealth Creation & Tax Saving',
      planTypes: [
        'Unit Linked Insurance Plan (ULIP)',
        'Guaranteed Return Savings Plan',
        'Capital Guarantee Solution',
        'Retirement Wealth Accumulator'
      ],
      placeholderName: 'e.g. HDFC Life Click 2 Wealth / Max Life Smart Wealth Plan'
    }
  };

  const handleCategorySelect = (catKey) => {
    updateData({
      category: catKey,
      type: categoryConfigs[catKey].planTypes[0] // Set default plan type for this category
    });
  };

  const activeConfig = categoryConfigs[currentCategory] || categoryConfigs.Health;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-teal-400" />
          Product Architecture & Overview
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Select the insurance domain to automatically tailor the entire product definition proforma and parameters.
        </p>
      </div>

      {/* Step 1: Category Selection Cards */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          1. Insurance Domain / Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryConfigs).map(([key, config]) => {
            const Icon = config.icon;
            const isSelected = currentCategory.toLowerCase() === key.toLowerCase();
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCategorySelect(key)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? `bg-slate-900 border-teal-400 ring-2 ring-teal-500/50 shadow-[0_0_25px_rgba(20,184,166,0.25)]`
                    : `bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100`
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-teal-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-gray-300 group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{config.label}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{config.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Core Details */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-teal-400" />
          <h3 className="font-bold text-white text-base">2. Plan Identification & Provider Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
              placeholder={activeConfig.placeholderName}
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Insurer Company *</label>
            <select
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
              value={data.company_id || ''}
              onChange={(e) => updateData({ company_id: e.target.value })}
            >
              <option value="">Select Insurance Provider...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Specific Plan Type / Architecture</label>
            <select
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
              value={data.type || activeConfig.planTypes[0]}
              onChange={(e) => updateData({ type: e.target.value })}
            >
              {activeConfig.planTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Starting Premium Display (e.g. ₹590/mo or ₹7,999/yr)</label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="e.g. ₹650 / month"
              value={data.metadata?.premium || data.premium || ''}
              onChange={(e) => updateData({ 
                premium: e.target.value,
                metadata: { ...data.metadata, premium: e.target.value } 
              })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-2">Key Selling Proposition / Marketing Tagline</label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="e.g. 4X Coverage with Automatic 100% Restore & Zero Sub-limits"
              value={data.tagline || data.metadata?.tagline || ''}
              onChange={(e) => updateData({ 
                tagline: e.target.value,
                metadata: { ...data.metadata, tagline: e.target.value } 
              })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">Product Description & Comprehensive Highlights</label>
          <textarea
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
            placeholder="Provide an executive summary of this plan, key coverage pillars, and target audience..."
            value={data.description || ''}
            onChange={(e) => updateData({ description: e.target.value })}
          />
        </div>
      </div>

    </div>
  );
}
