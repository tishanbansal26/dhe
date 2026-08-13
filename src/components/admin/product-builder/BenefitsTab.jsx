import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function BenefitsTab({ data, updateData }) {
  const benefits = data.benefits || [];

  const addBenefit = () => {
    updateData({
      benefits: [...benefits, { name: '', value: '', description: '', limit: '' }]
    });
  };

  const deleteBenefit = (index) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    updateData({ benefits: newBenefits });
  };

  const handleChange = (index, field, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    updateData({ benefits: newBenefits });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Benefits & Coverage</h2>
          <p className="text-sm text-gray-400">Define the core benefits and limits for this product.</p>
        </div>
        <button
          onClick={addBenefit}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Benefit
        </button>
      </div>

      {benefits.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-3xl border border-slate-700/50">
          <p className="text-gray-400 mb-4">No benefits added yet.</p>
          <button
            onClick={addBenefit}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            Add First Benefit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="glass-panel p-5 rounded-2xl border border-slate-700/50 relative group">
              <button
                onClick={() => deleteBenefit(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-400 p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Benefit"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Benefit Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Room Rent Limit"
                    value={benefit.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Coverage Value / Type</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. 1% of Sum Insured"
                    value={benefit.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Specific Limit (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Up to ₹5,000 per day"
                    value={benefit.limit}
                    onChange={(e) => handleChange(index, 'limit', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Brief description of this benefit..."
                    value={benefit.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
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
