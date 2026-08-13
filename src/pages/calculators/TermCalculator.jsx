import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function TermCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: 35,
    gender: 'male',
    annualIncome: 1200000,
    existingLiabilities: 1500000,
    dependants: 3,
    desiredTerm: 25,
    desiredCover: 10000000
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateTermCover = (e) => {
    e.preventDefault();
    
    // Logic: Income * 15 + Liabilities
    const incomeMultiplier = formData.age < 40 ? 20 : (formData.age < 50 ? 15 : 10);
    const suggestedCover = (formData.annualIncome * incomeMultiplier) + formData.existingLiabilities;
    
    const gap = Math.max(0, suggestedCover - formData.desiredCover);
    
    setResult({
      suggested: suggestedCover,
      desired: formData.desiredCover,
      gap: gap,
      recommendedTerm: Math.max(65 - formData.age, formData.desiredTerm) // Usually until retirement
    });
    
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'term_insurance',
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
      question: "How is the suggested term coverage calculated?",
      answer: "We use the Human Life Value (HLV) principle. Generally, we recommend a life cover of 15-20 times your annual income if you are under 40, plus any outstanding loans. This ensures your family can invest the payout to generate an income stream replacing yours."
    },
    {
      question: "Does this guarantee my insurance premium?",
      answer: "No, this calculator only estimates the coverage amount you need, not the premium cost. We do not calculate fake premiums. Actual premiums depend on your age, smoking status, gender, policy term, and medical underwriting."
    },
    {
      question: "Until what age should I take term insurance?",
      answer: "Typically, term insurance is recommended until your intended retirement age (usually 60-65 years), as this is when your active income stops and your major financial responsibilities are ideally fulfilled."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Income Multiplier:</strong> We multiply your annual income by an age-based factor (20x if under 40, 15x if under 50, 10x if over 50).</li>
      <li><strong>Liabilities:</strong> We add your existing loans to ensure they are fully paid off in case of an eventuality.</li>
      <li><strong>Comparison:</strong> We compare our suggested coverage against your desired coverage to identify any potential shortfall.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Term Insurance Calculator - Radhe Investments"
      description="Estimate how much term insurance coverage you need to fully protect your family's future."
      canonicalPath="/calculators/term-insurance-calculator"
      breadcrumbName="Term Calculator"
      heroTitle="Term Insurance Calculator"
      heroSubtitle="Discover the right amount of term life coverage to secure your family's financial independence."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateTermCover} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="18"
                max="65"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Annual Income (₹)</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Liabilities/Loans (₹)</label>
              <input
                type="number"
                name="existingLiabilities"
                value={formData.existingLiabilities}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Number of Dependants</label>
              <input
                type="number"
                name="dependants"
                value={formData.dependants}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Desired Policy Term (Years)</label>
              <input
                type="number"
                name="desiredTerm"
                value={formData.desiredTerm}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                min="5"
                max="50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">What coverage amount are you considering? (₹)</label>
              <input
                type="number"
                name="desiredCover"
                value={formData.desiredCover}
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
              Analyze My Term Needs
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Coverage Assessment</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Our Estimated Coverage Requirement</p>
                <p className="text-3xl font-bold text-teal-400">{formatCurrency(result.suggested)}</p>
                <p className="text-xs text-gray-500 mt-2">For a recommended term of {result.recommendedTerm} years</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Your Desired Coverage</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(result.desired)}</p>
                {result.gap > 0 ? (
                  <p className="text-sm font-semibold text-rose-400 mt-2">Shortfall: {formatCurrency(result.gap)}</p>
                ) : (
                  <p className="text-sm font-semibold text-emerald-400 mt-2">Sufficiently covered</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-2">Important Note</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                This is an estimated coverage requirement, not a fabricated premium. Term insurance premiums vary significantly between insurers based on your age, medical history, and lifestyle choices.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/term')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Request a Term Insurance Quote <ArrowRight className="w-4 h-4" />
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
