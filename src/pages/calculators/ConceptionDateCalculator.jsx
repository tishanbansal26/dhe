import React, { useState } from 'react';
import { CalendarDays, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ConceptionDateCalculator() {
  const [dueDate, setDueDate] = useState('');
  const [conceptionDate, setConceptionDate] = useState(null);
  const [lmpDate, setLmpDate] = useState(null);

  const calculateDates = (e) => {
    e.preventDefault();
    if (dueDate) {
      const due = new Date(dueDate);
      
      // Conception is generally 266 days before due date
      const conception = new Date(due.getTime() - (266 * 24 * 60 * 60 * 1000));
      // LMP is generally 280 days before due date
      const lmp = new Date(due.getTime() - (280 * 24 * 60 * 60 * 1000));
      
      setConceptionDate(conception.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      setLmpDate(lmp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    }
  };

  const resetForm = () => {
    setDueDate('');
    setConceptionDate(null);
    setLmpDate(null);
  };

  return (
    <>
      <SEO 
        title="Pregnancy Conception Date Calculator | Radhe Investments"
        description="Work backwards from your due date to find out when you likely conceived."
        canonicalUrl="https://www.radheinv.site/calculators/conception-date-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <CalendarDays className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Conception Date Calculator</h1>
            <p className="text-gray-400 text-lg">Find out when you conceived based on your expected due date.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Enter Due Date</h2>
              <form onSubmit={calculateDates} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Due Date</label>
                  <input 
                    type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Estimated Dates</h2>
              
              {conceptionDate ? (
                <div className="text-center animate-fade-in space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Likely Conception Date</div>
                    <div className="text-2xl font-bold text-indigo-400">{conceptionDate}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Estimated Last Menstrual Period (LMP)</div>
                    <div className="text-xl font-bold text-white">{lmpDate}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-50 text-indigo-500" />
                  <p>Enter your due date to find conception date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
