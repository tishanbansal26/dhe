import React from 'react';
import { Shield } from 'lucide-react';

export default function EligibilityTab({ data, updateData }) {
  const eligibility = data.eligibility || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-white">Eligibility Criteria</h2>
        <p className="text-sm text-gray-400">Define who can purchase this policy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Policy Term (Years)</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
            placeholder="e.g. 1, 2, or 3 Years"
            value={eligibility.policyTerm || ''}
            onChange={(e) => updateData({ eligibility: { ...eligibility, policyTerm: e.target.value } })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Family Size</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
            placeholder="e.g. 2 Adults + 4 Children"
            value={eligibility.familySize || ''}
            onChange={(e) => updateData({ eligibility: { ...eligibility, familySize: e.target.value } })}
          />
        </div>
      </div>
    </div>
  );
}
