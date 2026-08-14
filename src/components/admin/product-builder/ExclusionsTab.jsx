import React from 'react';
import { Plus, Trash2, ShieldAlert, Sparkles, Scale, ShieldCheck } from 'lucide-react';

export default function ExclusionsTab({ data, updateData }) {
  const category = (data.category || 'Health').toLowerCase();
  const exclusions = data.exclusions || [];

  // Official IRDAI Standardized Exclusions (IRDAI/HLT/REG/CIR/194/09/2019)
  const categoryExclusionsPresets = {
    health: [
      { 
        name: 'Mandatory Modern Treatments Inclusion', 
        type: 'Standard', 
        description: 'IRDAI Mandate: Modern treatments including Robotic Surgeries, Oral Chemotherapy, Balloon Sinuplasty, Deep Brain Stimulation, and Stem Cell Therapy MUST NOT be excluded and are covered up to policy limits.' 
      },
      { 
        name: 'Cosmetic & Aesthetic Procedures', 
        type: 'Permanent', 
        description: 'IRDAI Standard Exclusion (Code- Excl08): Expenses for cosmetic or plastic surgery unless necessitated by accidental trauma, burns, or cancer reconstruction.' 
      },
      { 
        name: 'Substance Abuse & Self-Inflicted Injury', 
        type: 'Permanent', 
        description: 'IRDAI Standard Exclusion (Code- Excl12): Treatment for alcoholism, drug abuse, or intentional self-injury.' 
      },
      { 
        name: 'Unproven / Experimental Treatments', 
        type: 'Standard', 
        description: 'IRDAI Standard Exclusion (Code- Excl11): Expenses for treatments, procedures, or medicines not supported by published clinical evidence or regulatory medical boards.' 
      },
      { 
        name: 'War, Radioactive Perils & Nuclear Contamination', 
        type: 'Permanent', 
        description: 'IRDAI Standard Exclusion: Injury or illness caused directly by declared/undeclared war, invasion, nuclear radiation or radioactive chemical contamination.' 
      }
    ],
    life: [
      { 
        name: 'Suicide in First 12 Months', 
        type: 'Temporary', 
        description: 'IRDAI Life Regulations: Death due to suicide within 12 months of inception or revival results in 80% premium refund. Post 12 months, full death benefit is payable.' 
      },
      { 
        name: 'Hazardous Adventure Sports', 
        type: 'Standard', 
        description: 'IRDAI Exclusion: Participation in dangerous motorized racing, skydiving, or deep-sea diving unless declared and underwritten under a specific adventure rider.' 
      },
      { 
        name: 'Aviation Hazard (Non-Commercial)', 
        type: 'Permanent', 
        description: 'IRDAI Standard: Flying in non-commercial private aircraft as crew or hobbyist unless explicitly underwritten.' 
      },
      { 
        name: 'Criminal Acts & Felony Participation', 
        type: 'Permanent', 
        description: 'IRDAI Standard: Death resulting directly from active participation in illegal riots or criminal offenses with unlawful intent.' 
      }
    ],
    motor: [
      { 
        name: 'Driving Without Valid License', 
        type: 'Permanent', 
        description: 'General Insurance / Motor Tariff: Accidents occurring while the driver does not possess an active, valid driving license.' 
      },
      { 
        name: 'Driving Under Influence (DUI / Intoxication)', 
        type: 'Permanent', 
        description: 'Motor Tariff Clause: Accidents or damages caused when the driver is intoxicated with alcohol, narcotics, or prohibited drugs.' 
      },
      { 
        name: 'Normal Wear & Tear and Gradual Aging', 
        type: 'Standard', 
        description: 'Indian Motor Tariff: Gradual mechanical depreciation, rust, corrosion, or electrical breakdown without external accident.' 
      },
      { 
        name: 'Consequential & Indirect Damages', 
        type: 'Standard', 
        description: 'Tariff Regulation: Driving vehicle after oil leak causing engine seizure without engine-protector add-on.' 
      },
      { 
        name: 'Illegal Speed Contests & Racing', 
        type: 'Permanent', 
        description: 'Motor Tariff Exclusion: Vehicle used for unapproved rallies, speed trials, or organized racing contests.' 
      }
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
      
      {/* IRDAI Regulatory Guidance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-orange-500/10 to-transparent border border-rose-500/30 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-500 text-white font-bold shrink-0 mt-0.5">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-sm">
              IRDAI Standardized Exclusions Framework
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              Circular 194/09/2019
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Exclusions must adhere to the standardized nomenclature prescribed by IRDAI. Modern treatments (robotic surgery, stem cell therapy, balloon sinuplasty) are legally protected and cannot be excluded completely.
          </p>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            IRDAI Standardized Exclusions & Non-Covered Perils
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Define standardized non-covered perils and regulatory exclusion classifications.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadPreset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            Load IRDAI {category.toUpperCase()} Standards
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

      {/* Exclusions List */}
      {exclusions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Exclusions Defined</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Click below to load the IRDAI standardized permanent and regulatory exclusions.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              type="button" 
              onClick={handleLoadPreset} 
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Load Standard IRDAI {category.toUpperCase()} Exclusions
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {exclusions.map((ex, index) => (
            <div key={index} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 relative group hover:border-slate-700 transition-all shadow-sm">
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
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">IRDAI Classification</label>
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
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Statutory Scope & Legal Definition</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs font-sans leading-relaxed focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Provide full legal clause text per IRDAI standardization..."
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
