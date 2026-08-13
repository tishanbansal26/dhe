import React from 'react';

export default function OverviewTab({ data, updateData, companies }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-white">Product Overview</h2>
        <p className="text-sm text-gray-400">Basic information about this insurance product.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
            placeholder="e.g. HDFC Optima Secure"
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Insurer Company</label>
          <select
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
            value={data.company_id || ''}
            onChange={(e) => updateData({ company_id: e.target.value })}
          >
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
            value={data.category || ''}
            onChange={(e) => updateData({ category: e.target.value })}
          >
            <option value="Health">Health Insurance</option>
            <option value="Life">Life Insurance</option>
            <option value="Term">Term Life</option>
            <option value="Motor">Motor Insurance</option>
            <option value="Investment">Investment Plan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Plan Type</label>
          <select
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
            value={data.type || ''}
            onChange={(e) => updateData({ type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Individual">Individual</option>
            <option value="Family Floater">Family Floater</option>
            <option value="Group">Group</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Product Description / Highlights</label>
        <textarea
          rows={5}
          className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
          placeholder="Describe the key highlights of the plan..."
          value={data.description || ''}
          onChange={(e) => updateData({ description: e.target.value })}
        />
      </div>

    </div>
  );
}
