import React, { useState } from 'react';
import { Activity, ArrowRight, RefreshCcw } from 'lucide-react';
import SEO from '../../components/SEO';
import { generateBreadcrumbSchema } from '../../lib/schema';

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState('metric');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    if (weight) {
      let heightInMeters;
      let weightInKg;

      if (unitSystem === 'metric') {
        if (!heightCm) return;
        heightInMeters = parseFloat(heightCm) / 100;
        weightInKg = parseFloat(weight);
      } else {
        if (!heightFt && !heightIn) return;
        const totalInches = (parseFloat(heightFt || 0) * 12) + parseFloat(heightIn || 0);
        heightInMeters = totalInches * 0.0254;
        weightInKg = parseFloat(weight) * 0.453592;
      }

      if (heightInMeters > 0 && weightInKg > 0) {
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      
      setBmi(bmiValue);
      
      if (bmiValue < 18.5) setCategory('Underweight');
      else if (bmiValue >= 18.5 && bmiValue <= 24.9) setCategory('Normal weight');
      else if (bmiValue >= 25 && bmiValue <= 29.9) setCategory('Overweight');
        else setCategory('Obese');
      }
    }
  };

  const resetForm = () => {
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setWeight('');
    setBmi(null);
    setCategory('');
  };

  return (
    <>
      <SEO 
        title="BMI Calculator - Body Mass Index | Radhe Investments"
        description="Calculate your Body Mass Index (BMI) instantly. Understanding your BMI is crucial for assessing health risks and determining health insurance premiums."
        canonicalUrl="https://www.radheinv.site/calculators/bmi-calculator"
      />

      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
              <Activity className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">BMI Calculator</h1>
            <p className="text-gray-400 text-lg">Calculate your Body Mass Index to understand your health category.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h2 className="text-2xl font-bold text-white mb-6">Enter Details</h2>
              <form onSubmit={calculateBMI} className="space-y-6">
                
                {/* Unit Toggle */}
                <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 w-fit">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unitSystem === 'metric' ? 'bg-teal-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}
                  >
                    Metric (cm / kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unitSystem === 'imperial' ? 'bg-teal-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}
                  >
                    Imperial (ft / lbs)
                  </button>
                </div>

                {unitSystem === 'metric' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Height (in cm)</label>
                    <input 
                      type="number" 
                      required
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="e.g. 170"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Height (Feet)</label>
                      <input 
                        type="number" 
                        required
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Height (Inches)</label>
                      <input 
                        type="number" 
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                        placeholder="e.g. 8"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weight {unitSystem === 'metric' ? '(in kg)' : '(in lbs)'}</label>
                  <input 
                    type="number" 
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder={unitSystem === 'metric' ? "e.g. 70" : "e.g. 150"}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    Calculate <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Your BMI Result</h2>
              
              {bmi ? (
                <div className="text-center animate-fade-in relative z-10">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                    {bmi}
                  </div>
                  <div className={`text-xl font-medium px-4 py-2 rounded-full inline-block ${
                    category === 'Normal weight' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    category === 'Underweight' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    category === 'Overweight' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {category}
                  </div>
                  
                  <div className="mt-8 text-left bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <h4 className="text-white font-medium mb-3">BMI Categories:</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex justify-between"><span>Underweight:</span> <span className="text-white">{'<'} 18.5</span></li>
                      <li className="flex justify-between"><span>Normal weight:</span> <span className="text-emerald-400">18.5 - 24.9</span></li>
                      <li className="flex justify-between"><span>Overweight:</span> <span className="text-yellow-400">25 - 29.9</span></li>
                      <li className="flex justify-between"><span>Obese:</span> <span className="text-rose-400">{'>='} 30</span></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12 relative z-10">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Enter your details to see your BMI result.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* SEO Content Section */}
          <div className="mt-16 prose prose-invert max-w-none">
            <h2>Why is BMI Important for Health Insurance?</h2>
            <p>Body Mass Index (BMI) is a crucial metric used by health insurance providers to assess your overall health and determine potential medical risks. Individuals falling outside the "Normal weight" category may be subjected to medical check-ups before policy issuance and could face higher premium rates (loading) due to increased risks of lifestyle diseases like diabetes and hypertension.</p>
          </div>
        </div>
      </div>
    </>
  );
}
