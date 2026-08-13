import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { PieChart, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function InsuranceGapCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    annualIncome: 1200000,
    monthlyExpenses: 50000,
    outstandingLoans: 2000000,
    dependants: 2,
    existingCover: 2500000,
    existingAssets: 1000000
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateGap = (e) => {
    e.preventDefault();
    
    // Very simple holistic calculation
    // Income replacement for 15 years OR expenses for 20 years
    const incomeNeed = formData.annualIncome * 15;
    const expenseNeed = formData.monthlyExpenses * 12 * 20;
    
    const baseRequirement = Math.max(incomeNeed, expenseNeed);
    const totalRequirement = baseRequirement + formData.outstandingLoans;
    const currentProtection = formData.existingCover + formData.existingAssets;
    
    const gap = Math.max(0, totalRequirement - currentProtection);
    
    setResult({
      requirement: totalRequirement,
      protection: currentProtection,
      gap: gap
    });
    
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'insurance_gap',
        gap_amount: gap
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
      question: "What is an insurance gap?",
      answer: "An insurance gap is the difference between the total amount of money your family would need to sustain their lifestyle (and pay off debts) in your absence, versus the amount of life insurance and liquid assets you currently possess."
    },
    {
      question: "Does my corporate insurance count?",
      answer: "While corporate insurance provides a temporary safety net, you shouldn't rely on it entirely for your life cover, as it ceases to exist if you change jobs or retire."
    },
    {
      question: "How can I close my insurance gap?",
      answer: "The most cost-effective way to close a large life insurance gap is by purchasing a Term Insurance policy, which provides high coverage for relatively low premiums."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Total Need:</strong> We estimate your total financial requirement by looking at income replacement (15 years) or expense replacement (20 years) plus any outstanding loans.</li>
      <li><strong>Current Protection:</strong> We sum up your existing life cover and your current savings/investments.</li>
      <li><strong>The Gap:</strong> We subtract your current protection from your total need to show you precisely where your portfolio might be falling short.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Insurance Gap Calculator - Radhe Investments"
      description="Calculate your life insurance gap to ensure your family's financial security is not compromised."
      canonicalPath="/calculators/insurance-gap-calculator"
      breadcrumbName="Insurance Gap Calculator"
      heroTitle="Insurance Gap Calculator"
      heroSubtitle="Analyze your current insurance portfolio and identify any critical coverage gaps before it's too late."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateGap} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Monthly Expenses (₹)</label>
              <input
                type="number"
                name="monthlyExpenses"
                value={formData.monthlyExpenses}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Outstanding Loans (₹)</label>
              <input
                type="number"
                name="outstandingLoans"
                value={formData.outstandingLoans}
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Life Cover (₹)</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Savings/Assets (₹)</label>
              <input
                type="number"
                name="existingAssets"
                value={formData.existingAssets}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                min="0"
              />
            </div>
          </div>
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 px-12 rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              Analyze My Gap
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <PieChart className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Your Insurance Gap Analysis</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Total Financial Requirement</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(result.requirement)}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Current Protection</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(result.protection)}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Coverage Gap</p>
                <p className="text-3xl font-bold text-rose-400">{formatCurrency(result.gap)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-2">What This Means</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {result.gap > 0 
                  ? `You are underinsured by ${formatCurrency(result.gap)}. If an unfortunate event occurs, your family's current protection (savings + existing life insurance) will not be sufficient to maintain their lifestyle and pay off debts.`
                  : "Congratulations! Based on your inputs, your current protection matches or exceeds your financial requirement."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/life')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Explore Term Insurance <ArrowRight className="w-4 h-4" />
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
