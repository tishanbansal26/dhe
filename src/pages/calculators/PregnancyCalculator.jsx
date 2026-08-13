import React, { useState } from 'react';
import { Baby, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';

export default function PregnancyCalculator() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [dueDate, setDueDate] = useState(null);
  const [weeksPregnant, setWeeksPregnant] = useState(null);

  const calculatePregnancy = (e) => {
    e.preventDefault();
    if (lastPeriod && cycleLength) {
      const lmpDate = new Date(lastPeriod);
      const cycle = parseInt(cycleLength);
      
      // Naegele's rule: LMP + 280 days (adjust for cycle length difference from 28)
      const adjustedDays = 280 + (cycle - 28);
      const expectedDue = new Date(lmpDate.getTime() + (adjustedDays * 24 * 60 * 60 * 1000));
      
      const today = new Date();
      const diffTime = Math.abs(today - lmpDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let weeks = Math.floor(diffDays / 7);
      let days = diffDays % 7;
      
      if (today < lmpDate) {
        setWeeksPregnant("Not pregnant yet");
      } else if (weeks > 42) {
        setWeeksPregnant("Post-term");
      } else {
        setWeeksPregnant(`${weeks} Weeks, ${days} Days`);
      }
      
      setDueDate(expectedDue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    }
  };

  const resetForm = () => {
    setLastPeriod('');
    setCycleLength('28');
    setDueDate(null);
    setWeeksPregnant(null);
  };

  return (
    <>
      <SEO 
        title="Pregnancy Due Date Calculator | Radhe Investments"
        description="Calculate your pregnancy due date and current timeline to plan for maternity health insurance coverage."
        canonicalUrl="https://www.radheinv.site/calculators/pregnancy-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
              <Baby className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Pregnancy Calculator</h1>
            <p className="text-gray-400 text-lg">Calculate your estimated due date based on your Last Menstrual Period.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
              <form onSubmit={calculatePregnancy} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First day of last period (LMP)</label>
                  <input 
                    type="date" required value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Average Cycle Length (Days)</label>
                  <input 
                    type="number" required value={cycleLength} onChange={(e) => setCycleLength(e.target.value)}
                    min="20" max="45"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate Due Date <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Pregnancy Timeline</h2>
              
              {dueDate ? (
                <div className="text-center animate-fade-in">
                  <div className="mb-8">
                    <div className="text-sm text-gray-400 mb-1">Estimated Due Date</div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{dueDate}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Current Progress</div>
                    <div className="text-2xl font-bold text-white">{weeksPregnant}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Baby className="w-16 h-16 mx-auto mb-4 opacity-50 text-purple-500" />
                  <p>Enter your details to see your timeline.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
