import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { HeartPulse, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function SeniorCitizenCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: 65,
    numberOfSeniors: 2,
    cityTier: 'tier1',
    existingCover: 0,
    preference: 'standard'
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['cityTier', 'preference'].includes(name) ? value : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateSeniorCover = (e) => {
    e.preventDefault();
    
    // Higher base cover due to advanced age risk
    let basePerSenior = formData.cityTier === 'tier1' ? 700000 : (formData.cityTier === 'tier2' ? 500000 : 400000);
    
    // Preference multiplier (premium implies better room rent limits and fewer co-pays)
    const prefMultiplier = formData.preference === 'premium' ? 1.5 : (formData.preference === 'basic' ? 0.7 : 1.0);
    
    // Age multiplier (75+ requires significantly higher coverage)
    const ageMultiplier = formData.age > 75 ? 1.5 : 1.0;
    
    const suggestedTotal = (formData.numberOfSeniors * basePerSenior) * prefMultiplier * ageMultiplier;
    
    // Create a range
    const minRange = Math.round((suggestedTotal * 0.8) / 100000) * 100000;
    const maxRange = Math.round((suggestedTotal * 1.3) / 100000) * 100000;
    
    const gap = Math.max(0, minRange - formData.existingCover);
    
    setResult({
      min: minRange,
      max: maxRange,
      gap: gap
    });
    
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'senior_citizen',
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
      question: "What is a Co-payment?",
      answer: "A co-payment is a fixed percentage (often 10% to 20%) of the claim amount that the policyholder must pay out of pocket. Many senior citizen policies include mandatory co-pays to keep premiums affordable."
    },
    {
      question: "Are pre-existing diseases covered immediately?",
      answer: "Usually no. Senior citizen policies often come with a waiting period for pre-existing diseases, ranging from 12 to 36 months, depending on the specific policy and insurer."
    },
    {
      question: "Can they be denied coverage?",
      answer: "Yes, eligibility and final premium depend heavily on the insurer's medical underwriting. Seniors with severe pre-existing conditions may face policy rejection or be required to pay higher 'loaded' premiums."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Higher Base Risk:</strong> We allocate a higher base coverage amount compared to younger adults, as seniors are more prone to prolonged or severe medical emergencies.</li>
      <li><strong>City Factor:</strong> Hospitalization costs for age-related procedures (like knee replacements) vary significantly between Tier 1 metros and Tier 2 cities.</li>
      <li><strong>Result Range:</strong> The final output is an indicative range designed to guide your search for the right policy. It is not a guaranteed medical assessment.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Senior Citizen Health Insurance Calculator - Radhe Investments"
      description="Calculate the ideal health insurance coverage required for senior citizens and elderly parents."
      canonicalPath="/calculators/senior-citizen-health-insurance-calculator"
      breadcrumbName="Senior Citizen Calculator"
      heroTitle="Senior Citizen Health Calculator"
      heroSubtitle="Determine the right level of medical coverage to protect your elderly parents' health and your savings."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateSeniorCover} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Age of Eldest Senior</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="60"
                max="99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Number of Seniors to Cover</label>
              <input
                type="number"
                name="numberOfSeniors"
                value={formData.numberOfSeniors}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="1"
                max="2"
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
                <option value="tier1">Tier 1 (Metro Cities / Major Hubs)</option>
                <option value="tier2">Tier 2 (Large Cities / District Hubs)</option>
                <option value="tier3">Tier 3 (Smaller Towns / Rural)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Coverage Preference</label>
              <select
                name="preference"
                value={formData.preference}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="basic">Basic (Accept higher co-pays to lower premium)</option>
                <option value="standard">Standard (Balanced coverage)</option>
                <option value="premium">Premium (Comprehensive, minimal co-pays)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Senior Health Cover (₹)</label>
              <input
                type="number"
                name="existingCover"
                value={formData.existingCover}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 text-lg font-bold"
                min="0"
              />
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <HeartPulse className="w-8 h-8 text-purple-400" />
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
                  Coverage Gap Detected: A shortfall of approx. {formatCurrency(result.gap)}
                </p>
              </div>
            )}
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-rose-400 mb-2">Critical Reminders for Senior Policies</h4>
              <ul className="text-gray-300 text-sm leading-relaxed list-disc pl-5 space-y-1">
                <li><strong>Pre-existing Diseases:</strong> Be prepared for waiting periods (usually 12-36 months) before pre-existing conditions are covered.</li>
                <li><strong>Co-payments:</strong> Most policies will require you to pay a percentage of the total hospital bill (e.g., 20% co-pay) from your own pocket.</li>
                <li><strong>Medical Underwriting:</strong> Eligibility and final premium depend strictly on the insurer's underwriting and product terms. Do not make any medical claims on this form.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/health')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Explore Senior Health Plans <ArrowRight className="w-4 h-4" />
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
