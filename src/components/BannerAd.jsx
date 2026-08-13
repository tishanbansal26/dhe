import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const defaultBanners = [
  {
    id: 1,
    badge: "Funds rated 4 or 5 Stars",
    headline: "17.65% 5-year Tax-free returns",
    tags: ["Wealth Creation + Life cover", "Free fund switches"],
    ctaText: "Know more",
    ctaLink: "#",
    disclaimer: "*5 year returns based on historical data. Past performance is not indicative of future results. T&C apply.",
    bgGradient: "from-slate-800 to-slate-900",
    // We'll use a subtle abstract background pattern instead of a direct image to ensure text readability
    patternOpacity: 0.4,
  },
  {
    id: 2,
    badge: "Limited Time Offer",
    headline: "Get 10% off your first premium",
    tags: ["Health Insurance", "Family Floater"],
    ctaText: "Get Quote",
    ctaLink: "#",
    disclaimer: "*Offer valid for new customers only until end of month.",
    bgGradient: "from-teal-900 to-slate-900",
    patternOpacity: 0.2,
  }
];

export default function BannerAd({ banners = defaultBanners }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8 group">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${current.bgGradient} border border-slate-700/50 shadow-2xl transition-all duration-700`}>
        
        {/* Abstract Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700" 
          style={{ opacity: current.patternOpacity, backgroundImage: 'radial-gradient(circle at 100% 0%, #14b8a6 0%, transparent 40%), radial-gradient(circle at 0% 100%, #3b82f6 0%, transparent 40%)' }}
        ></div>

        <div className="relative z-10 px-6 py-10 md:px-12 md:py-16 flex flex-col justify-center min-h-[280px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1 max-w-3xl">
              <p className="text-gray-300 font-medium text-sm md:text-base mb-2 tracking-wide uppercase">
                {current.badge}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {current.headline}
              </h2>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {current.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-1.5 rounded-full border border-slate-600 bg-slate-800/50 text-gray-300 text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <a href={current.ctaLink} className="bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-colors shadow-lg flex items-center gap-2">
                  {current.ctaText} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Optional graphic placeholder on the right side */}
            <div className="hidden lg:block w-1/3 relative h-full min-h-[200px]">
               {/* This is where an image could go. For now, a CSS graphic */}
               <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-2xl transform rotate-3 scale-105 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white/50 font-bold text-xl tracking-widest uppercase">Special Offer</div>
               </div>
            </div>
          </div>

          {current.disclaimer && (
            <p className="text-xs text-gray-500 mt-8 max-w-4xl">
              {current.disclaimer}
            </p>
          )}
        </div>

        {/* Carousel Controls */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-teal-400' : 'bg-gray-500/50 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
