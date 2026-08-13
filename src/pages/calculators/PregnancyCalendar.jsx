import React, { useState } from 'react';
import { Calendar, ArrowRight, RefreshCcw, CheckCircle } from 'lucide-react';
import SEO from '../../components/SEO';

export default function PregnancyCalendar() {
  const [conceptionDate, setConceptionDate] = useState('');
  const [calendar, setCalendar] = useState(null);

  const calculateCalendar = (e) => {
    e.preventDefault();
    if (conceptionDate) {
      const conception = new Date(conceptionDate);
      
      // Based on conception date (which is usually 14 days after LMP)
      // First Trimester: Conception to 11 weeks (13 weeks from LMP)
      // Second Trimester: 11 to 25 weeks (13 to 27 weeks from LMP)
      // Third Trimester: 25 to 38 weeks (27 to 40 weeks from LMP)
      // Due Date: 266 days from conception
      
      const firstTriEnd = new Date(conception.getTime() + (11 * 7 * 24 * 60 * 60 * 1000));
      const secondTriEnd = new Date(conception.getTime() + (25 * 7 * 24 * 60 * 60 * 1000));
      const expectedDue = new Date(conception.getTime() + (266 * 24 * 60 * 60 * 1000));
      
      setCalendar({
        conception: conception.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        firstTri: firstTriEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        secondTri: secondTriEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: expectedDue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });
    }
  };

  const resetForm = () => {
    setConceptionDate('');
    setCalendar(null);
  };

  return (
    <>
      <SEO 
        title="Pregnancy Calendar based on Conception | Radhe Investments"
        description="Track your pregnancy trimesters and key milestones based on your conception date."
        canonicalUrl="https://www.radheinv.site/calculators/pregnancy-calendar"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
              <Calendar className="w-8 h-8 text-fuchsia-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Pregnancy Calendar</h1>
            <p className="text-gray-400 text-lg">Track your pregnancy trimesters based on your conception date.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Conception Details</h2>
              <form onSubmit={calculateCalendar} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Conception Date</label>
                  <input 
                    type="date" required value={conceptionDate} onChange={(e) => setConceptionDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  <p className="text-xs text-gray-500 mt-2">The exact date of conception.</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Generate Calendar <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Trimester Milestones</h2>
              
              {calendar ? (
                <div className="animate-fade-in space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/80 p-4 rounded border border-slate-700 shadow">
                      <div className="text-fuchsia-400 font-bold mb-1">First Trimester Ends</div>
                      <div className="text-white text-sm">{calendar.firstTri}</div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/80 p-4 rounded border border-slate-700 shadow">
                      <div className="text-fuchsia-400 font-bold mb-1">Second Trimester Ends</div>
                      <div className="text-white text-sm">{calendar.secondTri}</div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-fuchsia-500 bg-fuchsia-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-fuchsia-500/20 p-4 rounded border border-fuchsia-500/50 shadow">
                      <div className="text-white font-bold mb-1">Estimated Due Date</div>
                      <div className="text-fuchsia-300 font-medium text-lg">{calendar.dueDate}</div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50 text-fuchsia-500" />
                  <p>Enter conception date to generate calendar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
