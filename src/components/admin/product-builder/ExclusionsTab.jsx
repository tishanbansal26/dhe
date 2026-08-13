import React from 'react';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

export default function ExclusionsTab({ data, updateData }) {
  const exclusions = data.exclusions || [];

  const handleAdd = () => {
    const newExclusion = { name: '', description: '', type: 'Permanent' };
    updateData({ exclusions: [...exclusions, newExclusion] });
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
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Exclusions
          </h2>
          <p className="text-sm text-gray-400">Define what is not covered under this policy.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Exclusion
        </button>
      </div>

      {exclusions.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-3xl border border-slate-700/50">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-gray-400">No exclusions defined yet.</p>
          <button onClick={handleAdd} className="mt-4 text-teal-400 hover:text-teal-300 text-sm font-medium">
            + Add First Exclusion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {exclusions.map((ex, index) => (
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name / Title</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Cosmetic Surgery"
                    value={ex.name || ''}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    value={ex.type || 'Permanent'}
                    onChange={(e) => handleUpdate(index, 'type', e.target.value)}
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Detailed explanation of the exclusion..."
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
