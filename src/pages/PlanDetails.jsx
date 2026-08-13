import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, ChevronDown, ChevronUp, FileText, Info, Shield, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LeadCaptureModal from '../components/LeadCaptureModal';
import SEO from '../components/SEO';
import { generateBreadcrumbSchema } from '../lib/schema';

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPlan();
  }, [id]);

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
        setPlan(data);
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-teal-400">Loading Product...</div>;
  }

  if (!plan) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">Product not found.</div>;
  }

  const coverage = plan.coverage || {};
  const eligibility = plan.eligibility || {};
  const benefits = plan.benefits || [];
  const exclusions = plan.exclusions || [];
  const waitingPeriods = plan.waiting_periods || [];
  const faqs = plan.faqs || [];
  const providerName = plan.insurance_companies?.name || 'Insurer';

  return (
    <>
      <SEO 
        title={`${plan.name} by ${providerName} - Get Quote`}
        description={plan.description || `Explore ${plan.name} by ${providerName}. Best coverage, easy claim settlement.`}
        canonicalUrl={`https://radheinv.site/plan/${plan.id}`}
        type="product"
      >
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Insurance Plans", url: "https://radheinv.site/#products" },
            { name: plan.category, url: `https://radheinv.site/category/${plan.category.toLowerCase()}` },
            { name: plan.name, url: `https://radheinv.site/plan/${plan.id}` }
          ]))}
        </script>
      </SEO>

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* Hero Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 mb-12 border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-semibold">
                  {plan.category}
                </span>
                <span className="text-gray-400 text-sm">{providerName}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {plan.name}
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-3xl">
                {plan.description || "A comprehensive insurance policy designed to protect what matters most."}
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setIsModalOpen(true)} className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center gap-2">
                  Get a Quote <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </div>
            
            {/* Quick Summary Card */}
            <div className="w-full md:w-80 bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Key Parameters</h3>
              <ul className="space-y-4">
                {eligibility.minAgeAdult && (
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                    <div><p className="text-sm font-medium text-white">Entry Age</p><p className="text-xs text-gray-400">{eligibility.minAgeAdult} to {eligibility.maxAge || 'Lifelong'}</p></div>
                  </li>
                )}
                {coverage.roomRent && (
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-teal-400 shrink-0" />
                    <div><p className="text-sm font-medium text-white">Room Rent</p><p className="text-xs text-gray-400">{coverage.roomRent?.value || coverage.roomRent}</p></div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Coverage Limits Table */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-teal-400" /> Coverage Highlights
              </h2>
              <div className="glass-panel border border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-700/50">
                    {Object.entries(coverage).map(([key, item]) => {
                      if (!item || (typeof item === 'object' && !item.value)) return null;
                      const val = typeof item === 'object' ? item.value : item;
                      // formatting camelCase to title Case
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <tr key={key} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-300 w-1/3">{label}</td>
                          <td className="px-6 py-4 text-white">{val}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Waiting Periods */}
            {waitingPeriods.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Info className="w-6 h-6 text-amber-400" /> Waiting Periods
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {waitingPeriods.map((wp, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                      <h4 className="font-bold text-amber-400 mb-1">{wp.duration || wp.duration?.value}</h4>
                      <p className="text-gray-300 text-sm">{wp.name || wp.name?.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Exclusions */}
            {exclusions.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400" /> What's Not Covered
                </h2>
                <ul className="space-y-3">
                  {exclusions.map((ex, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                      <p className="text-gray-300">{ex.name || ex}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="glass-panel border border-slate-700 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      >
                        <span className="font-semibold text-white">{faq.question}</span>
                        {openFaq === index ? <ChevronUp className="w-5 h-5 text-teal-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      {openFaq === index && (
                        <div className="px-6 py-4 text-gray-300 bg-slate-900/50 border-t border-slate-700">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="glass-panel border border-slate-700 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Official Documents</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-teal-500/30 group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-teal-400" />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">Product Brochure</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-500 group-hover:text-teal-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-teal-500/30 group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-teal-400" />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">Policy Wording</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-500 group-hover:text-teal-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Subject to insurer's official terms & conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planInterest={plan.name}
      />
    </>
  );
}
