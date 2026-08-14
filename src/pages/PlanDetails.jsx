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
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import PopularSearches from '../components/seo/PopularSearches';
import RelatedCalculators from '../components/seo/RelatedCalculators';
import { generateBreadcrumbSchema } from '../lib/schema';
import { getIrdaiCategoryStandards } from '../lib/irdaiStandards';
import toast from 'react-hot-toast';

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedOptionTab, setSelectedOptionTab] = useState(3); // Default Option 4
  const [loading, setLoading] = useState(true);

  // Quick Calculator State
  const [quickAge, setQuickAge] = useState(55);
  const [quickPremium, setQuickPremium] = useState(2500000);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPlan();
  }, [id]);

  async function fetchPlan() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('*, insurance_companies(name, logo_url)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) setPlan(data);
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-teal-400 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider uppercase">Loading Product Experience...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs">The requested insurance plan could not be located in our directory.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  const irdaiStd = getIrdaiCategoryStandards(plan.category);
  const coverage = plan.coverage && Object.keys(plan.coverage).length > 0 ? plan.coverage : irdaiStd.coverageDefaults;
  const eligibility = plan.eligibility && Object.keys(plan.eligibility).length > 0 ? plan.eligibility : irdaiStd.eligibilityDefaults;
  const benefits = plan.benefits || [];
  const exclusions = plan.exclusions && plan.exclusions.length > 0 ? plan.exclusions : irdaiStd.exclusions;
  const waitingPeriods = plan.waiting_periods && plan.waiting_periods.length > 0 ? plan.waiting_periods : irdaiStd.waitingPeriods;
  const faqs = plan.faqs || [];
  const highlights = plan.metadata?.highlights || plan.highlights || [];
  const providerName = plan.insurance_companies?.name || 'Tata AIA Life';
  const calcConfig = plan.metadata?.calculation_config || plan.premium_data?.calculation_config || {};
  const officialDocs = plan.metadata?.official_documents || [
    { title: 'Official Policy Document (V13)', type: 'Policy Contract', size: '17 Pages', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' },
    { title: 'Official Sales Brochure (V13)', type: 'Brochure & Rate Cards', size: '8 Pages', url: '/documents/Tata-AIA-FG-Pension-Brochure.pdf' },
    { title: 'Customer Information Sheet (CIS)', type: 'Regulatory Disclosure', size: 'IRDAI Standard', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' },
    { title: 'Death Claim Intimation Form (Part I & II)', type: 'Claim Settlement', size: 'Claims Kit', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' },
    { title: 'Annual Existence Certificate Form', type: 'Life Certificate', size: 'Servicing', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' },
    { title: 'Policy Loan & Collateral Form', type: 'Loan Facility', size: 'Servicing', url: '/documents/Tata-AIA-FG-Pension-Policy-Document.pdf' }
  ];

  const heroImage = plan.metadata?.hero_image || '/images/plans/fg_pension_hero.jpg';
  const familyImage = plan.metadata?.family_image || '/images/plans/fg_family_security.jpg';

  // Quick Estimate Calculation for Widget
  const estRate = 0.0594 + (quickAge - 30) * 0.000085;
  const estYearlyAnnuity = Math.round(quickPremium * estRate);
  const estMonthlyAnnuity = Math.round(estYearlyAnnuity / 12);

  const planOptions = [
    {
      id: 0,
      code: 'Option 1',
      title: 'Immediate Life Annuity',
      subtitle: 'Maximizes Immediate Regular Income',
      desc: 'Annuity payments start immediately from Day 1 for the lifetime of the annuitant. Ceases upon demise with no death benefit.',
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
      tag: 'Highest Payout',
      payout: 'Immediate (Day 1)',
      capitalRefund: 'No Return of Premium',
      ga: 'None'
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
      capitalRefund: '100% Purchase Price Refund',
      ga: 'None'
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
      capitalRefund: '100% Purchase Price + GA',
      ga: '1/12th Yearly Annuity / month'
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
      capitalRefund: '100% Purchase Price + GA',
      ga: '6% of Premiums p.a. / month'
    }
  ];

  return (
    <>
      <SEO 
        title={`${plan.name} by ${providerName} - Guaranteed Lifetime Pension & 100% ROP`}
        description={plan.description || `Explore ${plan.name} by ${providerName}. Guaranteed lifelong pension, Guaranteed Additions, 100% Return of Purchase Price.`}
        canonicalUrl={`https://radheinv.site/plan/${plan.id}`}
        type="product"
      >
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Insurance Plans", url: "https://radheinv.site/#products" },
            { name: plan.category, url: `https://radheinv.site/category/${plan.category.toLowerCase()}` },
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
              <span>IRDAI UIN: {calcConfig.uin || '110N161V13'}</span>
              <span>•</span>
              <span className="text-teal-400 font-semibold">100% Guaranteed</span>
            </div>
          </div>

          {/* HERO BANNER SECTION WITH GENERATED VISUAL IMAGE */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
            
            {/* Background Image Container with Gradient Overlays */}
            <div className="absolute inset-0 z-0">
              <img 
                src={heroImage} 
                alt="Retirement Freedom and Guaranteed Pension" 
                className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000"
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
                    <Shield className="w-3.5 h-3.5 text-teal-400" /> {providerName}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    IRDAI UIN: {calcConfig.uin || '110N161V13'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                    Individual Annuity
                  </span>
                </div>

                {/* Plan Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                  Tata AIA Fortune Guarantee Pension
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                  Lock in an <strong className="text-white">irrevocable guaranteed retirement income for life</strong> from Day 1. Complete with Guaranteed Additions, Persistency Boosters, Joint Life survivorship, and 100% Return of Purchase Price.
                </p>

                {/* Highlights Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Regular Income</span>
                    <span className="text-sm sm:text-base font-bold text-teal-400 block mt-0.5">Lifelong Payout</span>
                  </div>
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Legacy Refund</span>
                    <span className="text-sm sm:text-base font-bold text-amber-400 block mt-0.5">100% ROP on Demise</span>
                  </div>
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Incontestability</span>
                    <span className="text-sm sm:text-base font-bold text-indigo-400 block mt-0.5">3 Yrs (Sec 45)</span>
                  </div>
                  <div className="bg-slate-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Policy Liquidity</span>
                    <span className="text-sm sm:text-base font-bold text-white block mt-0.5">Up to 80% Loan</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => navigate(`/quote-generator?planId=${plan.id}`)}
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-500/25 transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <Calculator className="w-5 h-5" /> Generate Instant Actuarial Quote <ArrowRight className="w-5 h-5" />
                  </button>

                  <a 
                    href="/documents/Tata-AIA-FG-Pension-Brochure.pdf" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-teal-500/40 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-teal-400" /> Download Brochure (PDF)
                  </a>
                </div>

              </div>

              {/* Quick Estimate Card on the Right */}
              <div className="lg:col-span-4 bg-slate-950/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-teal-400" /> Quick Pension Estimate
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold">
                    Option 2 / 4
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Annuitant Age</span>
                    <span className="font-bold text-white font-mono">{quickAge} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="80" 
                    value={quickAge} 
                    onChange={(e) => setQuickAge(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Single Purchase Price</span>
                    <span className="font-bold text-teal-400 font-mono">₹{(quickPremium).toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500000" 
                    max="10000000" 
                    step="100000"
                    value={quickPremium} 
                    onChange={(e) => setQuickPremium(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-medium">Estimated Annual Income</span>
                  <span className="text-2xl sm:text-3xl font-black text-teal-400 font-mono block">
                    ₹{estYearlyAnnuity.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ yr</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    (~₹{estMonthlyAnnuity.toLocaleString('en-IN')} / month for life + 100% ROP)
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

          {/* INTERACTIVE 4-OPTION VISUAL EXPLORER */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Flexible Retirement Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Choose from 4 Master Annuity Options</h2>
              <p className="text-slate-400 text-sm">
                Each option is engineered to match distinct retirement stages—from immediate lifelong cashflows to high-compounding deferred legacies.
              </p>
            </div>

            {/* Option Pills */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {planOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOptionTab(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    selectedOptionTab === opt.id
                      ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold text-teal-400">{opt.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {opt.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{opt.title}</h4>
                </button>
              ))}
            </div>

            {/* Active Option Detail Card */}
            {planOptions[selectedOptionTab] && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl animate-fade-in space-y-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {planOptions[selectedOptionTab].icon}
                      <h3 className="text-2xl font-bold text-white">{planOptions[selectedOptionTab].title}</h3>
                    </div>
                    <p className="text-sm text-teal-400 font-semibold">{planOptions[selectedOptionTab].subtitle}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/quote-generator?planId=${plan.id}`)}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    Quote This Option <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                  {planOptions[selectedOptionTab].desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Annuity Payout Starts</span>
                    <span className="text-sm font-bold text-white block mt-1">{planOptions[selectedOptionTab].payout}</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Demise Benefit (Capital Refund)</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-1">{planOptions[selectedOptionTab].capitalRefund}</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Guaranteed Additions in Deferment</span>
                    <span className="text-sm font-bold text-indigo-400 block mt-1">{planOptions[selectedOptionTab].ga}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* MULTI-GENERATIONAL FAMILY LEGACY & JOINT LIFE FEATURETTE */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full uppercase">
                  Joint Life & Legacy Protection
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Complete Protection for Your Spouse & Next Generation
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Retirement security doesn’t end with one person. Under the **Joint Life Annuity with Return of Purchase Price**, regular income continues seamlessly to your spouse, with 100% of the original investment corpus paid out to your children.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <strong className="text-white block">Primary Annuitant Lifetime Income</strong>
                    <span className="text-slate-400">Regular guaranteed payments disbursed as chosen (Monthly / Yearly).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <strong className="text-white block">100% Survivorship Pension to Spouse</strong>
                    <span className="text-slate-400">Uninterrupted pension payments continue to the secondary annuitant for life.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <strong className="text-white block">100% Capital Refund (ROP) to Nominees</strong>
                    <span className="text-slate-400">Full Purchase Price returned tax-free under Section 10(10D) on later death.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 h-full min-h-[380px] relative p-6 lg:p-0">
              <img 
                src={familyImage} 
                alt="Multi-Generational Indian Family Security" 
                className="w-full h-full object-cover rounded-2xl lg:rounded-none lg:rounded-r-3xl shadow-xl"
              />
            </div>

          </div>

          {/* OFFICIAL DOWNLOADS & DOCUMENTATION CENTER */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Official Downloads Portal</span>
              <h2 className="text-3xl font-black text-white">Policy Documents & Servicing Kits</h2>
              <p className="text-slate-400 text-xs">
                Download verified official policy contracts, sales brochures, claims kits, and servicing forms.
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
                        {doc.size}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block">{doc.type}</span>
                      <h4 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors mt-0.5">{doc.title}</h4>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Official IRDAI Copy</span>
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

              {/* Waiting Periods & Regulatory Timelines */}
              {waitingPeriods.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-400" /> Waiting Periods & Regulatory Safeguards
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
