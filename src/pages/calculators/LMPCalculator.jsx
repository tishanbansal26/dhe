import React, { useState } from 'react';
import { Clock, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';

export default function LMPCalculator() {
  const [dueDate, setDueDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [lmpDate, setLmpDate] = useState(null);

  const calculateLMP = (e) => {
    e.preventDefault();
    if (dueDate && cycleLength) {
      const due = new Date(dueDate);
      const cycle = parseInt(cycleLength);
      
      // LMP = Due Date - 280 days (adjusted for cycle length)
      const adjustedDays = 280 + (cycle - 28);
      const lmp = new Date(due.getTime() - (adjustedDays * 24 * 60 * 60 * 1000));
      
      setLmpDate(lmp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    }
  };

  const resetForm = () => {
    setDueDate('');
    setCycleLength('28');
    setLmpDate(null);
  };

  return (
    <>
      <SEO 
        title="Last Menstrual Period (LMP) Calculator | Radhe Investments"
        description="Calculate your Last Menstrual Period (LMP) based on your ultrasound or expected due date."
        canonicalUrl="https://www.radheinv.site/calculators/lmp-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
              <Clock className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">LMP Calculator</h1>
            <p className="text-gray-400 text-lg">Calculate your Last Menstrual Period based on your expected due date.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Enter Details</h2>
              <form onSubmit={calculateLMP} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Due Date</label>
                  <input 
                    type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Average Cycle Length (Days)</label>
                  <input 
                    type="number" required value={cycleLength} onChange={(e) => setCycleLength(e.target.value)}
                    min="20" max="45"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Estimated LMP Date</h2>
              
              {lmpDate ? (
                <div className="text-center animate-fade-in space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-rose-400">{lmpDate}</div>
                    <p className="text-gray-400 mt-4 text-sm max-w-xs mx-auto">This is the estimated first day of your last menstrual period prior to conception.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50 text-rose-500" />
                  <p>Enter your due date to calculate LMP.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
