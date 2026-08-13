import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../lib/schema';

export default function CalculatorLayout({
  title,
  description,
  canonicalPath,
  breadcrumbName,
  heroTitle,
  heroSubtitle,
  children,
  howItWorks,
  faqData = []
}) {
  const navigate = useNavigate();
  const canonicalUrl = `https://www.radheinv.site${canonicalPath}`;
  
  const [openFaq, setOpenFaq] = React.useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Home", url: "https://www.radheinv.site" },
            { name: "Calculators", url: "https://www.radheinv.site/calculators" },
            { name: breadcrumbName, url: canonicalUrl }
          ]))}
        </script>
        {faqData.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(generateFAQSchema(faqData))}
          </script>
        )}
      </Helmet>

      <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
        <button 
          onClick={() => navigate('/calculators')} 
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Calculators
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{heroTitle}</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">{heroSubtitle}</p>
        </div>

        {/* Calculator Main Content (Form & Results) */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient effect inside card */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>
          {children}
        </div>

        {/* How It Works Section */}
        {howItWorks && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How This Calculator Works</h2>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8 text-gray-300 space-y-4">
              {howItWorks}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {faqData.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqData.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-semibold text-white">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? 'pb-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
