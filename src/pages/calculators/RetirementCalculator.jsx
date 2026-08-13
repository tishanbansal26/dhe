import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/calculators/CalculatorLayout';
import { TrendingUp, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function RetirementCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 500000,
    monthlyInvestment: 15000,
    expectedReturn: 12, // percentage
    inflationRate: 6, // percentage
    desiredMonthlyIncome: 50000 // In today's value
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(0, parseFloat(value) || 0)
    }));
  };

  const calculateRetirement = (e) => {
    e.preventDefault();
    
    const yearsToRetire = Math.max(0, formData.retirementAge - formData.currentAge);
    if (yearsToRetire === 0) return; // Can't calculate if already retired in this simple tool
    
    const monthsToRetire = yearsToRetire * 12;
    const r = (formData.expectedReturn / 100) / 12; // Monthly return rate
    
    // Future Value of Current Savings (Compound Interest)
    // FV = PV * (1 + r)^n
    const fvSavings = formData.currentSavings * Math.pow(1 + r, monthsToRetire);
    
    // Future Value of Monthly SIP (Future Value of Annuity)
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    let fvSIP = 0;
    if (r > 0) {
      fvSIP = formData.monthlyInvestment * ((Math.pow(1 + r, monthsToRetire) - 1) / r) * (1 + r);
    } else {
      fvSIP = formData.monthlyInvestment * monthsToRetire;
    }
    
    const totalCorpus = fvSavings + fvSIP;
    
    // Future Value of Desired Monthly Income (adjusted for inflation)
    // FV = PV * (1 + inflation)^years
    const futureMonthlyIncome = formData.desiredMonthlyIncome * Math.pow(1 + (formData.inflationRate / 100), yearsToRetire);
    
    // Very simple corpus requirement assumption: Using the 4% rule (annual withdrawal)
    // Required Corpus = (Future Annual Income) / 0.04
    const futureAnnualIncome = futureMonthlyIncome * 12;
    const requiredCorpus = futureAnnualIncome / 0.04; 
    
    const gap = Math.max(0, requiredCorpus - totalCorpus);
    
    setResult({
      totalCorpus: totalCorpus,
      futureMonthlyIncome: futureMonthlyIncome,
      requiredCorpus: requiredCorpus,
      gap: gap
    });
    
    if (window.gtag) {
      window.gtag('event', 'calculator_completed', {
        calculator_type: 'retirement',
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
      question: "What is the 4% rule?",
      answer: "The 4% rule is a standard retirement thumb rule suggesting you can safely withdraw 4% of your total retirement corpus annually (adjusted for inflation each year) without running out of money for at least 30 years."
    },
    {
      question: "Why is inflation so important?",
      answer: "Inflation erodes the purchasing power of your money over time. An expense of ₹50,000 today will cost significantly more in 20 years. This calculator automatically adjusts your desired income for inflation."
    },
    {
      question: "Is this result guaranteed?",
      answer: "No. This calculator provides an illustrative estimate assuming constant compounding returns and inflation. Real-world market returns fluctuate, and actual inflation rates vary."
    }
  ];

  const howItWorks = (
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Future Income:</strong> We take your desired monthly income (in today's value) and inflate it over your working years using your estimated inflation rate.</li>
      <li><strong>Required Corpus:</strong> We calculate the total corpus needed at retirement to generate that inflated income using the standard 4% safe withdrawal rate.</li>
      <li><strong>Estimated Corpus:</strong> We project the future value of your current savings and monthly investments using compound interest formula based on your expected return.</li>
      <li><strong>The Gap:</strong> We compare what you will have against what you will need.</li>
    </ul>
  );

  return (
    <CalculatorLayout
      title="Retirement & Pension Calculator - Radhe Investments"
      description="Estimate the corpus required for a comfortable retirement and see if your current savings are on track."
      canonicalPath="/calculators/retirement-calculator"
      breadcrumbName="Retirement Calculator"
      heroTitle="Retirement Planning Calculator"
      heroSubtitle="Find out exactly how much you need to save today to maintain your lifestyle tomorrow."
      faqData={faqData}
      howItWorks={howItWorks}
    >
      {!result ? (
        <form onSubmit={calculateRetirement} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Age</label>
              <input
                type="number"
                name="currentAge"
                value={formData.currentAge}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="18"
                max="75"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Expected Retirement Age</label>
              <input
                type="number"
                name="retirementAge"
                value={formData.retirementAge}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min={formData.currentAge + 1}
                max="85"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Desired Monthly Income at Retirement (in today's value ₹)</label>
              <input
                type="number"
                name="desiredMonthlyIncome"
                value={formData.desiredMonthlyIncome}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Savings / Corpus (₹)</label>
              <input
                type="number"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Monthly Investment / SIP (₹)</label>
              <input
                type="number"
                name="monthlyInvestment"
                value={formData.monthlyInvestment}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Expected Annual Return (%)</label>
              <input
                type="number"
                name="expectedReturn"
                value={formData.expectedReturn}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
                max="30"
                step="0.1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Expected Inflation Rate (%)</label>
              <input
                type="number"
                name="inflationRate"
                value={formData.inflationRate}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                required
                min="0"
                max="20"
                step="0.1"
              />
            </div>
          </div>
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 px-12 rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              Calculate Retirement Needs
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Retirement Projection</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Required Corpus at Age {formData.retirementAge}</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(result.requiredCorpus)}</p>
                <p className="text-xs text-gray-500 mt-2">To generate {formatCurrency(result.futureMonthlyIncome)} monthly</p>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">Estimated Corpus from Savings</p>
                <p className="text-3xl font-bold text-teal-400">{formatCurrency(result.totalCorpus)}</p>
                {result.gap > 0 ? (
                  <p className="text-sm font-semibold text-rose-400 mt-2">Shortfall: {formatCurrency(result.gap)}</p>
                ) : (
                  <p className="text-sm font-semibold text-emerald-400 mt-2">You are on track!</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-2">The Impact of Inflation</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Because of an assumed {formData.inflationRate}% annual inflation rate, your desired monthly income of {formatCurrency(formData.desiredMonthlyIncome)} today will cost approximately <strong className="text-white">{formatCurrency(result.futureMonthlyIncome)}</strong> by the time you retire.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/category/investment')}
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all"
            >
              Explore Pension Plans <ArrowRight className="w-4 h-4" />
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
