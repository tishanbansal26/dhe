import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function CoverageTab({ data, updateData }) {
  const coverage = data.coverage || {};
  const eligibility = data.eligibility || {};

  const handleCoverageChange = (field, value) => {
    updateData({ coverage: { ...coverage, [field]: value } });
  };

  const handleEligibilityChange = (field, value) => {
    updateData({ eligibility: { ...eligibility, [field]: value } });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Coverage Section */}
      <div>
        <div className="border-b border-slate-700 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white">Coverage Limits</h2>
          <p className="text-sm text-gray-400">Define the core coverage parameters for this product.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CoverageField 
            label="Room Rent Limit" 
            placeholder="e.g. Single Private Room"
            value={coverage.roomRent?.value || coverage.roomRent || ''}
            confidence={coverage.roomRent?.confidence}
            onChange={(v) => handleCoverageChange('roomRent', v)}
          />
          <CoverageField 
            label="ICU Limit" 
            placeholder="e.g. No Limit"
            value={coverage.icuLimit?.value || coverage.icuLimit || ''}
            confidence={coverage.icuLimit?.confidence}
            onChange={(v) => handleCoverageChange('icuLimit', v)}
          />
          <CoverageField 
            label="Pre-Hospitalization" 
            placeholder="e.g. 60 Days"
            value={coverage.preHospitalization?.value || coverage.preHospitalization || ''}
            confidence={coverage.preHospitalization?.confidence}
            onChange={(v) => handleCoverageChange('preHospitalization', v)}
          />
          <CoverageField 
            label="Post-Hospitalization" 
            placeholder="e.g. 180 Days"
            value={coverage.postHospitalization?.value || coverage.postHospitalization || ''}
            confidence={coverage.postHospitalization?.confidence}
            onChange={(v) => handleCoverageChange('postHospitalization', v)}
          />
          <CoverageField 
            label="Ambulance Cover" 
            placeholder="e.g. Up to ₹2,000"
            value={coverage.ambulance?.value || coverage.ambulance || ''}
            confidence={coverage.ambulance?.confidence}
            onChange={(v) => handleCoverageChange('ambulance', v)}
          />
          <CoverageField 
            label="No Claim Bonus" 
            placeholder="e.g. 50% up to 100%"
            value={coverage.noClaimBonus?.value || coverage.noClaimBonus || ''}
            confidence={coverage.noClaimBonus?.confidence}
            onChange={(v) => handleCoverageChange('noClaimBonus', v)}
          />
        </div>
      </div>

      {/* Eligibility Section */}
      <div>
        <div className="border-b border-slate-700 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white">Eligibility Rules</h2>
          <p className="text-sm text-gray-400">Entry ages and family composition constraints.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CoverageField 
            label="Min Entry Age (Adult)" 
            placeholder="e.g. 18 years"
            value={eligibility.minAgeAdult?.value || eligibility.minAgeAdult || ''}
            confidence={eligibility.minAgeAdult?.confidence}
            onChange={(v) => handleEligibilityChange('minAgeAdult', v)}
          />
          <CoverageField 
            label="Max Entry Age" 
            placeholder="e.g. 65 years"
            value={eligibility.maxAge?.value || eligibility.maxAge || ''}
            confidence={eligibility.maxAge?.confidence}
            onChange={(v) => handleEligibilityChange('maxAge', v)}
          />
          <CoverageField 
            label="Min Child Age" 
            placeholder="e.g. 91 Days"
            value={eligibility.minAgeChild?.value || eligibility.minAgeChild || ''}
            confidence={eligibility.minAgeChild?.confidence}
            onChange={(v) => handleEligibilityChange('minAgeChild', v)}
          />
        </div>
      </div>
    </div>
  );
}

// Sub-component for rendering fields with AI Confidence indicators
function CoverageField({ label, value, onChange, placeholder, confidence }) {
  let indicatorColor = '';
  if (confidence) {
    if (confidence >= 90) indicatorColor = 'border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]';
    else if (confidence >= 70) indicatorColor = 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
    else indicatorColor = 'border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.2)] bg-red-500/5';
  }

  return (
    <div className="relative">
      <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
        {label}
        {confidence && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${confidence >= 90 ? 'bg-green-500/10 text-green-400' : confidence >= 70 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
            {confidence}% AI Match
          </span>
        )}
      </label>
      <input
        type="text"
        className={`w-full bg-slate-800 border ${indicatorColor || 'border-slate-600'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {confidence && confidence < 70 && (
        <AlertCircle className="w-4 h-4 text-red-400 absolute right-3 top-10" />
      )}
    </div>
  );
}
