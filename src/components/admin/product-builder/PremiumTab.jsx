import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function PremiumTab({ data, updateData }) {
  // Ensure premium_data and rates exist
  const premiumData = data.premium_data || {};
  const rates = premiumData.rates || [];

  const updateRates = (newRates) => {
    updateData({
      premium_data: {
        ...premiumData,
        rates: newRates
      }
    });
  };

  const addRow = () => {
    const newRates = [...rates, { age: '', gender: 'Any', zone: 'All', sum_insured: '', premium: '' }];
    updateRates(newRates);
  };

  const deleteRow = (index) => {
    const newRates = rates.filter((_, i) => i !== index);
    updateRates(newRates);
  };

  const handleChange = (index, field, value) => {
    const newRates = [...rates];
    newRates[index] = { ...newRates[index], [field]: value };
    updateRates(newRates);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Premium Rates</h2>
          <p className="text-sm text-gray-400">Configure dynamic premium rates based on various parameters.</p>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Row
        </button>
      </div>

      {rates.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-3xl border border-slate-700/50">
          <p className="text-gray-400 mb-4">No premium rates defined yet.</p>
          <button
            onClick={addRow}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            Add First Rate
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-slate-800 text-gray-400">
              <tr>
                <th className="px-4 py-3">Age Band</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Sum Insured</th>
                <th className="px-4 py-3">Premium (₹)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-900/50">
              {rates.map((row, index) => (
                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500"
                      placeholder="e.g. 26-30"
                      value={row.age}
                      onChange={(e) => handleChange(index, 'age', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500"
                      value={row.gender}
                      onChange={(e) => handleChange(index, 'gender', e.target.value)}
                    >
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500"
                      value={row.zone}
                      onChange={(e) => handleChange(index, 'zone', e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Zone 1">Zone 1</option>
                      <option value="Zone 2">Zone 2</option>
                      <option value="Zone 3">Zone 3</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500"
                      placeholder="e.g. 500000"
                      value={row.sum_insured}
                      onChange={(e) => handleChange(index, 'sum_insured', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500"
                      placeholder="Amount"
                      value={row.premium}
                      onChange={(e) => handleChange(index, 'premium', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => deleteRow(index)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded bg-red-400/10 hover:bg-red-400/20 transition-colors"
                      title="Delete Row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
