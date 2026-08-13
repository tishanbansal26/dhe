import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { Shield, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function LifeCoverCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: 30,
    annualIncome: 1000000,
    monthlyExpenses: 40000,
    outstandingLoans: 500000,
    dependants: 2,
    futureGoals: 2000000,
    existingCover: 0,
    existingAssets: 500000
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateCover = (e) => {
    e.preventDefault();
    // Logic: Income Replacement + Liabilities + Goals - Assets - Existing Cover
    // Income replacement: Higher of 10x income OR expenses until retirement (age 60, min 10 years)
    const yearsToReplace = Math.max(60 - formData.age, 10);
    const incomeReplacement = Math.max(
      formData.annualIncome * 10,
      formData.monthlyExpenses * 12 * yearsToReplace
    );
    
    const totalRequirement = incomeReplacement + formData.outstandingLoans + formData.futureGoals;
    const totalDeductions = formData.existingCover + formData.existingAssets;
    
    const gap = Math.max(0, totalRequirement - totalDeductions);
    
    setResult({
      requirement: totalRequirement,
      existing: totalDeductions,
      gap: gap
    });
    
    // Track analytics event
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'life_cover',
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

  const resetForm = () => {
    setResult(null);
  };

  const faqData = [
    {
      question: "Is this calculator accurate?",
      answer: "This calculator provides an indicative estimate based on standard industry thumb rules (such as 10x-15x your annual income) and the financial information you entered. It is designed for educational purposes to help you understand your potential coverage gap."
    },
    {
      question: "Does this guarantee my insurance premium?",
      answer: "No. This tool estimates how much coverage you might need, not how much it will cost. Actual premiums depend on the insurer, your age, health status, policy term, and the specific product's underwriting guidelines."
    },
    {
      question: "What information affects my life insurance requirement?",
      answer: "Your requirement is primarily driven by your income, monthly expenses, outstanding debts (like home loans), future financial goals (like children's education), and the number of financial dependents you support."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Income Replacement:</strong> We calculate the higher of 10x your annual income or your annual expenses multiplied by the years until retirement (assumed age 60).</li>
      <li><strong>Liabilities & Goals:</strong> We add your outstanding loans and future financial goals to the income replacement amount.</li>
      <li><strong>Deductions:</strong> We subtract your existing life insurance coverage and liquid assets/investments.</li>
      <li><strong>The Result:</strong> The final figure represents the estimated coverage gap you need to protect your family's financial future.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Life Insurance Cover Calculator - Radhe Investments"
      description="Estimate your life insurance coverage requirement based on your income, expenses, and liabilities to find your protection gap."
      canonicalPath="/calculators/life-insurance-cover-calculator"
      breadcrumbName="Life Cover Calculator"
      heroTitle="Life Insurance Cover Calculator"
      heroSubtitle="Find out exactly how much life insurance your family needs to remain financially secure in your absence."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateCover} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Your Current Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="18"
                max="80"
              />
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Outstanding Loans/Debts (₹)</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Future Financial Goals (₹)</label>
              <input
                type="number"
                name="futureGoals"
                value={formData.futureGoals}
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Existing Assets/Savings (₹)</label>
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
              Calculate My Coverage Need
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Your Estimated Coverage Requirement</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Estimated Need</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(result.requirement)}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Existing Cover & Assets</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(result.existing)}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Potential Gap</p>
                <p className="text-3xl font-bold text-rose-400">{formatCurrency(result.gap)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-2">What This Means</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Based on your inputs, your family would need a corpus of approximately <strong className="text-white">{formatCurrency(result.gap)}</strong> to maintain their lifestyle, clear debts, and achieve future goals if you were no longer around. This is an indicative estimate for educational purposes.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/life')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Explore Life Insurance <ArrowRight className="w-4 h-4" />
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
