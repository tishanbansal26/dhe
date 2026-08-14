import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  Download, 
  Share2, 
  MessageCircle, 
  Calendar, 
  User, 
  DollarSign, 
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuotePDFDocument from '../components/quotes/QuotePDFDocument';
import { Helmet } from 'react-helmet-async';

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  async function fetchQuote() {
    setLoading(true);
    try {
      // Check whether `id` is UUID or share_token
      let query = supabase.from('quotes').select('*, insurance_plans(name, uin:metadata->calculation_config->uin)');
      
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('share_token', id);
      }

      const { data, error } = await query.single();
      if (error) throw error;
      setQuote(data);
    } catch (err) {
      console.error('Error fetching quote:', err);
      toast.error('Quote not found or link expired');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 bg-slate-850 rounded w-32"></div>
          <div className="h-40 bg-slate-900 border border-slate-800 rounded-3xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-slate-900 border border-slate-800 rounded-3xl"></div>
            <div className="h-48 bg-slate-900 border border-slate-800 rounded-3xl"></div>
            <div className="h-48 bg-slate-900 border border-slate-800 rounded-3xl"></div>
          </div>
          <div className="h-64 bg-slate-900 border border-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Quotation Not Found</h2>
        <p className="text-xs">The requested quotation link may be invalid or expired.</p>
        <Link to="/quote-generator" className="px-6 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl">
          Create New Quote
        </Link>
      </div>
    );
  }

  const snap = quote.calculation_result_snapshot || {};
  const customer = snap.customer || {};
  const config = snap.configuration || {};
  const benefits = snap.benefits || {};
  const cashflowTimeline = snap.cashflowTimeline || [];
  const statutorySafeguards = snap.statutorySafeguards || {};

  const fullQuoteForPdf = {
    ...snap,
    quote_number: quote.quote_number,
    created_at: quote.created_at
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`Quote ${quote.quote_number} - ${snap.planName || 'Insurance Plan'}`}</title>
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Quotes
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPdfOpen(true)}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download Official PDF
            </button>
            <Link
              to="/quote-generator"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
            >
              New Quote
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-mono font-bold rounded-full border border-teal-500/20">
                  {quote.quote_number}
                </span>
                <span className="text-xs text-slate-500">
                  Generated {new Date(quote.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{snap.planName}</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">UIN: {snap.uin} • {snap.insurer}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Guaranteed Annual Payout</span>
              <span className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">
                ₹{(benefits.totalYearlyAnnuity || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 block font-medium">/ year for life</span>
            </div>
          </div>

          {/* Details Dual Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800/80 pt-6">
            
            {/* Customer Snapshot */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2.5 text-xs">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" /> Annuitant Profile
              </h3>
              <div className="flex justify-between"><span className="text-slate-500">Full Name:</span> <span className="font-semibold text-white">{customer.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age / Gender:</span> <span className="font-semibold text-white">{customer.age} Yrs • {customer.gender?.toUpperCase()}</span></div>
              {customer.isJointLife && (
                <div className="flex justify-between"><span className="text-slate-500">Secondary Annuitant:</span> <span className="font-semibold text-teal-400">Spouse ({customer.secondaryAge} Yrs)</span></div>
              )}
              {customer.isNpsSubscriber && (
                <div className="flex justify-between"><span className="text-slate-500">NPS Member Bonus:</span> <span className="font-semibold text-amber-400">+1.0% Rate Applied</span></div>
              )}
            </div>

            {/* Policy Parameters */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2.5 text-xs">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-400" /> Policy Configuration
              </h3>
              <div className="flex justify-between"><span className="text-slate-500">Chosen Option:</span> <span className="font-semibold text-white">{config.optionName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Purchase Price / Premium:</span> <span className="font-semibold text-white font-mono">₹{Number(quote.premium_amount).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Payment Mode:</span> <span className="font-semibold text-white uppercase">{config.premiumMode} (PPT: {config.ppt} Yr)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Payout Frequency:</span> <span className="font-semibold text-white">{config.payoutFrequencyName}</span></div>
            </div>

          </div>
        </div>

        {/* Benefits Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs text-slate-500 block">Base Yearly Annuity</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono mt-1 block">
              ₹{(benefits.yearlyBaseAnnuity || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs text-slate-500 block">Persistency Booster</span>
            <span className="text-lg sm:text-xl font-bold text-teal-400 font-mono mt-1 block">
              +₹{(benefits.annuityBooster || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs text-slate-500 block">Accrued GA (Deferment)</span>
            <span className="text-lg sm:text-xl font-bold text-indigo-400 font-mono mt-1 block">
              ₹{(benefits.totalAccruedGA || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs text-slate-500 block">Capital Refund (ROP)</span>
            <span className="text-lg sm:text-xl font-bold text-amber-400 font-mono mt-1 block">
              ₹{(benefits.guaranteedReturnOfPurchasePrice || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Cashflow Schedule Table */}
        {cashflowTimeline.length > 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Projected Cashflow & Death Benefit Timeline</h3>
                <p className="text-xs text-slate-500">Year-by-year actuarial schedule of guaranteed benefits and policy loan eligibility.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Policy Year</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Premium</th>
                    <th className="p-3">Base (A)</th>
                    <th className="p-3">Booster (B)</th>
                    <th className="p-3">Total (A+B)</th>
                    <th className="p-3">Accrued GA</th>
                    <th className="p-3">Death Benefit</th>
                    <th className="p-3">Min GSV</th>
                    <th className="p-3">Special SV</th>
                    <th className="p-3">Surrender Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {cashflowTimeline.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 font-bold text-slate-400">Yr {row.policyYear}</td>
                      <td className="p-3 text-slate-400">{row.annuitantAge}</td>
                      <td className="p-3">{row.premiumPaid > 0 ? `₹${row.premiumPaid.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3">{row.baseAnnuity > 0 ? `₹${row.baseAnnuity.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3">{row.annuityBooster > 0 ? `₹${row.annuityBooster.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3 font-bold text-teal-400">{row.annuityPayout > 0 ? `₹${row.annuityPayout.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3 text-indigo-400">{row.accruedGA > 0 ? `₹${row.accruedGA.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3 font-semibold text-white">₹{row.deathBenefit.toLocaleString('en-IN')}</td>
                      <td className="p-3">₹{(row.minGsv || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3">₹{(row.specialSv || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-semibold">₹{row.surrenderValue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* PDF Modal */}
      {isPdfOpen && (
        <QuotePDFDocument
          quoteData={fullQuoteForPdf}
          onClose={() => setIsPdfOpen(false)}
        />
      )}

    </div>
  );
}
