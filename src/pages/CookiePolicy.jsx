import React from 'react';
import { Cookie } from 'lucide-react';
import SEO from '../components/SEO';

export default function CookiePolicy() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO 
        title="Cookie Policy" 
        description="Radhe Investments cookie policy. Learn how we use cookies to improve your browsing experience on our insurance portal." 
        canonicalUrl="https://www.radheinv.site/cookies" 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert prose-teal max-w-none bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50">
          <p>
            This Cookie Policy explains how Radhe Investments uses cookies and similar technologies to recognize you when you visit our website.
          </p>
          
          <h3>1. What are cookies?</h3>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h3>2. Why do we use cookies?</h3>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
          </p>

          <h3>3. How can I control cookies?</h3>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. You can set or amend your web browser controls to accept or refuse cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
