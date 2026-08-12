import React, { useState, useEffect } from 'react';
import { Calculator, Heart, Shield, TrendingUp, IndianRupee, ArrowRight, Activity, Zap, Users, PlayCircle, Star, BadgeCheck, CheckCircle2, ChevronRight, UserCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductGrid from '../components/ProductGrid';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
  
  useEffect(() => {
    document.title = "Radhe Investments - Top Health & Life Insurance Platform";
  }, []);

  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  
  const [claimSearch, setClaimSearch] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [claimError, setClaimError] = useState(false);

  const formatCurrency = (num) => new Intl.NumberFormat('en-IN').format(Math.round(num));
  
  const calculateSIP = () => {
    const P = monthlyInvest;
    const r = returnRate / 100 / 12;
    const n = timePeriod * 12;
    const invested = P * n;
    const expectedValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const returns = expectedValue - invested;
    return { invested, returns, expectedValue };
  };

  const sip = calculateSIP();

  const handleClaimSearch = async () => {
    const val = claimSearch.trim().toUpperCase();
    if (!val) return;
    
    setClaimResult(null);
    setClaimError(false);

    try {
      const { data, error } = await supabase.from('claims').select('*').eq('policy_number', val).single();
      if (data) {
        setClaimResult(data);
      } else {
        throw new Error('Not found');
      }
    } catch (e) {
      setClaimError(true);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Find the Best Policy With <br />
          <span className="gradient-text">Radhe Investments</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-400 mb-10 font-inter">
          Compare 51+ insurers, unlock exclusive discounts, and let our experts guide you to the perfect coverage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#products" className="glow-button bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
            Compare Plans
          </a>
          <Link to="/login" className="glass-panel px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors border border-gray-700 hover:border-gray-500">
            Agent Login <UserCircle className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories / Products Section */}
      <ProductGrid />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* SIP Calculator Section */}
      <section id="calculator" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Financial Growth <span className="text-teal-400">Calculator</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Plan your Systematic Investment Plan (SIP) and visualize your future wealth with our interactive tool.</p>
          </div>
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-700/50 flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-medium text-gray-300">Monthly Investment</label>
                  <span className="font-bold text-teal-400 text-xl">₹{formatCurrency(monthlyInvest)}</span>
                </div>
                <input type="range" min="500" max="100000" step="500" value={monthlyInvest} onChange={e => setMonthlyInvest(Number(e.target.value))} />
              </div>
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-medium text-gray-300">Expected Return Rate (p.a)</label>
                  <span className="font-bold text-teal-400 text-xl">{returnRate}%</span>
                </div>
                <input type="range" min="1" max="30" step="0.5" value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} />
              </div>
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-medium text-gray-300">Time Period</label>
                  <span className="font-bold text-teal-400 text-xl">{timePeriod} Years</span>
                </div>
                <input type="range" min="1" max="40" step="1" value={timePeriod} onChange={e => setTimePeriod(Number(e.target.value))} />
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <p className="text-gray-400 text-sm mb-1">Invested Amount</p>
                <p className="text-2xl font-semibold text-white">₹{formatCurrency(sip.invested)}</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <p className="text-gray-400 text-sm mb-1">Est. Returns</p>
                <p className="text-2xl font-semibold text-emerald-400">₹{formatCurrency(sip.returns)}</p>
              </div>
              <div className="glass-panel bg-teal-900/20 rounded-2xl p-8 border border-teal-500/30 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
                <p className="text-teal-100/70 text-sm mb-2 font-medium">Total Value</p>
                <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">₹{formatCurrency(sip.expectedValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claims Portal Section */}
      <section id="claim-portal" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer <span className="text-emerald-400">Claims Portal</span></h2>
            <p className="text-gray-400">Verify and track approved claims securely.</p>
          </div>
          <div className="glass-panel rounded-3xl p-8 border border-slate-700/50">
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <input 
                  type="text" 
                  value={claimSearch}
                  onChange={e => setClaimSearch(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Enter Policy Number (e.g. POL-98231)" 
                />
              </div>
              <button onClick={handleClaimSearch} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Verify
              </button>
            </div>
            
            {claimError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
                Policy not found or claim not approved. Please check the policy number.
              </div>
            )}

            {claimResult && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden transform transition-all duration-500">
                <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Policy Number</p>
                    <h3 className="text-xl font-bold text-white font-mono">{claimResult.policy_number}</h3>
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-500/50 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-400 font-bold text-sm tracking-wide">APPROVED</span>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Policyholder Name</p>
                    <p className="font-medium text-gray-200">{claimResult.policyholder_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Coverage Type</p>
                    <p className="font-medium text-gray-200">{claimResult.coverage_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Sum Insured</p>
                    <p className="font-medium text-gray-200">{claimResult.total_sum_insured}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Approval Date</p>
                    <p className="font-medium text-gray-200">{claimResult.approval_date}</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Itemized Payout Details</h4>
                  <div className="space-y-3">
                    {claimResult.itemized_details && (typeof claimResult.itemized_details === 'string' ? JSON.parse(claimResult.itemized_details) : claimResult.itemized_details).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-medium">{item.amount}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-800 my-2 pt-2 flex justify-between">
                      <span className="text-gray-400 font-medium">Total Approved Amount</span>
                      <span className="text-emerald-400 font-bold text-lg">{claimResult.total_approved_amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </>
  );
}
