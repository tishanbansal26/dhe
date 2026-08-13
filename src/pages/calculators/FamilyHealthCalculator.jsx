import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { Users, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function FamilyHealthCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    adults: 2,
    children: 2,
    eldestAge: 45,
    cityTier: 'tier1',
    existingCover: 500000
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cityTier' ? value : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateFamilyCover = (e) => {
    e.preventDefault();
    
    // Floater logic is different from individual logic. 
    // Usually base cover for family of 4 in tier 1 is around 10-15L minimum.
    let baseCover = formData.cityTier === 'tier1' ? 1000000 : (formData.cityTier === 'tier2' ? 700000 : 500000);
    
    // Add amount per additional member beyond 2
    const totalMembers = formData.adults + formData.children;
    if (totalMembers > 2) {
      baseCover += (totalMembers - 2) * (formData.cityTier === 'tier1' ? 200000 : 100000);
    }
    
    // Age multiplier based on eldest member
    const ageMultiplier = formData.eldestAge > 55 ? 2.0 : (formData.eldestAge > 45 ? 1.5 : 1.0);
    
    const suggestedCover = baseCover * ageMultiplier;
    const gap = Math.max(0, suggestedCover - formData.existingCover);
    
    setResult({
      suggested: suggestedCover,
      gap: gap
    });
    
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'family_health',
        suggested_amount: suggestedCover
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
      question: "What is a Family Floater policy?",
      answer: "A family floater policy covers multiple family members under a single shared sum insured. If one member gets hospitalized, they can use the entire sum insured, leaving the remaining balance for others."
    },
    {
      question: "Why does the age of the eldest member matter?",
      answer: "In family floater plans, the premium is entirely determined by the age of the eldest covered member because they typically represent the highest medical risk."
    },
    {
      question: "Should I include my senior citizen parents in my floater?",
      answer: "It is usually better to buy a separate senior citizen health policy for parents. Including them in your primary family floater will drastically increase the premium for the entire family because the premium is based on their age."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Base Requirement:</strong> A minimum base pool is set based on your city's typical hospitalization costs (Tier 1 vs Tier 2).</li>
      <li><strong>Family Size:</strong> Additional buffer is added for every member beyond two to ensure the shared pool isn't exhausted by a single illness.</li>
      <li><strong>Age Risk:</strong> A multiplier is applied if the eldest member is over 45 or 55, as critical illness risks increase significantly with age.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Family Health Insurance Calculator - Radhe Investments"
      description="Calculate the ideal family floater health insurance coverage for your entire family."
      canonicalPath="/calculators/family-health-insurance-calculator"
      breadcrumbName="Family Health Calculator"
      heroTitle="Family Health Insurance Calculator"
      heroSubtitle="Estimate the shared medical coverage pool required to protect your family against escalating healthcare costs."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateFamilyCover} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Age of Eldest Member</label>
              <input
                type="number"
                name="eldestAge"
                value={formData.eldestAge}
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
                <option value="tier1">Tier 1 (Metros like Delhi, Mumbai, Bengaluru)</option>
                <option value="tier2">Tier 2 (Cities like Mansa, Ludhiana, Chandigarh)</option>
                <option value="tier3">Tier 3 (Smaller Towns & Rural Areas)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Number of Adults (incl. you)</label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="1"
                max="6"
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
                max="6"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Family Floater Cover (₹)</label>
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
              Calculate Family Coverage
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Indicative Family Coverage Requirement</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Suggested Shared Pool (Sum Insured)</p>
                <p className="text-3xl font-bold text-teal-400">{formatCurrency(result.suggested)}</p>
                <p className="text-xs text-gray-500 mt-2">Recommended for a family of {formData.adults + formData.children}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Your Current Protection</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(formData.existingCover)}</p>
                {result.gap > 0 ? (
                  <p className="text-sm font-semibold text-rose-400 mt-2">Coverage Gap: {formatCurrency(result.gap)}</p>
                ) : (
                  <p className="text-sm font-semibold text-emerald-400 mt-2">Adequately Covered</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-2">Important Consideration</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                If multiple family members fall ill simultaneously (e.g., during a viral outbreak), a shared pool can deplete rapidly. The suggested coverage ensures adequate buffer to protect your savings in such scenarios.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/health')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Explore Family Health Plans <ArrowRight className="w-4 h-4" />
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
