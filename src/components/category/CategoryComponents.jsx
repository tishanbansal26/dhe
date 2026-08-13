import React, { useState } from 'react';
import { 
  Shield, Heart, Activity, Target, ShieldCheck, ChevronDown, CheckCircle2, 
  ArrowRight, Phone, MessageSquare, AlertCircle, HelpCircle, 
  BookOpen, Calculator, FileText, ArrowUpRight
} from 'lucide-react';

/* --- PLAN FINDER --- */
export const PlanFinder = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Find the Right Insurance for Your Needs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item, idx) => (
            <div key={idx} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-teal-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --- INSURANCE TYPES --- */
export const InsuranceTypes = ({ data }) => {
  const [openIdx, setOpenIdx] = useState(0);
  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 bg-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Types of Insurance</h2>
        <div className="space-y-4">
          {data.map((type, idx) => (
            <div key={idx} className="border border-slate-700 rounded-2xl bg-slate-800 overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              >
                <span className="text-lg font-semibold text-white">{type.title}</span>
                <ChevronDown className={`w-5 h-5 text-teal-400 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-700">
                  <p className="text-slate-300 mb-4">{type.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <strong className="text-white block mb-1">Who it suits:</strong>
                      <span className="text-slate-400">{type.whoItSuits}</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <strong className="text-white block mb-1">Considerations:</strong>
                      <span className="text-slate-400">{type.considerations}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --- CATEGORY BENEFITS --- */
export const CategoryBenefits = ({ data, categoryName }) => {
  if (!data || data.length === 0) return null;
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Why Consider {categoryName} Insurance?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((benefit, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 mx-auto bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --- HOW IT WORKS --- */
export const HowItWorks = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <section className="py-20 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-16">How Does it Work?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {data.map((step, idx) => (
            <div key={idx} className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center">
              <div className="w-12 h-12 absolute -top-6 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 rounded-full flex items-center justify-center font-bold text-lg border-4 border-navy-900">
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 mt-4">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --- PREMIUM FACTORS & COVERAGE & ELIGIBILITY --- */
export const InsuranceDetails = ({ factors, coverage, eligibility }) => {
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Factors */}
        {factors && factors.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-white mb-12">What Affects Your Premium?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {factors.map((f, idx) => (
                <div key={idx} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                  <Calculator className="w-6 h-6 text-teal-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                  <p className="text-slate-400 text-xs mt-2">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coverage Grid */}
        {coverage && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-white mb-12">What is Covered?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Included</h3>
                <ul className="space-y-3">
                  {coverage.included?.map((item, idx) => (
                    <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Subject to Terms</h3>
                <ul className="space-y-3">
                  {coverage.subjectToTerms?.map((item, idx) => (
                    <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-slate-400 font-bold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5"/> Optional / Add-ons</h3>
                <ul className="space-y-3">
                  {coverage.notSpecified?.map((item, idx) => (
                    <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-slate-600 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

/* --- QUOTE JOURNEY CTA --- */
export const QuoteJourney = () => {
  return (
    <section id="quote-journey" className="py-20 bg-teal-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How to Get the Right Insurance Plan</h2>
        <p className="text-teal-100 mb-10 text-lg max-w-2xl mx-auto">
          Tell Us Your Requirement → Understand Your Needs → Explore Suitable Plans → Compare Options → Request a Quote
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-slate-100 transition-colors">
            Get My Quote
          </button>
          <button className="bg-teal-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-800 border border-teal-500 transition-colors">
            Talk to an Advisor
          </button>
        </div>
      </div>
    </section>
  );
};
