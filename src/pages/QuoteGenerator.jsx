import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { calculateQuote, validateQuoteInputs } from '../lib/quoteEngine';
import QuotePDFDocument from '../components/quotes/QuotePDFDocument';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  Sparkles, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Download, 
  Share2, 
  Save, 
  MessageCircle, 
  Info, 
  AlertCircle, 
  Check, 
  Star,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

export default function QuoteGenerator() {
  const { planId: routePlanId } = useParams();
  const [searchParams] = useSearchParams();
  const queryPlanId = searchParams.get('planId') || routePlanId;
  const navigate = useNavigate();

  // Wizard Steps: 1: Plan, 2: Customer, 3: Configuration, 4: Results
  const [step, setStep] = useState(queryPlanId ? 2 : 1);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // PDF Preview Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [savedQuoteData, setSavedQuoteData] = useState(null);

  // Customer Form State
  const [customerInputs, setCustomerInputs] = useState({
    name: '',
    age: 50,
    gender: 'male',
    mobile: '',
    email: '',
    city: '',
    isJointLife: false,
    secondaryAge: 46,
    secondaryRelation: 'Spouse',
    isNpsSubscriber: false,
    optionId: 'option_4',
    premiumMode: 'single',
    premiumAmount: 2500000,
    ppt: 10,
    defermentPeriod: 10,
    payoutFrequency: 'annual_arrears',
    selectedRiders: []
  });

  // Calculated Live Result State
  const [liveQuoteResult, setLiveQuoteResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans.length > 0 && queryPlanId) {
      const match = plans.find(p => p.id === queryPlanId);
      if (match) {
        setSelectedPlan(match);
        setStep(2);
      }
    }
  }, [plans, queryPlanId]);

  // Recalculate quote live whenever inputs or selected plan change
  useEffect(() => {
    if (!selectedPlan) return;
    
    const planConfig = selectedPlan.calculation_config || selectedPlan.premium_data?.calculation_config || selectedPlan.metadata?.calculation_config;
    if (!planConfig) {
      setLiveQuoteResult(null);
      return;
    }

    const val = validateQuoteInputs(planConfig, customerInputs);
    setValidationErrors(val.errors);

    if (val.isValid) {
      const calc = calculateQuote(planConfig, customerInputs);
      if (calc.success) {
        setLiveQuoteResult(calc.quote);
      }
    } else {
      setLiveQuoteResult(null);
    }
  }, [selectedPlan, customerInputs]);

  async function fetchPlans() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('*, insurance_companies(name, logo_url)')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setPlans(data || []);

      if (queryPlanId && data && data.length > 0) {
        const matched = data.find(p => p.id === queryPlanId);
        if (matched) {
          setSelectedPlan(matched);
          setStep(2);
        }
      }
    } catch (err) {
      console.error('Error loading plans:', err);
      toast.error('Failed to load active insurance plans');
    } finally {
      setLoading(false);
    }
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(2);
  };

  const handleSaveQuote = async () => {
    if (!liveQuoteResult) {
      toast.error('Please resolve configuration errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const quotePayload = {
        plan_id: selectedPlan.id,
        plan_version: selectedPlan.version || 1,
        customer_name: customerInputs.name || 'Valued Client',
        customer_email: customerInputs.email || null,
        customer_phone: customerInputs.mobile || null,
        customer_age: Number(customerInputs.age),
        customer_gender: customerInputs.gender,
        premium_amount: Number(customerInputs.premiumAmount),
        payment_frequency: customerInputs.payoutFrequency,
        policy_term: liveQuoteResult.configuration.ppt + liveQuoteResult.configuration.defermentPeriod,
        ppt: liveQuoteResult.configuration.ppt,
        status: 'generated',
        input_snapshot: customerInputs,
        calculation_result_snapshot: liveQuoteResult
      };

      const { data, error } = await supabase
        .from('quotes')
        .insert([quotePayload])
        .select()
        .single();

      if (error) throw error;

      setSavedQuoteData({
        ...data,
        ...liveQuoteResult,
        quote_number: data.quote_number,
        created_at: data.created_at
      });

      toast.success(`Quote ${data.quote_number} generated and saved!`);
      setStep(4);
    } catch (err) {
      console.error('Error saving quote:', err);
      toast.error('Failed to save quote: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToStep3 = async () => {
    if (!customerInputs.name || !customerInputs.mobile) {
      toast.error('Please provide Full Name and Mobile Number to proceed.');
      return;
    }
    
    // Move to next step immediately for smooth UX
    setStep(3);

    // Capture the lead asynchronously in the background
    try {
      await supabase
        .from('leads')
        .insert([{
          name: customerInputs.name,
          phone: customerInputs.mobile,
          age: Number(customerInputs.age),
          gender: customerInputs.gender,
          plan_interest: selectedPlan?.name || 'Unknown Plan',
          source: 'Quote Generator - Step 2',
          status: 'new'
        }]);
    } catch (err) {
      console.error('Error capturing lead:', err);
    }
  };

  const handleWhatsAppShare = () => {
    if (!liveQuoteResult) return;
    const phone = customerInputs.mobile ? customerInputs.mobile.replace(/[^0-9]/g, '') : '';
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
    
    const message = encodeURIComponent(
      `🏛️ *Radhe Investments - Official Quotation*\n\n` +
      `👤 *Annuitant*: ${customerInputs.name || 'Valued Client'} (Age: ${customerInputs.age} Yrs)\n` +
      `📜 *Plan*: ${selectedPlan.name} (${liveQuoteResult.uin})\n` +
      `🎯 *Option*: ${liveQuoteResult.configuration.optionName}\n` +
      `💳 *Premium*: ₹${Number(customerInputs.premiumAmount).toLocaleString('en-IN')} (${customerInputs.premiumMode.toUpperCase()})\n` +
      `💰 *Guaranteed Annuity*: ₹${liveQuoteResult.benefits.totalYearlyAnnuity.toLocaleString('en-IN')} / year\n` +
      `🛡️ *Capital Refund (ROP)*: ₹${liveQuoteResult.benefits.guaranteedReturnOfPurchasePrice.toLocaleString('en-IN')} on demise\n\n` +
      `✅ *IRDAI Section 45 Incontestable* | 30-Day Free-Look Guaranteed.\n` +
      `📞 Contact our Advisory Desk: +91 98883 05678`
    );

    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${message}`, '_blank');
  };

  const planConfig = selectedPlan?.calculation_config || selectedPlan?.premium_data?.calculation_config || selectedPlan?.metadata?.calculation_config;
  const availableOptions = planConfig?.options || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Dynamic Insurance Quote Generator - Radhe Investments</title>
        <meta name="description" content="Generate official, guaranteed insurance and annuity quotations dynamically with real-time actuarial calculation." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        
        {/* Wizard Progress Stepper */}
        <div className="mb-8 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between items-center max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 -translate-y-1/2 transition-all duration-500 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {[
              { num: 1, label: 'Select Plan' },
              { num: 2, label: 'Annuitant' },
              { num: 3, label: 'Configuration' },
              { num: 4, label: 'Quote & Benefits' }
            ].map(s => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`flex flex-col items-center gap-1.5 relative z-10 transition-all ${
                    s.num > step ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                    isDone ? 'bg-teal-500 text-slate-950 shadow-teal-500/30' :
                    isCurrent ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-black scale-110 shadow-[0_0_15px_rgba(20,184,166,0.5)]' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-teal-400' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SELECT PLAN */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl font-black text-white">Select an Insurance Plan</h1>
              <p className="text-slate-400 text-sm mt-2">
                Choose from our verified, IRDAI-compliant pension, life, and investment portfolios to generate a tailored quote.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map(plan => {
                const isSelected = selectedPlan?.id === plan.id;
                const company = plan.insurance_companies?.name || 'Insurer';
                return (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan)}
                    className={`bg-slate-900/90 border rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02] shadow-xl ${
                      isSelected ? 'border-teal-500 bg-slate-800/80 shadow-teal-500/15 ring-2 ring-teal-500/30' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-full border border-teal-500/20">
                          {plan.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{company}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-6">
                        {plan.description || 'Comprehensive guaranteed protection and retirement income solution.'}
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                      <span className="text-xs text-teal-400 font-mono">UIN: {plan.metadata?.calculation_config?.uin || 'IRDAI-Verified'}</span>
                      <button className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
                        Select <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOMER DETAILS */}
        {step === 2 && selectedPlan && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 2 of 4</span>
                <h2 className="text-2xl font-bold text-white">Annuitant & Client Profile</h2>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1"
              >
                Change Plan ({selectedPlan.name})
              </button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Ramesh Chandra Sharma"
                    value={customerInputs.name}
                    onChange={(e) => setCustomerInputs({ ...customerInputs, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age (Completed Years)</label>
                  <input
                    type="number"
                    min="30"
                    max="85"
                    value={customerInputs.age}
                    onChange={(e) => setCustomerInputs({ ...customerInputs, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender</label>
                  <select
                    value={customerInputs.gender}
                    onChange={(e) => setCustomerInputs({ ...customerInputs, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Transgender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Mobile Number (for WhatsApp Quote)</label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    maxLength="10"
                    pattern="[0-9]*"
                    placeholder="9876543210"
                    value={customerInputs.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setCustomerInputs({ ...customerInputs, mobile: val });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Special Eligibility Toggles */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                
                {/* Joint Life Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-teal-400" />
                    <div>
                      <span className="text-sm font-bold text-white block">Joint Life Coverage</span>
                      <span className="text-xs text-slate-400">Continue 100% pension to spouse after primary annuitant demise</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={customerInputs.isJointLife}
                    onChange={(e) => setCustomerInputs({ ...customerInputs, isJointLife: e.target.checked })}
                    className="w-5 h-5 accent-teal-500 cursor-pointer"
                  />
                </div>

                {customerInputs.isJointLife && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Secondary Annuitant Age</label>
                      <input
                        type="number"
                        min="30"
                        max="85"
                        value={customerInputs.secondaryAge}
                        onChange={(e) => setCustomerInputs({ ...customerInputs, secondaryAge: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={customerInputs.secondaryRelation}
                        onChange={(e) => setCustomerInputs({ ...customerInputs, secondaryRelation: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                )}

                {/* NPS Subscriber Benefit */}
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-sm font-bold text-white block">NPS Subscriber Uplift (+1.0%)</span>
                      <span className="text-xs text-slate-400">Purchasing annuity using accumulated National Pension System proceeds</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={customerInputs.isNpsSubscriber}
                    onChange={(e) => setCustomerInputs({ ...customerInputs, isNpsSubscriber: e.target.checked })}
                    className="w-5 h-5 accent-teal-500 cursor-pointer"
                  />
                </div>

              </div>

              {/* Action */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleContinueToStep3}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2"
                >
                  Continue to Policy Parameters <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC CONFIGURATION & LIVE RESULTS */}
        {step === 3 && selectedPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left Column: Configurator Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 3 of 4</span>
                  <h2 className="text-2xl font-bold text-white">Policy Options & Investment</h2>
                </div>

                {/* Option Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Select Plan Option
                  </label>
                  <div className="space-y-3">
                    {availableOptions.map(opt => {
                      const isSelected = customerInputs.optionId === opt.id || customerInputs.optionId === opt.code;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setCustomerInputs({ ...customerInputs, optionId: opt.id, isDeferred: opt.type === 'deferred' })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-white">{opt.name}</span>
                            {isSelected && <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Premium Payment Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Payment Mode</label>
                    <select
                      value={customerInputs.premiumMode}
                      onChange={(e) => setCustomerInputs({ ...customerInputs, premiumMode: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="single">Single Pay (One Time)</option>
                      <option value="annual">Regular / Limited Pay (Annual)</option>
                      <option value="half_yearly">Half-Yearly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Payout Frequency</label>
                    <select
                      value={customerInputs.payoutFrequency}
                      onChange={(e) => setCustomerInputs({ ...customerInputs, payoutFrequency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="annual_arrears">Annually in Arrears (100% Base)</option>
                      <option value="half_yearly_arrears">Half-Yearly (98% x 1/2)</option>
                      <option value="quarterly_arrears">Quarterly (97% x 1/4)</option>
                      <option value="monthly_arrears">Monthly (96% x 1/12)</option>
                      <option value="annual_advance">Annually in Advance (93%)</option>
                    </select>
                  </div>
                </div>

                {/* Term & Deferment Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customerInputs.premiumMode !== 'single' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Premium Payment Term (PPT)</label>
                      <select
                        value={customerInputs.ppt}
                        onChange={(e) => setCustomerInputs({ ...customerInputs, ppt: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                      >
                        {[5, 6, 7, 8, 9, 10, 11, 12, 15].map(y => (
                          <option key={y} value={y}>{y} Years</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(customerInputs.optionId === 'option_3' || customerInputs.optionId === 'option_4' || customerInputs.premiumMode !== 'single') && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Deferment Period</label>
                      <select
                        value={customerInputs.defermentPeriod}
                        onChange={(e) => setCustomerInputs({ ...customerInputs, defermentPeriod: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                      >
                        {Array.from({length: 25}, (_, i) => i + 1).map(y => (
                          <option key={y} value={y}>{y} Years</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Investment Amount Input & Presets */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {customerInputs.premiumMode === 'single' ? 'Purchase Price (Single Premium)' : 'Annual Premium Amount'}
                    </label>
                    <span className="text-lg font-black text-teal-400 font-mono">
                      ₹{Number(customerInputs.premiumAmount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={customerInputs.premiumMode === 'single' ? 150000 : 25000}
                    max={10000000}
                    step={25000}
                    value={customerInputs.premiumAmount}
                    onChange={(e) => setCustomerInputs({ ...customerInputs, premiumAmount: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { label: '₹5 Lakhs', val: 500000 },
                      { label: '₹10 Lakhs', val: 1000000 },
                      { label: '₹25 Lakhs', val: 2500000 },
                      { label: '₹50 Lakhs', val: 5000000 },
                      { label: '₹1 Crore', val: 10000000 }
                    ].map(p => (
                      <button
                        key={p.val}
                        onClick={() => setCustomerInputs({ ...customerInputs, premiumAmount: p.val })}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                          customerInputs.premiumAmount === p.val 
                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold' 
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-1">
                    {validationErrors.map((err, idx) => (
                      <p key={idx} className="text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {err}
                      </p>
                    ))}
                  </div>
                )}

                {/* Back / Next */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Annuitant
                  </button>
                  <button
                    onClick={handleSaveQuote}
                    disabled={isSaving || !liveQuoteResult}
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? 'Calculating & Saving...' : 'Generate & Save Official Quote'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Right Column: Live Calculated Quote Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="sticky top-24 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-500/10 relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold">
                      Live Actuarial Preview
                    </span>
                    <h3 className="text-xl font-black text-white mt-2">Guaranteed Retirement Payout</h3>
                  </div>
                  <Sparkles className="w-6 h-6 text-teal-400" />
                </div>

                {liveQuoteResult ? (
                  <div className="space-y-6">
                    
                    {/* Main Headline Annuity */}
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-medium">Guaranteed Annual Income</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">
                          ₹{liveQuoteResult.benefits.totalYearlyAnnuity.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">/ year for life</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Equivalent to <strong className="text-slate-300">₹{liveQuoteResult.benefits.monthlyEquivalent.toLocaleString('en-IN')}/month</strong>
                      </p>
                    </div>

                    {/* Benefit Breakdown Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Capital Refund (ROP)</span>
                        <span className="font-bold text-white text-sm font-mono mt-0.5 block">
                          ₹{liveQuoteResult.benefits.guaranteedReturnOfPurchasePrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block">Accrued GA (Deferment)</span>
                        <span className="font-bold text-indigo-400 text-sm font-mono mt-0.5 block">
                          ₹{liveQuoteResult.benefits.totalAccruedGA.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {liveQuoteResult.benefits.annuityBooster > 0 && (
                        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 col-span-2">
                          <span className="text-slate-500 block">Persistency Booster Included</span>
                          <span className="font-bold text-teal-400 text-sm font-mono mt-0.5 block">
                            +₹{liveQuoteResult.benefits.annuityBooster.toLocaleString('en-IN')} / year extra
                          </span>
                        </div>
                      )}

                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 col-span-2">
                        <span className="text-slate-500 block">Max Policy Loan Limit (80% SV)</span>
                        <span className="font-bold text-amber-400 text-sm font-mono mt-0.5 block">
                          Up to ₹{liveQuoteResult.benefits.policyLoanLimit.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Statutory Guarantees */}
                    <div className="border-t border-slate-800 pt-4 space-y-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                        <span><strong>Section 45 Incontestable</strong> after 3 years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                        <span><strong>30-Day Free Look</strong> trial refund period</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                        <span><strong>100% Tax-Free Demise Benefit</strong> (Sec 10(10D))</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    Enter valid parameters on the left to calculate live quote.
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* STEP 4: FINAL SAVED QUOTE & OMNI-CHANNEL ACTIONS */}
        {step === 4 && savedQuoteData && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-blue-950 border border-teal-500/40 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-3xl font-black text-white">Quotation Successfully Generated!</h2>
              <p className="text-slate-400 text-sm mt-1">
                Official Quote Number: <span className="text-teal-400 font-mono font-bold text-base">{savedQuoteData.quote_number}</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download / Print PDF Quote
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Dispatch on WhatsApp
                </button>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Plan & Insurer</span>
                <h4 className="text-lg font-bold text-white mt-1">{savedQuoteData.planName}</h4>
                <p className="text-xs text-slate-400 mt-1">UIN: {savedQuoteData.uin}</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Guaranteed Income</span>
                <h4 className="text-2xl font-black text-teal-400 mt-1 font-mono">
                  ₹{savedQuoteData.benefits.totalYearlyAnnuity.toLocaleString('en-IN')}
                </h4>
                <p className="text-xs text-slate-400 mt-1">Paid {savedQuoteData.configuration.payoutFrequencyName}</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Legacy Capital Returned</span>
                <h4 className="text-2xl font-black text-white mt-1 font-mono">
                  ₹{savedQuoteData.benefits.guaranteedReturnOfPurchasePrice.toLocaleString('en-IN')}
                </h4>
                <p className="text-xs text-slate-400 mt-1">100% Tax-Free under 10(10D)</p>
              </div>
            </div>

            {/* Restart or Go Back */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => {
                  setStep(1);
                  setSavedQuoteData(null);
                }}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Create Another Quote
              </button>
              <button
                onClick={() => navigate('/quotes')}
                className="text-sm text-teal-400 hover:underline flex items-center gap-1"
              >
                View All Quotes History <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* PDF Modal */}
      {isPdfModalOpen && savedQuoteData && (
        <QuotePDFDocument
          quoteData={savedQuoteData}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}

    </div>
  );
}
