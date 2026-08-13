import React, { useState } from 'react';
import { Flame, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';

export default function BMRCalculator() {
  const [gender, setGender] = useState('male');
  const [unitSystem, setUnitSystem] = useState('metric');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [bmr, setBmr] = useState(null);

  const calculateBMR = (e) => {
    e.preventDefault();
    if (age && weight) {
      let h, w;
      if (unitSystem === 'metric') {
        if (!heightCm) return;
        h = parseFloat(heightCm);
        w = parseFloat(weight);
      } else {
        if (!heightFt && !heightIn) return;
        const totalInches = (parseFloat(heightFt || 0) * 12) + parseFloat(heightIn || 0);
        h = totalInches * 2.54; // Convert inches to cm
        w = parseFloat(weight) * 0.453592; // Convert lbs to kg
      }

      if (h > 0 && w > 0) {
        // Mifflin-St Jeor Equation
        const a = parseInt(age);
        
        let result = (10 * w) + (6.25 * h) - (5 * a);
        if (gender === 'male') {
          result += 5;
        } else {
          result -= 161;
        }
        
        setBmr(Math.round(result));
      }
    }
  };

  const resetForm = () => {
    setGender('male');
    setUnitSystem('metric');
    setAge('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setWeight('');
    setBmr(null);
  };

  return (
    <>
      <SEO 
        title="BMR Calculator - Basal Metabolic Rate | Radhe Investments"
        description="Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body burns at rest."
        canonicalUrl="https://www.radheinv.site/calculators/bmr-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">BMR Calculator</h1>
            <p className="text-gray-400 text-lg">Calculate your Basal Metabolic Rate (calories burned at rest).</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Enter Details</h2>
              <form onSubmit={calculateBMR} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${gender === 'male' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-slate-500'}`}>
                      <input type="radio" name="gender" value="male" className="hidden" checked={gender === 'male'} onChange={() => setGender('male')} />
                      Male
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${gender === 'female' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-slate-500'}`}>
                      <input type="radio" name="gender" value="female" className="hidden" checked={gender === 'female'} onChange={() => setGender('female')} />
                      Female
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                    <input 
                      type="number" required value={age} onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Weight {unitSystem === 'metric' ? '(kg)' : '(lbs)'}</label>
                    <input 
                      type="number" required value={weight} onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder={unitSystem === 'metric' ? "e.g. 70" : "e.g. 150"}
                    />
                  </div>
                </div>
                
                {/* Unit Toggle */}
                <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 w-fit">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unitSystem === 'metric' ? 'bg-orange-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}
                  >
                    Metric Height (cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unitSystem === 'imperial' ? 'bg-orange-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}
                  >
                    Imperial Height (ft/in)
                  </button>
                </div>

                {unitSystem === 'metric' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
                    <input 
                      type="number" required value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="e.g. 170"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Height (Feet)</label>
                      <input 
                        type="number" required value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Height (Inches)</label>
                      <input 
                        type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="e.g. 8"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Your BMR Result</h2>
              
              {bmr ? (
                <div className="text-center animate-fade-in">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-4">
                    {bmr}
                  </div>
                  <div className="text-lg text-gray-400">Calories / Day</div>
                  
                  <div className="mt-8 text-left bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-sm text-gray-300">
                    <p className="mb-2">Your Basal Metabolic Rate is the number of calories your body needs to accomplish its most basic (basal) life-sustaining functions.</p>
                    <p>To lose weight, consume fewer calories than your BMR + activity level. To gain weight, consume more.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Flame className="w-16 h-16 mx-auto mb-4 opacity-50 text-orange-500" />
                  <p>Enter your details to calculate BMR.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
