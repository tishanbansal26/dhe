import React, { useState } from 'react';
import { Activity, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';

export default function GFRCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [creatinine, setCreatinine] = useState('');
  const [race, setRace] = useState('other');
  const [gfr, setGfr] = useState(null);
  const [stage, setStage] = useState('');

  const calculateGFR = (e) => {
    e.preventDefault();
    if (age && creatinine) {
      // CKD-EPI 2021 formula (Simplified standard)
      const scr = parseFloat(creatinine);
      const a = parseInt(age);
      let kappa = gender === 'female' ? 0.7 : 0.9;
      let alpha = gender === 'female' ? -0.241 : -0.302;
      let min = Math.min(scr / kappa, 1);
      let max = Math.max(scr / kappa, 1);
      
      let eGFR = 142 * Math.pow(min, alpha) * Math.pow(max, -1.200) * Math.pow(0.9938, a);
      if (gender === 'female') eGFR = eGFR * 1.012;
      
      // Legacy adjustment for African American (though deprecated in 2021, some older medical guidelines still use it)
      if (race === 'black') eGFR = eGFR * 1.159;

      const result = Math.round(eGFR);
      setGfr(result);
      
      if (result >= 90) setStage('Normal (Stage 1)');
      else if (result >= 60) setStage('Mild Decrease (Stage 2)');
      else if (result >= 45) setStage('Mild to Moderate (Stage 3a)');
      else if (result >= 30) setStage('Moderate to Severe (Stage 3b)');
      else if (result >= 15) setStage('Severe Decrease (Stage 4)');
      else setStage('Kidney Failure (Stage 5)');
    }
  };

  const resetForm = () => {
    setAge('');
    setGender('male');
    setCreatinine('');
    setRace('other');
    setGfr(null);
    setStage('');
  };

  return (
    <>
      <SEO 
        title="GFR Calculator - Kidney Function | Radhe Investments"
        description="Calculate your Estimated Glomerular Filtration Rate (eGFR). Important for medical underwriting in health insurance."
        canonicalUrl="https://www.radheinv.site/calculators/gfr-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">GFR Calculator (Kidney Function)</h1>
            <p className="text-gray-400 text-lg">Calculate your estimated Glomerular Filtration Rate (eGFR).</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Patient Details</h2>
              <form onSubmit={calculateGFR} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Age (Years)</label>
                    <input 
                      type="number" required value={age} onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Serum Creatinine</label>
                    <div className="relative">
                      <input 
                        type="number" step="0.01" required value={creatinine} onChange={(e) => setCreatinine(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                      <span className="absolute right-4 top-3 text-gray-500 text-sm">mg/dL</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${gender === 'male' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-slate-500'}`}>
                      <input type="radio" value="male" className="hidden" checked={gender === 'male'} onChange={() => setGender('male')} /> Male
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${gender === 'female' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-slate-500'}`}>
                      <input type="radio" value="female" className="hidden" checked={gender === 'female'} onChange={() => setGender('female')} /> Female
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate eGFR <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Your eGFR Result</h2>
              
              {gfr ? (
                <div className="text-center animate-fade-in">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
                    {gfr}
                  </div>
                  <div className="text-lg text-gray-400 mb-4">mL/min/1.73m²</div>
                  
                  <div className={`text-lg font-bold px-4 py-2 rounded-full inline-block ${
                    stage.includes('Normal') ? 'bg-emerald-500/20 text-emerald-400' :
                    stage.includes('Mild') ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {stage}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50 text-cyan-500" />
                  <p>Enter your details to calculate eGFR.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
