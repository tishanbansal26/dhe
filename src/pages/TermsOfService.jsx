import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service - Radhe Investments';
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert prose-teal max-w-none bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50">
          <p>
            These Terms of Service constitute a legally binding agreement made between you and Radhe Investments concerning your access to and use of our website and services.
          </p>
          
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing our website, you agree to be bound by these Terms of Service. If you do not agree with all of these terms, you are expressly prohibited from using the site and must discontinue use immediately.
          </p>

          <h3>2. Our Services</h3>
          <p>
            The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation.
          </p>

          <h3>3. User Representations</h3>
          <p>
            By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete.
          </p>
          
          <h3>4. Modifications</h3>
          <p>
            We reserve the right to modify these terms at any time. We will alert you about any changes by updating the "Last updated" date of these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
