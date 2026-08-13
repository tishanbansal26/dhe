import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck, Filter, Star, Scale, HeartPulse, Shield, Car, TrendingUp, Package, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { generateBreadcrumbSchema } from '../lib/schema';

const categoryMeta = {
  health: {
    name: 'Health Insurance',
    icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
    color: 'from-rose-500/20 to-orange-500/10',
    borderColor: 'border-rose-500/30'
  },
  life: {
    name: 'Term Life',
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30'
  },
  investment: {
    name: 'Investment & Retirement',
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30'
  },
  motor: {
    name: 'Motor Insurance',
    icon: <Car className="w-8 h-8 text-purple-400" />,
    color: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30'
  }
};

export default function CategoryList() {
  const { type } = useParams();
  
  useEffect(() => {
    document.title = `Compare ${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Insurance Plans - Radhe Investments`;
  }, [type]);

  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchPlans() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('insurance_plans')
          .select('*, insurance_companies(name)');
        
        if (error) throw error;
        
        const formattedPlans = data.map(plan => {
          const meta = typeof plan.metadata === 'string' ? JSON.parse(plan.metadata) : (plan.metadata || {});
          return {
            id: plan.id,
            name: plan.name,
            provider: plan.insurance_companies?.name,
            premium: meta.premium || '',
            summary: meta.summary || '',
            benefits: meta.benefits || [],
            tag: meta.tag || '',
            color: meta.color || '',
            borderColor: meta.borderColor || '',
            iconName: meta.iconName || 'Shield',
            iconColor: meta.iconColor || 'text-white',
            categoryId: plan.category || meta.categoryId || plan.metadata?.categoryId,
            csr: meta.csr,
            networkHospitals: meta.networkHospitals
          };
        });
        setPlans(formattedPlans);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [type]);

  const category = {
    id: type,
    ...(categoryMeta[type] || {
      name: type ? type.charAt(0).toUpperCase() + type.slice(1) : '',
      icon: <Shield className="w-8 h-8 text-gray-400" />,
      color: 'from-gray-500/20 to-gray-500/10',
      borderColor: 'border-gray-500/30'
    })
  };

  let categoryPlans = plans.filter(p => p.categoryId === type);
  
  if (selectedProvider !== 'All') {
    categoryPlans = categoryPlans.filter(p => p.provider === selectedProvider);
  }

  const providers = ['All', ...new Set(plans.filter(p => p.categoryId === type).map(p => p.provider).filter(Boolean))];

  const toggleCompare = (e, id) => {
    e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(pId => pId !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      } else {
        toast.error('You can compare up to 3 plans at a time.');
      }
    }
  };

  const handleCompare = () => {
    navigate(`/compare?plans=${compareList.join(',')}`);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <button onClick={() => navigate('/')} className="text-teal-400 hover:text-teal-300 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${meta.name} in Mansa, Punjab`}
        description={`Explore the best ${meta.name} plans at Radhe Investments. Serving Mansa, Punjab with expert financial guidance.`}
        canonicalUrl={`https://www.radheinv.site/category/${type}`}
      >
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Home", url: "https://www.radheinv.site" },
            { name: "Categories", url: "https://www.radheinv.site/#products" },
            { name: meta.name, url: `https://www.radheinv.site/category/${type}` }
          ]))}
        </script>
      </SEO>
      <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')} 
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </button>
        
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-slate-800 border ${category.borderColor} flex items-center justify-center`}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-400 mt-2">Compare {categoryPlans.length} plans from top insurers</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 h-[400px] animate-pulse">
              <div className="h-6 bg-slate-700/50 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-5 bg-slate-700/50 rounded w-full"></div>)}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 animate-pulse">
                <div className="w-full md:w-48 h-48 bg-slate-700/50 rounded-2xl"></div>
                <div className="flex-1 space-y-4 py-4">
                  <div className="h-8 bg-slate-700/50 rounded w-3/4"></div>
                  <div className="flex gap-3"><div className="h-6 w-24 bg-slate-700/50 rounded"></div></div>
                  <div className="h-16 bg-slate-700/50 rounded w-full"></div>
                </div>
                <div className="w-full md:w-64 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-6">
                  <div className="h-4 bg-slate-700/50 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-slate-700/50 rounded w-32 mb-6"></div>
                  <div className="h-12 bg-slate-700/50 rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-teal-400" /> Filters
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Insurer</h4>
              <div className="space-y-3">
                {providers.map(provider => (
                  <label key={provider} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedProvider === provider ? 'bg-teal-500 border-teal-500' : 'bg-slate-900 border-slate-600 group-hover:border-teal-500'}`}>
                      {selectedProvider === provider && <CheckCircle className="w-3 h-3 text-slate-900" />}
                    </div>
                    <span className={`text-sm ${selectedProvider === provider ? 'text-white font-medium' : 'text-gray-300'}`}>{provider}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {categoryPlans.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <Icons.Package className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No plans found in this category</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            categoryPlans.map((plan) => {
              const IconComponent = Icons[plan.iconName] || Icons.Shield;
            const isSelectedForCompare = compareList.includes(plan.id);
            
            return (
            <div 
              key={plan.id}
              onClick={() => navigate(`/plan/${plan.id}`)}
              className={`group cursor-pointer bg-slate-800/40 border ${isSelectedForCompare ? 'border-teal-500' : 'border-slate-700/50 hover:border-slate-500'} rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => toggleCompare(e, plan.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isSelectedForCompare ? 'bg-teal-500 text-slate-900 border-teal-500' : 'bg-slate-900 text-gray-400 border-slate-600 hover:border-teal-400 hover:text-teal-400'}`}
                >
                  <Scale className="w-3 h-3" />
                  {isSelectedForCompare ? 'Selected' : 'Compare'}
                </button>
              </div>

              <div className="w-full md:w-48 flex-shrink-0 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 relative mt-8 md:mt-0">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <IconComponent className={`w-8 h-8 ${plan.iconColor}`} />
                </div>
                <span className="font-bold text-white text-center">{plan.provider}</span>
                <span className="text-xs text-gray-500 mt-1">{plan.tag}</span>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {plan.csr && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> CSR {plan.csr}
                    </span>
                  )}
                  {plan.networkHospitals && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/20">
                      <Star className="w-3.5 h-3.5" /> {plan.networkHospitals} Network
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-4">{plan.summary}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
                  {plan.benefits.slice(0,4).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-6 text-center md:text-right">
                <span className="text-sm text-gray-400 mb-1">Premium from</span>
                <span className="text-3xl font-bold text-white mb-6">{plan.premium}</span>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/plan/${plan.id}`);
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                >
                  View Details
                </button>
              </div>
            </div>
            );
          })
          )}
        </div>
      </div>
      )}

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 transform translate-y-0 transition-transform">
          <div className="max-w-3xl mx-auto bg-slate-800/90 backdrop-blur-md border border-slate-600 rounded-2xl shadow-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-teal-500/20 text-teal-400 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {compareList.length}
              </div>
              <div>
                <h4 className="text-white font-bold">Plans Selected</h4>
                <p className="text-sm text-gray-400">Select up to 3 plans to compare</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCompareList([])}
                className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Clear
              </button>
              <button 
                onClick={handleCompare}
                className="bg-teal-500 text-slate-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-400 transition-colors"
              >
                <Scale className="w-5 h-5" /> Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
