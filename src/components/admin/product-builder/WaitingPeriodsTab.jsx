import React from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';

export default function WaitingPeriodsTab({ data, updateData }) {
  const waitingPeriods = data.waiting_periods || [];

  const handleAdd = () => {
    const newPeriod = { name: '', duration: '', description: '' };
    updateData({ waiting_periods: [...waitingPeriods, newPeriod] });
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
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            Waiting Periods
          </h2>
          <p className="text-sm text-gray-400">Define waiting periods before specific coverages apply.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Period
        </button>
      </div>

      {waitingPeriods.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-3xl border border-slate-700/50">
          <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-gray-400">No waiting periods defined yet.</p>
          <button onClick={handleAdd} className="mt-4 text-teal-400 hover:text-teal-300 text-sm font-medium">
            + Add First Waiting Period
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {waitingPeriods.map((wp, index) => (
            <div key={index} className="glass-panel p-6 rounded-3xl border border-slate-700/50 relative group">
              <button
                onClick={() => handleDelete(index)}
                className="absolute right-4 top-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Initial Waiting Period"
                    value={wp.name || ''}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. 30 Days"
                    value={wp.duration || ''}
                    onChange={(e) => handleUpdate(index, 'duration', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Detailed explanation of the waiting period..."
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
