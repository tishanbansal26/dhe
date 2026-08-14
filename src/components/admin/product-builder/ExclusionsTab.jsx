import React from 'react';
import { Plus, Trash2, ShieldAlert, Sparkles } from 'lucide-react';

export default function ExclusionsTab({ data, updateData }) {
  const category = (data.category || 'Health').toLowerCase();
  const exclusions = data.exclusions || [];

  const categoryExclusionsPresets = {
    health: [
      { name: 'Cosmetic & Aesthetic Treatments', type: 'Permanent', description: 'Surgeries or procedures undertaken solely for aesthetic improvements unless necessitated by accidental trauma.' },
      { name: 'Substance Abuse & Self-Inflicted Injury', type: 'Permanent', description: 'Treatment for alcoholism, drug addiction, intentional self-harm or suicide attempts.' },
      { name: 'Unproven / Experimental Treatments', type: 'Standard', description: 'Treatments, procedures, or medicines not recognized by the Indian Medical Council or modern medical science.' },
      { name: 'War, Nuclear Perils & Civil Commotion', type: 'Permanent', description: 'Injuries or conditions resulting directly from acts of declared/undeclared war or radioactive contamination.' }
    ],
    life: [
      { name: 'Suicide in First 12 Months', type: 'Temporary', description: 'Death by suicide within 12 months of inception or revival results in 80% premium refund instead of full sum assured.' },
      { name: 'Hazardous Adventure Sports', type: 'Standard', description: 'Participation in deep-sea diving, skydiving, motor racing without prior specific underwriting endorsement.' },
      { name: 'Aviation Hazard (Non-Commercial)', type: 'Permanent', description: 'Flying in non-commercial private aircraft as crew or hobbyist unless explicitly covered.' },
      { name: 'Criminal Acts & Illegal Activities', type: 'Permanent', description: 'Death resulting directly from participation in felony, riots, or unlawful activities.' }
    ],
    motor: [
      { name: 'Driving Without Valid License', type: 'Permanent', description: 'Accidents occurring while the driver does not possess an active, valid driving license.' },
      { name: 'Driving Under Influence (DUI)', type: 'Permanent', description: 'Accidents caused when the driver is under the influence of alcohol, narcotics, or intoxicating drugs.' },
      { name: 'Normal Wear & Tear and Aging', type: 'Standard', description: 'Gradual mechanical depreciation, rust, corrosion, or electrical breakdown without external accident.' },
      { name: 'Consequential & Indirect Damages', type: 'Standard', description: 'Driving vehicle after oil leak causing engine seizure without engine-protector add-on.' },
      { name: 'Illegal Speed Contests & Racing', type: 'Permanent', description: 'Vehicle used for organized rally, speed trials, or unapproved racing activities.' }
    ]
  };

  const handleAdd = () => {
    const newExclusion = { name: '', description: '', type: 'Permanent' };
    updateData({ exclusions: [...exclusions, newExclusion] });
  };

  const handleLoadPreset = () => {
    const presetKey = category.includes('motor') ? 'motor' : category.includes('life') ? 'life' : 'health';
    const presets = categoryExclusionsPresets[presetKey] || categoryExclusionsPresets.health;
    updateData({ exclusions: presets });
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...exclusions];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ exclusions: updated });
  };

  const handleDelete = (index) => {
    const updated = exclusions.filter((_, i) => i !== index);
    updateData({ exclusions: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Exclusions & Non-Covered Scenarios
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Specify legal exclusions, permanent uninsurable perils, and conditional exceptions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadPreset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            Load {category.toUpperCase()} Standard Exclusions
          </button>
          
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Add Exclusion
          </button>
        </div>
      </div>

      {exclusions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Exclusions Defined</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Add permanent or standard policy exclusions to safeguard claim transparency.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              type="button" 
              onClick={handleLoadPreset} 
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Load Standard {category.toUpperCase()} Exclusions
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {exclusions.map((ex, index) => (
            <div key={index} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 relative group hover:border-slate-700 transition-all">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute right-4 top-4 text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition-all"
                title="Remove Exclusion"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Exclusion Name / Title *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Cosmetic & Aesthetic Surgery"
                    value={ex.name || ''}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Classification Type</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    value={ex.type || 'Permanent'}
                    onChange={(e) => handleUpdate(index, 'type', e.target.value)}
                  >
                    <option value="Permanent">Permanent Exclusion</option>
                    <option value="Temporary">Time-Bound Temporary</option>
                    <option value="Standard">Standard Regulatory</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Legal Clause Definition & Details</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Detailed explanation of what conditions are not covered..."
                    rows={2}
                    value={ex.description || ''}
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
