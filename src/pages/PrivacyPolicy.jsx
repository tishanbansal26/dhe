import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - Radhe Investments';
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert prose-teal max-w-none bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50">
          <p>
            At Radhe Investments, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          
          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information that you provide to us, such as your name, contact information, financial details, and health information (when applying for specific insurance plans).
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use the information we collect to provide and improve our services, process transactions, send administrative information, and respond to customer service requests.
          </p>

          <h3>3. Data Security</h3>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
          
          <h3>4. Contact Us</h3>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@radheinvest.com
            <br />
            Phone: 1800-123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
