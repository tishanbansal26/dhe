import React from 'react';
import { Plus, Trash2, Clock, Sparkles, AlertCircle } from 'lucide-react';

export default function WaitingPeriodsTab({ data, updateData }) {
  const category = (data.category || 'Health').toLowerCase();
  const waitingPeriods = data.waiting_periods || [];

  const categoryPresets = {
    health: [
      { name: 'Initial Waiting Period', duration: '30 Days', description: 'Covers any illness requiring hospitalization except accidental injuries which are covered from Day 1.' },
      { name: 'Specific Illness Waiting Period', duration: '24 Months', description: 'Covers named ailments like cataract, hernia, hydrocele, joint replacements, and kidney stones.' },
      { name: 'Pre-Existing Diseases (PED)', duration: '36 Months', description: 'Applies to diagnosed health conditions existing prior to purchasing this insurance policy.' },
      { name: 'Maternity Waiting Period', duration: '24 Months', description: 'Required waiting duration before normal or C-section delivery claims are eligible.' }
    ],
    life: [
      { name: 'Suicide Exclusion Clause', duration: '12 Months', description: 'In case of death due to suicide within 12 months, only 80% of total premiums paid are refunded.' },
      { name: 'Grace Period for Premium', duration: '30 Days', description: 'Grace duration allowed to pay due premiums without policy lapse (15 days for monthly mode).' },
      { name: 'Free-Look Cancellation Period', duration: '30 Days', description: 'Allows unconditional policy return with full premium refund from the date of receipt.' },
      { name: 'Policy Revival Window', duration: '5 Years', description: 'Timeframe to revive a lapsed policy by paying pending premiums along with nominal interest.' }
    ],
    motor: [
      { name: 'Claim Intimation Window', duration: '48 Hours', description: 'Accidents, collisions, or damages must be reported to the insurer within 48 hours.' },
      { name: 'Theft FIR Notice Window', duration: '24 Hours', description: 'Mandatory police FIR and insurer notification required within 24 hours of vehicle theft.' },
      { name: 'Break-in Renewal Inspection', duration: 'Immediate', description: 'Self-video or surveyor inspection required if expired policy is renewed post 90 days.' }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-teal-400" />
            Waiting Periods & Temporal Conditions
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Define mandatory waiting durations, grace periods, and exclusion timelines.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadPreset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Load {category.toUpperCase()} Standards
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

      {waitingPeriods.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Waiting Periods Configured</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            You can load standard regulatory waiting periods or create customized conditions for this plan.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              type="button" 
              onClick={handleLoadPreset} 
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
            >
              Load Standard {category.toUpperCase()} Presets
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {waitingPeriods.map((wp, index) => (
            <div key={index} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 relative group hover:border-slate-700 transition-all">
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. 30 Days / 24 Months"
                    value={wp.duration || ''}
                    onChange={(e) => handleUpdate(index, 'duration', e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Terms & Scope Description</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Provide full legal coverage condition details..."
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
