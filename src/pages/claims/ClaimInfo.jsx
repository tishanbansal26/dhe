import React, { useEffect } from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

export default function ClaimInfo() {
  useEffect(() => {
    document.title = 'Claims Information - Radhe Investments';
  }, []);

  const steps = [
    { title: "Intimate the Insurer", desc: "Inform the insurance company about the incident as soon as possible, usually within 24-48 hours." },
    { title: "Keep Documents Ready", desc: "Gather all necessary documents such as FIR (for accidents/theft), medical bills, and discharge summaries." },
    { title: "Submit Claim Form", desc: "Fill out the official claim form completely and accurately. Attach the gathered documents." },
    { title: "Assessment", desc: "A surveyor or third-party administrator (TPA) will review the documents and assess the claim." },
    { title: "Settlement", desc: "Once approved, the claim amount will be disbursed to the hospital (cashless) or reimbursed to your account." }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Know More About Filing a Claim</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">We make the claims process transparent and hassle-free. Here is what you need to know.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Standard Claim Process</h3>
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-200">{step.title}</h4>
                    <p className="text-gray-400 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Common Documents Required</h3>
            <ul className="space-y-4">
              {['Duly filled and signed claim form', 'Original Policy Document', 'Identity Proof (Aadhaar, PAN)', 'Original hospital bills and discharge summary', 'FIR copy (in case of accidents)', 'Cancelled cheque for NEFT'].map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
