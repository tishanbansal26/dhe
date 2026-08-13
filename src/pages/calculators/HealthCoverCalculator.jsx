import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { HeartPulse, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function HealthCoverCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: 35,
    adults: 2,
    children: 1,
    cityTier: 'tier1',
    existingCover: 300000,
    preference: 'standard' // basic, standard, premium
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['cityTier', 'preference'].includes(name) ? value : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateHealthCover = (e) => {
    e.preventDefault();
    
    // Base coverage logic based on city tier and family size
    let basePerAdult = formData.cityTier === 'tier1' ? 700000 : (formData.cityTier === 'tier2' ? 500000 : 300000);
    let basePerChild = formData.cityTier === 'tier1' ? 300000 : 200000;
    
    // Age multiplier (medical inflation/risks increase with age)
    const ageMultiplier = formData.age > 45 ? 1.5 : (formData.age > 55 ? 2.0 : 1.0);
    
    // Preference multiplier
    const prefMultiplier = formData.preference === 'premium' ? 1.5 : (formData.preference === 'basic' ? 0.7 : 1.0);
    
    const suggestedTotal = ((formData.adults * basePerAdult) + (formData.children * basePerChild)) * ageMultiplier * prefMultiplier;
    
    // Create a range
    const minRange = Math.round((suggestedTotal * 0.8) / 100000) * 100000; // Round to nearest lakh
    const maxRange = Math.round((suggestedTotal * 1.2) / 100000) * 100000;
    
    const gap = Math.max(0, minRange - formData.existingCover);
    
    setResult({
      min: minRange,
      max: maxRange,
      gap: gap
    });
    
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'health_cover',
        suggested_min: minRange
      });
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const resetForm = () => setResult(null);

  const faqData = [
    {
      question: "How much health insurance do I really need?",
      answer: "A good rule of thumb is to have at least ₹5-10 Lakhs if you live in a Tier 2/3 city, and ₹10-20 Lakhs if you live in a Tier 1 metropolitan city due to the significantly higher costs of private corporate hospitals."
    },
    {
      question: "Is my corporate health insurance enough?",
      answer: "Corporate covers (employer policies) are great but they stop the moment you switch jobs or retire. It's highly recommended to have an independent retail health policy as your primary or secondary safety net."
    },
    {
      question: "What factors affect the premium?",
      answer: "Health insurance premiums depend on the age of the eldest family member in the policy, the sum insured, your residential zone (city tier), and any pre-existing medical conditions."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>City Tier:</strong> Medical costs vary wildly by city. Tier 1 cities require much higher base coverage than Tier 2 or 3 cities.</li>
      <li><strong>Family Size:</strong> We calculate a cumulative base pool required to cover the adults and children in your family.</li>
      <li><strong>Age Factor:</strong> The risk of critical illness increases with age, requiring a larger safety net.</li>
      <li><strong>Result:</strong> We provide an indicative range rather than a single number, as hospital choices (e.g., standard vs luxury rooms) affect your actual required coverage.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Health Insurance Cover Calculator - Radhe Investments"
      description="Calculate the ideal health insurance coverage required for you and your family based on city medical costs."
      canonicalPath="/calculators/health-insurance-cover-calculator"
      breadcrumbName="Health Cover Calculator"
      heroTitle="Health Insurance Cover Calculator"
      heroSubtitle="Find out the right medical coverage range to protect your savings against rising healthcare costs."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateHealthCover} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Age of Eldest Member</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="18"
                max="85"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">City of Residence</label>
              <select
                name="cityTier"
                value={formData.cityTier}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="tier1">Tier 1 (Metro Cities / Delhi, Mumbai, Bengaluru)</option>
                <option value="tier2">Tier 2 (Large Cities / Mansa, Chandigarh, Ludhiana)</option>
                <option value="tier3">Tier 3 (Smaller Towns / Rural)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Number of Adults (to be covered)</label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="1"
                max="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Number of Children</label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                min="0"
                max="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Health Cover (₹) (e.g. Corporate)</label>
              <input
                type="number"
                name="existingCover"
                value={formData.existingCover}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hospital Preference</label>
              <select
                name="preference"
                value={formData.preference}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="basic">Basic / Nursing Homes</option>
                <option value="standard">Standard Multi-specialty Hospitals</option>
                <option value="premium">Premium Corporate Hospitals</option>
              </select>
            </div>
          </div>
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 px-12 rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              Calculate Required Cover
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
              <HeartPulse className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Indicative Coverage Range</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">Suggested Health Insurance Range</p>
              <p className="text-3xl md:text-4xl font-bold text-teal-400">
                {formatCurrency(result.min)} - {formatCurrency(result.max)}
              </p>
            </div>
            
            {result.gap > 0 && (
              <div className="border-t border-slate-800 pt-4 text-center">
                <p className="text-sm font-semibold text-rose-400">
                  Coverage Gap Detected: You need at least {formatCurrency(result.gap)} more in coverage.
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-2">Factors that may affect this</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                This is an indicative coverage range based on typical healthcare costs. Your actual requirement may vary depending on family medical history, choice of hospital room type (private vs shared), and the specific coverage limits (room rent capping) of the policy you choose.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/health')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Explore Health Insurance <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetForm}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Recalculate
            </button>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-500 max-w-2xl mx-auto">
            Disclaimer: This calculator provides an indicative estimate based on the information entered. It is for educational purposes only and does not constitute financial, insurance or medical advice. Actual eligibility, premium, benefits and coverage depend on the applicable insurer, product terms and underwriting.
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
