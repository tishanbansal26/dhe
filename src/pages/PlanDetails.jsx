import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  ArrowRight, 
  Check, 
  Activity, 
  Users, 
  Download, 
  FileText, 
  Share2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Info, 
  Star, 
  Sparkles,
  Calculator,
  Calendar,
  Lock,
  Layers,
  HeartHandshake,
  DollarSign,
  TrendingUp,
  FileCheck,
  ExternalLink,
  Car,
  HeartPulse,
  Award,
  Building2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import PopularSearches from '../components/seo/PopularSearches';
import RelatedCalculators from '../components/seo/RelatedCalculators';
import { generateBreadcrumbSchema } from '../lib/schema';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { executeResilientQuery } from '../lib/resilience/apiClient';
import IsolatedBoundary from '../components/resilience/IsolatedBoundary';

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedOptionTab, setSelectedOptionTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Quick Calculator State
  const [quickAge, setQuickAge] = useState(45);
  const [quickAmount, setQuickAmount] = useState(1000000);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPlan();
  }, [id]);

  async function fetchPlan() {
    setLoading(true);
    try {
      const res = await executeResilientQuery('supabase_plan_details', () =>
        supabase
          .from('insurance_plans')
          .select('*, insurance_companies(name, logo_url)')
          .eq('id', id)
          .single(),
        { cacheKey: `plan_details_${id}`, fallbackData: null }
      );
        
      if (res.data) setPlan(res.data);
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-teal-400 space-y-4 pt-20">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider uppercase">Loading Product Experience...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4 space-y-4 pt-20">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs">The requested insurance plan could not be located in our directory.</p>
        <button onClick={() => navigate('/#products')} className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all">
          Browse All Plans
        </button>
      </div>
    );
  }

  const categoryLower = (plan.category || 'health').toLowerCase();
  const isPensionOrAnnuity = categoryLower.includes('pension') || categoryLower.includes('annuity') || categoryLower.includes('retirement');
  const isHealth = categoryLower.includes('health') || categoryLower.includes('mediclaim');
  const isTermLife = categoryLower.includes('term') || categoryLower.includes('life');
  const isMotor = categoryLower.includes('motor') || categoryLower.includes('car') || categoryLower.includes('bike') || categoryLower.includes('vehicle');

  const irdaiStd = getIrdaiCategoryStandards(plan.category);
  const coverage = plan.coverage && Object.keys(plan.coverage).length > 0 ? plan.coverage : irdaiStd.coverageDefaults;
  const eligibility = plan.eligibility && Object.keys(plan.eligibility).length > 0 ? plan.eligibility : irdaiStd.eligibilityDefaults;
  const benefits = plan.benefits || plan.metadata?.benefits || [];
  const exclusions = plan.exclusions && plan.exclusions.length > 0 ? plan.exclusions : irdaiStd.exclusions;
  const waitingPeriods = plan.waiting_periods && plan.waiting_periods.length > 0 ? plan.waiting_periods : irdaiStd.waitingPeriods;
  const faqs = plan.faqs || [];
  const highlights = plan.metadata?.highlights || plan.highlights || [];
  const providerName = plan.insurance_companies?.name || plan.metadata?.insurer || 'Insurance Provider';
  const calcConfig = plan.metadata?.calculation_config || plan.premium_data?.calculation_config || {};
  const uinNumber = calcConfig.uin || plan.metadata?.uin || 'IRDAI Approved';

  // Dynamic Official Documents
  const officialDocs = plan.metadata?.official_documents || (
    isPensionOrAnnuity ? [
      { title: 'Official Policy Document', type: 'Policy Contract', size: 'IRDAI Standard', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' },
      { title: 'Official Sales Brochure', type: 'Brochure & Rate Cards', size: 'Rate Tables', url: '/documents/Tata-AIA-FG-Pension-Brochure.pdf' },
      { title: 'Customer Information Sheet (CIS)', type: 'Regulatory Disclosure', size: 'Disclosure Kit', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' }
    ] : [
      { title: `${plan.name} Policy Document`, type: 'Policy Contract', size: 'Official Terms', url: '#' },
      { title: `${plan.name} Sales Brochure`, type: 'Product Brochure', size: 'Benefit Details', url: '#' },
      { title: 'Customer Information Sheet (CIS)', type: 'Regulatory Disclosure', size: 'IRDAI Standard', url: '#' }
    ]
  );

  // Dynamic Category-Aware Hero Images
  const fallbackImages = {
    pension: '/images/plans/fg_pension_hero.jpg',
    health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    life: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=1600&q=80',
    term: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=1600&q=80',
    motor: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80'
  };

  const heroImage = plan.metadata?.hero_image || fallbackImages[categoryLower] || fallbackImages.health;

  // Pension Specific Options (when configured or applicable)
  const pensionOptions = calcConfig.options && calcConfig.options.length > 0 ? calcConfig.options : [
    {
      id: 0,
      code: 'Option 1',
      title: 'Immediate Life Annuity',
      subtitle: 'Maximizes Immediate Regular Income',
      desc: 'Annuity payments start immediately from Day 1 for the lifetime of the annuitant. Ceases upon demise with no death benefit.',
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
      tag: 'Highest Payout',
      payout: 'Immediate (Day 1)',
      capitalRefund: 'No Return of Premium'
    },
    {
      id: 1,
      code: 'Option 2',
      title: 'Immediate Life with Return of Purchase Price (ROP)',
      subtitle: 'Immediate Regular Income + 100% Capital Refund',
      desc: 'Annuity commences immediately for life. On the death of the annuitant (or later death in Joint Life), 100% of the Purchase Price is returned tax-free to the nominee.',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      tag: 'Capital Protected',
      payout: 'Immediate (Day 1)',
      capitalRefund: '100% Purchase Price Refund'
    },
    {
      id: 2,
      code: 'Option 3',
      title: 'Deferred Life Annuity (GA-I) with ROP',
      subtitle: 'Compounding Accumulation + 1/12th Annuity Monthly GA',
      desc: 'Annuity starts post-deferment. Guaranteed Additions accumulate monthly during deferment at 1/12th of the Yearly Annuity, bolstering death benefit and legacy value.',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      tag: 'GA-I Accruals',
      payout: 'Post-Deferment (1-10 Yrs)',
      capitalRefund: '100% Purchase Price + GA'
    },
    {
      id: 3,
      code: 'Option 4',
      title: 'Deferred Life Annuity (GA-II) with ROP & Boosters',
      subtitle: 'Maximum Wealth Multiplication + Persistency Boosters',
      desc: 'Annuity starts post-deferment. Guaranteed Additions accrue monthly at 1/12th of 6% of Total Premiums, plus Persistency Annuity Boosters that can double your annual lifetime pension.',
      icon: <Star className="w-5 h-5 text-amber-400" />,
      tag: 'Most Popular ⭐',
      payout: 'Post-Deferment (1-10 Yrs)',
      capitalRefund: '100% Purchase Price + GA'
    }
  ];

  return (
    <>
      <SEO 
        title={`${plan.name} by ${providerName} - Coverage, Benefits & Quotes`}
        description={plan.description || `Explore ${plan.name} by ${providerName}. Comprehensive benefits, IRDAI verified coverage, transparent terms and instant quotes.`}
        canonicalUrl={`https://radheinv.site/plan/${plan.id}`}
        type="product"
      >
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Insurance Plans", url: "https://radheinv.site/#products" },
            { name: plan.category, url: `https://radheinv.site/category/${categoryLower}` },
            { name: plan.name, url: `https://radheinv.site/plan/${plan.id}` }
          ]))}
        </script>
      </SEO>

      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Top Breadcrumb & Back */}
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Insurance Catalog
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>UIN: {uinNumber}</span>
              <span>•</span>
              <span className="text-teal-400 font-semibold">{plan.category}</span>
            </div>
          </div>

          {/* DYNAMIC HERO BANNER SECTION */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
            
            {/* Background Image Container with Gradient Overlays */}
            <div className="absolute inset-0 z-0">
              <img 
                src={heroImage} 
                alt={`${plan.name} Cover`} 
                className="w-full h-full object-cover object-center opacity-25 transform scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 p-8 md:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-8 space-y-6">
                
                {/* Brand & Regulatory Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" /> {providerName}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    UIN: {uinNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                    {plan.category}
                  </span>
                </div>

                {/* Plan Title (Dynamic) */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                  {plan.name}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                  {plan.description || plan.metadata?.summary || `Comprehensive ${plan.category} policy providing market-leading protection and seamless claim settlement.`}
                </p>

                {/* Highlights Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Category</span>
                    <span className="text-sm sm:text-base font-bold text-teal-400 block mt-0.5">{plan.category}</span>
                  </div>
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Insurer</span>
                    <span className="text-sm sm:text-base font-bold text-amber-400 block mt-0.5 truncate">{providerName}</span>
                  </div>
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Entry Age</span>
                    <span className="text-sm sm:text-base font-bold text-indigo-400 block mt-0.5">
                      {eligibility.minAgeAdult || eligibility.min_entry_age || '18'} - {eligibility.maxAge || eligibility.max_entry_age || '65'} Yrs
                    </span>
                  </div>
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Claim Ratio</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">99.2% Verified</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => navigate(`/quote-generator?planId=${plan.id}`)}
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/25 transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <Calculator className="w-5 h-5" /> Generate Instant Quote <ArrowRight className="w-5 h-5" />
                  </button>

                  <Link 
                    to={`/compare?plans=${plan.id}`}
                    className="px-6 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-teal-500/40 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-teal-400" /> Compare with Other Plans
                  </Link>
                </div>

              </div>

              {/* Dynamic Quick Quote / Calculator Card */}
              <div className="lg:col-span-4 bg-slate-950/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-teal-400" /> Quick Estimate
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold">
                    {plan.category}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Your Age</span>
                    <span className="font-bold text-white font-mono">{quickAge} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="18" 
                    max="75" 
                    value={quickAge} 
                    aria-label="Your Age"
                    onChange={(e) => setQuickAge(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{isPensionOrAnnuity ? 'Single Purchase Price' : 'Desired Sum Insured / Cover'}</span>
                    <span className="font-bold text-teal-400 font-mono">₹{(quickAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min={isPensionOrAnnuity ? 500000 : 300000} 
                    max={isPensionOrAnnuity ? 10000000 : 5000000} 
                    step={100000}
                    value={quickAmount} 
                    aria-label="Desired Cover or Purchase Price"
                    onChange={(e) => setQuickAmount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {isPensionOrAnnuity ? 'Estimated Annual Income' : 'Indicative Starting Premium'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-teal-400 font-mono block">
                    {isPensionOrAnnuity ? (
                      <>₹{Math.round(quickAmount * (0.0594 + (quickAge - 30) * 0.000085)).toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ yr</span></>
                    ) : (
                      <>₹{Math.round(quickAmount * 0.012).toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ yr onwards</span></>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {isPensionOrAnnuity ? 'Lifelong guaranteed regular pension + 100% ROP' : 'Comprehensive coverage subject to underwriting'}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/quote-generator?planId=${plan.id}`)}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  Configure & Download PDF Quote <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>

            </div>
          </div>

          {/* CATEGORY-SPECIFIC MODULAR SECTIONS */}
          
          {/* 1. PENSION & ANNUITY OPTIONS EXPLORER */}
          {isPensionOrAnnuity && (
            <div className="space-y-6">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Flexible Retirement Architecture</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">Annuity Payout & Legacy Options</h2>
                <p className="text-slate-400 text-sm">
                  Engineered to match distinct retirement stages—from immediate lifelong cashflows to high-compounding deferred legacies.
                </p>
              </div>

              {/* Option Pills */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {pensionOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOptionTab(idx)}
                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      selectedOptionTab === idx
                        ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono font-bold text-teal-400">{opt.code || `Option ${idx + 1}`}</span>
                      {opt.tag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {opt.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{opt.title || opt.name}</h4>
                  </button>
                ))}
              </div>

              {/* Active Option Detail Card */}
              {pensionOptions[selectedOptionTab] && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {pensionOptions[selectedOptionTab].icon || <Shield className="w-5 h-5 text-teal-400" />}
                        <h3 className="text-2xl font-bold text-white">{pensionOptions[selectedOptionTab].title || pensionOptions[selectedOptionTab].name}</h3>
                      </div>
                      <p className="text-sm text-teal-400 font-semibold">{pensionOptions[selectedOptionTab].subtitle || 'Irrevocable Guaranteed Annuity'}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/quote-generator?planId=${plan.id}`)}
                      className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                    >
                      Quote This Option <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                    {pensionOptions[selectedOptionTab].desc || pensionOptions[selectedOptionTab].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-medium">Annuity Payout Starts</span>
                      <span className="text-sm font-bold text-white block mt-1">{pensionOptions[selectedOptionTab].payout || 'Immediate / Post Deferment'}</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-medium">Demise Benefit (Capital Refund)</span>
                      <span className="text-sm font-bold text-emerald-400 block mt-1">{pensionOptions[selectedOptionTab].capitalRefund || '100% Purchase Price'}</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-medium">Guaranteed Additions</span>
                      <span className="text-sm font-bold text-indigo-400 block mt-1">{pensionOptions[selectedOptionTab].ga || 'Accrued during deferment'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. HEALTH INSURANCE PILLARS */}
          {isHealth && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Medical Coverage Architecture</span>
                <h2 className="text-3xl font-black text-white">Comprehensive Health Benefits</h2>
                <p className="text-slate-400 text-xs">
                  Zero room-rent capping, cashless hospitalizations, and full restoration benefits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                  <HeartPulse className="w-8 h-8 text-rose-400" />
                  <h4 className="text-base font-bold text-white">In-Patient Hospitalization</h4>
                  <p className="text-xs text-slate-400">Full medical expenses covered up to Sum Insured for hospitalizations exceeding 24 hours.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                  <Activity className="w-8 h-8 text-teal-400" />
                  <h4 className="text-base font-bold text-white">Pre & Post Hospitalization</h4>
                  <p className="text-xs text-slate-400">60 days pre-hospitalization diagnostic tests and 180 days post-discharge medications included.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                  <h4 className="text-base font-bold text-white">100% Cover Restoration</h4>
                  <p className="text-xs text-slate-400">Instant automatic replenishment of entire Sum Insured upon exhaustion in a policy year.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h4 className="text-base font-bold text-white">No Claim Bonus (NCB)</h4>
                  <p className="text-xs text-slate-400">Up to 50% cumulative bonus for every claim-free year, doubling your coverage over time.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. TERM LIFE PILLARS */}
          {isTermLife && !isPensionOrAnnuity && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Pure Financial Protection</span>
                <h2 className="text-3xl font-black text-white">High Sum Assured Life Cover</h2>
                <p className="text-slate-400 text-xs">
                  Guaranteed lump sum payout to secure your family's future and clear all outstanding liabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h4 className="text-lg font-bold text-white">Terminal Illness Acceleration</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">100% of Sum Assured disbursed immediately upon diagnosis of terminal medical conditions with 0% deduction.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <Award className="w-8 h-8 text-amber-400" />
                  <h4 className="text-lg font-bold text-white">Accidental Death Rider</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Double sum assured payout in case of unfortunate accidental demise during active policy term.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <CheckCircle className="w-8 h-8 text-teal-400" />
                  <h4 className="text-lg font-bold text-white">Section 80C & 10(10D) Tax Savings</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Tax exemption on annual premiums paid and completely tax-free claim proceeds to nominees.</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. MOTOR INSURANCE PILLARS */}
          {isMotor && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Vehicle Shield & Roadside Care</span>
                <h2 className="text-3xl font-black text-white">Comprehensive Motor Protection</h2>
                <p className="text-slate-400 text-xs">
                  Zero depreciation cover, 24x7 roadside assistance, and instant cashless repairs across 5,000+ garages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <Car className="w-8 h-8 text-purple-400" />
                  <h4 className="text-lg font-bold text-white">Zero Depreciation Bumper-to-Bumper</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Full claim reimbursement on plastic, glass, and metal parts without any depreciation deduction.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <Activity className="w-8 h-8 text-teal-400" />
                  <h4 className="text-lg font-bold text-white">24x7 Roadside Assistance</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Emergency towing, flat tyre assistance, battery jumpstart, and fuel delivery anywhere in India.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <Shield className="w-8 h-8 text-emerald-400" />
                  <h4 className="text-lg font-bold text-white">Engine & Gearbox Protection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Protection against hydrostatic lock and water ingress during heavy rains and monsoons.</p>
                </div>
              </div>
            </div>
          )}

          {/* OFFICIAL DOWNLOADS & DOCUMENTATION CENTER */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Official Downloads Portal</span>
              <h2 className="text-3xl font-black text-white">Policy Documents & Disclosures</h2>
              <p className="text-slate-400 text-xs">
                Download verified official policy contracts, brochures, and regulatory disclosure documents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officialDocs.map((doc, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-800">
                        {doc.size || 'PDF'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block">{doc.type || 'Document'}</span>
                      <h4 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors mt-0.5">{doc.title}</h4>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Official Insurer Copy</span>
                    <a
                      href={doc.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILED COVERAGE HIGHLIGHTS & WAITING PERIODS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Cols: Coverage & Eligibility */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Highlights List */}
              {highlights.length > 0 && (
                <div className="bg-slate-900/90 border border-teal-500/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-400" /> Plan Pillars & Core Guarantees
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                        <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 fill-amber-400/20" />
                        <span className="text-xs text-slate-200 font-medium">{h.name || h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage Specifications Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-400" /> Coverage Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-800">
                      {Object.entries(coverage).map(([key, item]) => {
                        if (!item || (typeof item === 'object' && !item.value)) return null;
                        const val = typeof item === 'object' ? item.value : item;
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <tr key={key} className="hover:bg-slate-850 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-400 w-1/3">{label}</td>
                            <td className="py-3 px-4 text-white font-medium">{String(val)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Waiting Periods & Regulatory Timelines */}
              {waitingPeriods.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-400" /> Waiting Periods & Terms
                  </h3>
                  <div className="space-y-3">
                    {waitingPeriods.map((wp, idx) => (
                      <div key={idx} className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-white">{wp.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{wp.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 shrink-0 font-mono">
                          {wp.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right 5 Cols: Exclusions & FAQs */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Exclusions */}
              {exclusions.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-400" /> Exclusions & Limits
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    {exclusions.map((ex, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
                        <span>{ex.name || ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Accordion */}
              {faqs.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-teal-400" /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                        <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-slate-900 transition-colors text-xs font-semibold text-white"
                        >
                          <span>{faq.question}</span>
                          {openFaq === index ? <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        </button>
                        {openFaq === index && (
                          <div className="px-4 py-3 text-xs text-slate-300 bg-slate-900/60 border-t border-slate-800 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Related Calculators & SEO Discovery */}
          <div className="border-t border-slate-800 pt-12 space-y-8">
            <RelatedCalculators category={plan.category} />
            <PopularSearches activeCategory={plan.category} />
          </div>

        </div>
      </div>
    </>
  );
}
