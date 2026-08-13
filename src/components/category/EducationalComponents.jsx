import React, { useState } from 'react';
import { 
  FileText, Clock, FileCheck, CheckSquare, Settings, 
  HelpCircle, ChevronDown, ArrowRight, PhoneCall 
} from 'lucide-react';

/* --- WAITING PERIODS / CONDITIONS --- */
export const WaitingPeriods = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <section className="py-20 bg-navy-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Understanding Waiting Periods & Conditions</h2>
        <div className="space-y-6">
          {data.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-500 text-center mt-6">
            *Actual waiting periods depend on the insurer and selected product.
          </p>
        </div>
      </div>
    </section>
  );
};

/* --- DOCUMENTS REQUIRED --- */
export const DocumentsGuide = ({ documents, choosingGuide }) => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Documents */}
          {documents && documents.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Documents You May Need</h2>
              <div className="grid grid-cols-2 gap-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <FileCheck className="w-5 h-5 text-teal-400" />
                    <span className="text-slate-300 text-sm font-medium">{doc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">*Requirements vary by product and insurer.</p>
            </div>
          )}

          {/* How To Choose */}
          {choosingGuide && choosingGuide.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">How to Choose the Right Plan</h2>
              <div className="space-y-4">
                {choosingGuide.map((guide, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 text-sm font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300 text-sm">{guide}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

/* --- CLAIMS & RENEWALS --- */
export const ClaimsRenewal = ({ claims, renewals }) => {
  return (
    <section className="py-20 bg-navy-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Claims */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">How to Claim Your Insurance</h2>
            <div className="relative border-l-2 border-slate-700 ml-4 space-y-8 pb-8">
              {claims?.map((step, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-teal-500 rounded-full ring-4 ring-navy-900"></div>
                  <h3 className="text-white font-semibold mb-1">{step.step}. {step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
            <button className="text-teal-400 font-semibold text-sm flex items-center gap-2 hover:text-teal-300 transition-colors mt-4 ml-4">
              Need Claim Assistance? <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Renewals */}
          {renewals && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Keep Your Policy Active</h2>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <p className="text-slate-300 mb-6 leading-relaxed">{renewals.description}</p>
                <ul className="space-y-4 mb-8">
                  {renewals.points?.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckSquare className="w-5 h-5 text-teal-400 shrink-0" />
                      <span className="text-slate-300 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors">
                  Check Renewal
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

/* --- EDUCATION / KNOW ABOUT --- */
export const EducationalContent = ({ education, glossary, categoryName }) => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Know About {categoryName}</h2>
        <p className="text-center text-slate-400 mb-12">
          Understand how {categoryName.toLowerCase()} works, what to consider before choosing a plan, and how claims and renewals generally work.
        </p>

        <div className="prose prose-invert prose-teal max-w-none">
          {education?.map((block, idx) => (
            <div key={idx} className="mb-10">
              <h3 className="text-2xl font-bold text-white mb-4">{block.h3}</h3>
              <p className="text-slate-300 leading-relaxed">{block.content}</p>
            </div>
          ))}
        </div>

        {/* Glossary */}
        {glossary && glossary.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-8 border-t border-slate-800 pt-10">Insurance Terms You Should Know</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {glossary.map((g, idx) => (
                <div key={idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <h4 className="text-white font-bold mb-2">{g.term}</h4>
                  <p className="text-slate-400 text-sm">{g.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* --- FAQ --- */
export const CategoryFAQ = ({ faq, categoryName }) => {
  const [openQ, setOpenQ] = useState(null);

  if (!faq || faq.length === 0) return null;
  // Assume faq is an array of categories, we'll just flatten it or use the first for now.
  const allQs = faq.flatMap(f => f.items || []);

  return (
    <section className="py-20 bg-navy-900 border-t border-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions About {categoryName}</h2>
        <div className="space-y-4">
          {allQs.map((item, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenQ(openQ === idx ? null : idx)}
              >
                <span className="font-semibold text-white pr-4">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-teal-400 transition-transform ${openQ === idx ? 'rotate-180' : ''}`} />
              </button>
              {openQ === idx && (
                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --- FINAL CTA --- */
export const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 to-navy-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Need Help Choosing the Right Insurance?</h2>
        <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
          Every customer's situation is different. Radhe Investments can help you understand available options and explore plans suitable for your requirements.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors">
            Get a Quote
          </button>
          <button className="bg-slate-800 border border-slate-600 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2">
            Talk to an Advisor
          </button>
        </div>
      </div>
    </section>
  );
};
