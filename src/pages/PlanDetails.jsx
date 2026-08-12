import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, ChevronDown, ChevronUp, FileText, Info } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import LeadCaptureModal from '../components/LeadCaptureModal';

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFaqTab, setActiveFaqTab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    async function fetchPlan() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('insurance_plans')
          .select('*, insurance_companies(name)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {});
          setPlan({
            id: data.id,
            name: data.name,
            provider: data.insurance_companies?.name,
            premium: meta.premium || '',
            summary: meta.summary || '',
            benefits: meta.benefits || [],
            tag: meta.tag || '',
            color: meta.color || '',
            borderColor: meta.borderColor || '',
            iconName: meta.iconName || 'Shield',
            iconColor: meta.iconColor || 'text-white',
            heroDescription: meta.heroDescription || '',
            detailedBenefits: meta.detailedBenefits || [],
            faqs: meta.faqs || [],
            eligibility: meta.eligibility || {}
          });
        }
      } catch (err) {
        console.error('Error fetching plan:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlan();
  }, [id]);

  useEffect(() => {
    if (plan) {
      document.title = `${plan.name} - ${plan.provider} | Radhe Investments`;
    } else {
      document.title = 'Plan Details - Radhe Investments';
    }
  }, [plan]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-32 h-6 bg-slate-700/50 rounded animate-pulse mb-8"></div>
        <div className="glass-panel rounded-3xl p-8 md:p-12 mb-12 border border-slate-700/50 animate-pulse h-80">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 mb-6"></div>
          <div className="h-12 bg-slate-700/50 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-slate-700/50 rounded w-1/2 mb-8"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-slate-700/50 rounded-xl w-40"></div>
            <div className="h-12 bg-slate-700/50 rounded-xl w-40"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <div className="h-8 bg-slate-700/50 rounded w-1/3 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-700/50 rounded-2xl animate-pulse"></div>)}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="h-64 bg-slate-700/50 rounded-2xl animate-pulse"></div>
            <div className="h-48 bg-slate-700/50 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
          <button onClick={() => navigate('/')} className="text-teal-400 hover:text-teal-300 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const toggleFaq = (idx) => {
    if (openFaq === idx) {
      setOpenFaq(null);
    } else {
      setOpenFaq(idx);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Plans
      </button>

      {/* Hero Section */}
      <div className="relative glass-panel rounded-3xl p-8 md:p-12 mb-12 border border-slate-700/50 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-20 pointer-events-none`}></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-slate-800/80 border ${plan.borderColor} flex items-center justify-center shadow-lg`}>
                {(() => {
                  const IconComponent = Icons[plan.iconName] || Icons.Shield;
                  return <IconComponent className={`w-8 h-8 ${plan.iconColor}`} />;
                })()}
              </div>
              <span className="bg-teal-500/20 text-teal-300 text-sm px-4 py-1.5 rounded-full border border-teal-500/30 font-medium tracking-wide">
                {plan.tag}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{plan.name}</h1>
            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed mb-6">
              {plan.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
              >
                Calculate Premium
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-8 rounded-xl transition-all"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Benefits & FAQs) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Key Benefits */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-teal-400" /> Key Features & Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.detailedBenefits.map((benefit, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-teal-400" /> Frequently Asked Questions
            </h2>
            
            {/* FAQ Tabs */}
            {(() => {
              const categories = Array.from(new Set(plan.faqs.map(f => f.category)));
              // Default to first category if activeFaqTab not set or invalid
              const currentTab = categories.includes(activeFaqTab) ? activeFaqTab : categories[0];
              const filteredFaqs = plan.faqs.filter(f => f.category === currentTab);

              return (
                <div>
                  <div className="flex border-b border-slate-700/50 mb-6 overflow-x-auto hide-scrollbar">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveFaqTab(category);
                          setOpenFaq(null); // Close accordion on tab switch
                        }}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                          currentTab === category
                            ? 'border-teal-400 text-teal-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {filteredFaqs.map((faq, idx) => (
                      <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300">
                        <button 
                          onClick={() => toggleFaq(idx)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                        >
                          <span className="font-semibold text-white pr-4">{faq.question}</span>
                          {openFaq === idx ? (
                            <ChevronUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        <div 
                          className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${openFaq === idx ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <p className="text-gray-400 text-sm">{faq.answer}</p>
                          {faq.list && (
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400 text-sm">
                              {faq.list.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>

        </div>

        {/* Right Column (Eligibility & Downloads) */}
        <div className="space-y-8">
          
          {/* Eligibility Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700/50 pb-4">Eligibility Criteria</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Min. Entry Age</span>
                <span className="font-semibold text-white">{plan.eligibility.minEntryAge}</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Max. Entry Age</span>
                <span className="font-semibold text-white">{plan.eligibility.maxEntryAge}</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Maturity Age</span>
                <span className="font-semibold text-white">{plan.eligibility.maxMaturityAge}</span>
              </li>
              <li className="flex flex-col gap-1 text-sm border-t border-slate-700/50 pt-4">
                <span className="text-gray-400">Premium Payment Term</span>
                <span className="font-semibold text-white">{plan.eligibility.premiumPaymentTerm}</span>
              </li>
              <li className="flex flex-col gap-1 text-sm">
                <span className="text-gray-400">Policy Term</span>
                <span className="font-semibold text-white">{plan.eligibility.policyTerm}</span>
              </li>
            </ul>
          </div>

          {/* Downloads Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700/50 pb-4">Downloads & Resources</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-500 transition-all text-left">
                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">Product Brochure</p>
                  <p className="text-xs text-gray-500">PDF, 2.4 MB</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-500 transition-all text-left">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">Policy Wording</p>
                  <p className="text-xs text-gray-500">PDF, 1.1 MB</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 italic text-center">
              * Documents are for illustrative purposes only.
            </p>
          </div>

        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 transform translate-y-0 transition-transform duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="hidden sm:block">
            <h4 className="text-lg font-bold text-white">{plan.name}</h4>
            <p className="text-sm text-gray-400">Premium {plan.premium}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Request Quote
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              Calculate Premium
            </button>
          </div>
        </div>
      </div>

      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planInterest={plan.name}
      />
    </div>
  );
}
