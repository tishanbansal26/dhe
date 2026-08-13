import React, { useState } from 'react';
import { HeartPulse, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [fertileWindow, setFertileWindow] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const calculateOvulation = (e) => {
    e.preventDefault();
    if (lastPeriod && cycleLength) {
      const lmpDate = new Date(lastPeriod);
      const cycle = parseInt(cycleLength);
      
      // Ovulation typically occurs 14 days before the next period
      // So, LMP + Cycle Length - 14 days
      const daysToOvulation = cycle - 14;
      const ovulation = new Date(lmpDate.getTime() + (daysToOvulation * 24 * 60 * 60 * 1000));
      
      // Fertile window is 5 days before ovulation up to 1 day after
      const fertileStart = new Date(ovulation.getTime() - (5 * 24 * 60 * 60 * 1000));
      const fertileEnd = new Date(ovulation.getTime() + (1 * 24 * 60 * 60 * 1000));
      
      // Expected Due Date if conception occurs
      const expectedDue = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
      
      setOvulationDate(ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setFertileWindow(`${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
      setDueDate(expectedDue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    }
  };

  const resetForm = () => {
    setLastPeriod('');
    setCycleLength('28');
    setFertileWindow(null);
    setOvulationDate(null);
    setDueDate(null);
  };

  return (
    <>
      <SEO 
        title="Ovulation & Fertility Calculator | Radhe Investments"
        description="Calculate your ovulation date and fertile window to plan for pregnancy and explore our maternity health insurance coverage."
        canonicalUrl="https://www.radheinv.site/calculators/ovulation-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-6">
              <HeartPulse className="w-8 h-8 text-pink-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Ovulation Calculator</h1>
            <p className="text-gray-400 text-lg">Calculate your most fertile days to help plan your pregnancy.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Cycle Details</h2>
              <form onSubmit={calculateOvulation} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First day of your last period</label>
                  <input 
                    type="date" required value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Average Cycle Length (Days)</label>
                  <input 
                    type="number" required value={cycleLength} onChange={(e) => setCycleLength(e.target.value)}
                    min="20" max="45"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">Most women have a 28-day cycle.</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-pink-500 hover:bg-pink-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Your Fertility Window</h2>
              
              {ovulationDate ? (
                <div className="text-center animate-fade-in">
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Estimated Ovulation Date</div>
                    <div className="text-3xl font-bold text-pink-400">{ovulationDate}</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Fertile Window</div>
                    <div className="text-xl font-bold text-white">{fertileWindow}</div>
                  </div>
                  
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 mt-6 text-left">
                    <div className="text-sm text-gray-400 mb-1">If you conceive this cycle, your estimated due date is:</div>
                    <div className="text-lg font-bold text-teal-400">{dueDate}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <HeartPulse className="w-16 h-16 mx-auto mb-4 opacity-50 text-pink-500" />
                  <p>Enter your cycle details to see your fertility window.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
