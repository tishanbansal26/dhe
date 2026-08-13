import React from 'react';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';

export default function CategoryHero({ data }) {
  if (!data) return null;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-navy-900 -z-20"></div>
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-teal-900/20 blur-[120px] rounded-full -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-900/20 blur-[100px] rounded-full -z-10 -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-sm font-semibold tracking-wide uppercase mb-6">
            <ShieldCheck className="w-4 h-4" /> {data.subtitle || 'Insurance Protection'}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            {data.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
            {data.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById('explore-plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center justify-center gap-2"
            >
              Explore Plans <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => document.getElementById('quote-journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Get a Quote <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
