import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Building2, Phone, Star, Loader2, 
  Activity, ShieldCheck, Clock, Users, AlertTriangle, 
  CheckCircle2, ChevronDown, Quote, Stethoscope
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import { executeResilientQuery } from '../../lib/resilience/apiClient';
import IsolatedBoundary from '../../components/resilience/IsolatedBoundary';
import ActionableEmptyState from '../../components/ui/ActionableEmptyState';

export default function CashlessNetwork() {
  const [hospitals, setHospitals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [locationSearch, setLocationSearch] = useState('');
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [treatmentSearch, setTreatmentSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 30;
  
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [testimonialsRes, faqsRes] = await Promise.all([
        supabase.from('network_testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('network_faqs').select('*').order('display_order', { ascending: true })
      ]);
      
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (faqsRes.data) setFaqs(faqsRes.data);
      
      await performSearch(0, true);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (pageNum = 0, isNewSearch = false, overrideLoc = null) => {
    setSearching(true);
    try {
      let query = supabase.from('hospitals').select('*', { count: 'exact' });

      const locToSearch = overrideLoc !== null ? overrideLoc : locationSearch;
      if (locToSearch.trim()) {
        const term = locToSearch.trim();
        // If numeric (e.g., PIN code), search address; otherwise filter strictly by city name in location
        if (/^\d+$/.test(term)) {
          query = query.ilike('address', `%${term}%`);
        } else {
          query = query.ilike('location', `%${term}%`);
        }
      }
      if (hospitalSearch.trim()) {
        query = query.ilike('name', `%${hospitalSearch.trim()}%`);
      }
      if (treatmentSearch.trim()) {
        query = query.ilike('type', `%${treatmentSearch.trim()}%`);
      }

      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      const { data, count, error } = await query
        .order('name', { ascending: true })
        .range(from, to);

      if (error) throw error;

      if (isNewSearch) {
        setHospitals(data || []);
        setPage(0);
      } else {
        setHospitals(prev => [...prev, ...(data || [])]);
        setPage(pageNum);
      }

      setTotalCount(count || 0);
      setHasMore((data || []).length === PAGE_SIZE && (from + (data || []).length) < count);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    performSearch(0, true);
  };

  const handleCityClick = (city) => {
    const nextCity = locationSearch.toLowerCase() === city.toLowerCase() ? '' : city;
    setLocationSearch(nextCity);
    performSearch(0, true, nextCity);
  };

  const loadMore = () => {
    if (!searching && hasMore) {
      performSearch(page + 1, false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-navy-900">
      <SEO 
        title="Cashless Hospital Network — Find Cashless Hospitals Near You" 
        description="Search cashless hospital networks across India for your health insurance plan. Find partner hospitals near Mansa, Bathinda, Chandigarh and all Punjab cities." 
        canonicalUrl="https://www.radheinv.site/claims/cashless" 
        keywords="Cashless Hospitals Mansa, Cashless Hospital Network Punjab, Health Insurance Cashless, Hospital Network India" 
      />
      
      {/* 1. HERO SECTION & STATISTICS */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-emerald-900/20 rounded-[100%] blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your <span className="text-emerald-400">Cashless Network</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Access world-class healthcare without worrying about the bills. Search from our extensive network of trusted hospitals across India.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <Building2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-1">10,000+</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Trusted Providers</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-1">450+</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Cities Covered</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-1">30 Mins</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Cashless Approval</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-1">1.4M+</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ADVANCED TRI-SEARCH MODULE */}
      <section className="py-12 px-4 max-w-6xl mx-auto relative z-20">
        <form onSubmit={handleSearchSubmit} className="bg-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-500/30">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Location */}
            <div className="flex-1 relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="City or PIN (e.g. Mansa, Chandigarh)" 
                  value={locationSearch}
                  onChange={e => setLocationSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
            </div>

            {/* Hospital Name */}
            <div className="flex-1 relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hospital</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Hospital Name (e.g. Fortis, Apollo)" 
                  value={hospitalSearch}
                  onChange={e => setHospitalSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
            </div>

            {/* Treatment */}
            <div className="flex-1 relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Treatment / Speciality</label>
              <div className="relative">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="e.g. Cardiology, Eye Care" 
                  value={treatmentSearch}
                  onChange={e => setTreatmentSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end mt-4 md:mt-0">
              <button 
                type="submit" 
                disabled={searching}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 h-[46px] shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} Find
              </button>
            </div>
          </div>

          {/* Quick City Filters */}
          <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Popular Cities:</span>
            {['Mansa', 'Chandigarh', 'Bathinda', 'Ludhiana', 'Patiala', 'Amritsar', 'Delhi', 'Jaipur', 'Mumbai'].map(city => (
              <button
                key={city}
                type="button"
                onClick={() => handleCityClick(city)}
                className={`text-xs px-3 py-1 rounded-full transition-all border ${locationSearch.toLowerCase() === city.toLowerCase() ? 'bg-emerald-500 text-slate-900 border-emerald-400 font-bold' : 'bg-slate-900/80 text-gray-300 border-slate-700 hover:border-emerald-500/50'}`}
              >
                {city}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 3. HOSPITAL RESULTS GRID */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Network Hospitals <span className="text-emerald-400 text-lg">({totalCount} Found)</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : hospitals.length === 0 ? (
            <div className="col-span-full p-16 text-center text-gray-400 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-3xl">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No hospitals found</h3>
              <p>Try adjusting your search filters to find nearby network hospitals.</p>
            </div>
          ) : (
            hospitals.map((hospital, index) => (
              <div key={hospital.id || index} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 group flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{hospital.name}</h3>
                    {index % 3 === 0 && (
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20 whitespace-nowrap shrink-0">
                        <ShieldCheck className="w-3 h-3" /> Preferred
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-slate-700 text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">{hospital.type || 'Multi-Speciality'}</span>
                    <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {hospital.rating || '4.5'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex items-start gap-3 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" /> 
                      <span className="leading-relaxed">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <Phone className="w-4 h-4 shrink-0 text-slate-500" /> 
                      {hospital.phone}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 bg-slate-900/50 p-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cashless Available
                  </span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-semibold text-sm hover:text-emerald-300"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              disabled={searching}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold px-8 py-3 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Load More Hospitals ({hospitals.length} of {totalCount})
            </button>
          </div>
        )}
      </section>

      {/* 4. UNRECOGNIZED HOSPITALS WARNING */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 md:p-8 flex items-start gap-4 md:gap-6">
          <div className="bg-rose-500/20 p-3 rounded-full shrink-0">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Important Notice: Excluded Hospitals</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              To protect our customers from fraudulent practices, some hospitals have been excluded from our network. Claims for treatments taken at these hospitals will not be processed, except in cases of life-threatening medical emergencies.
            </p>
            <button className="text-rose-400 hover:text-rose-300 font-semibold text-sm underline underline-offset-4">
              View List of Excluded Hospitals
            </button>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-16 px-4 bg-slate-800 border-y border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Real Customers. Real Experiences.</h2>
            <p className="text-gray-400">See how our cashless network has helped families in their time of need.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-900 p-8 rounded-2xl border border-slate-700 relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-800" />
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">"{t.text}"</p>
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDUCATIONAL FAQ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-slate-700 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
