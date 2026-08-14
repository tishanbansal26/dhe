import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  MessageCircle, 
  Plus, 
  Eye, 
  Calendar, 
  Shield, 
  DollarSign, 
  Users,
  Copy,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuotePDFDocument from '../components/quotes/QuotePDFDocument';
import { Helmet } from 'react-helmet-async';

export default function QuotesHistory() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuoteForPdf, setSelectedQuoteForPdf] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, insurance_plans(name, uin:metadata->calculation_config->uin)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      toast.error('Failed to load quotes pipeline');
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = (token, id) => {
    const link = `${window.location.origin}/quotes/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Quote link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (quote) => {
    const phone = quote.customer_phone ? quote.customer_phone.replace(/[^0-9]/g, '') : '';
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
    const snap = quote.calculation_result_snapshot || {};
    const benefits = snap.benefits || {};

    const message = encodeURIComponent(
      `🏛️ *Radhe Investments - Official Quotation*\n\n` +
      `📜 *Quote No*: ${quote.quote_number}\n` +
      `👤 *Customer*: ${quote.customer_name} (${quote.customer_age} Yrs)\n` +
      `🛡️ *Plan*: ${quote.insurance_plans?.name || 'Guaranteed Pension'}\n` +
      `💳 *Premium*: ₹${Number(quote.premium_amount).toLocaleString('en-IN')}\n` +
      `💰 *Guaranteed Annuity*: ₹${(benefits.totalYearlyAnnuity || 0).toLocaleString('en-IN')} / year\n\n` +
      `🔗 View Official Quote: ${window.location.origin}/quotes/${quote.id}`
    );

    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${message}`, '_blank');
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.insurance_plans?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Quotes Portfolio & Pipeline - Radhe Investments</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Advisory Pipeline</span>
            <h1 className="text-3xl font-black text-white mt-1">Quotations & Proposals</h1>
            <p className="text-slate-400 text-xs mt-1">Manage, dispatch, and track client insurance quotations.</p>
          </div>

          <Link
            to="/quote-generator"
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Quote Generator
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by quote #, client name, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="generated">Generated</option>
              <option value="shared">Shared</option>
              <option value="accepted">Accepted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>

        {/* Quotes Table */}
        {loading ? (
          <div className="py-20 text-center text-teal-400">Loading quotations pipeline...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Quotations Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Generate a new quotation using our dynamic actuarial engine to get started.
            </p>
            <Link
              to="/quote-generator"
              className="inline-flex px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Generate First Quote
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Quote #</th>
                    <th className="p-4">Annuitant</th>
                    <th className="p-4">Plan & Option</th>
                    <th className="p-4">Premium</th>
                    <th className="p-4">Guaranteed Annuity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredQuotes.map((q) => {
                    const snap = q.calculation_result_snapshot || {};
                    const benefits = snap.benefits || {};
                    const config = snap.configuration || {};

                    return (
                      <tr key={q.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-teal-400">
                          {q.quote_number}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-white block">{q.customer_name}</span>
                          <span className="text-[11px] text-slate-500">{q.customer_age} Yrs • {q.customer_gender?.toUpperCase()}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-200 block">{q.insurance_plans?.name || 'Insurance Plan'}</span>
                          <span className="text-[11px] text-slate-500">{config.optionName || 'Standard'}</span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-white">
                          ₹{Number(q.premium_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 font-mono font-bold text-teal-400">
                          ₹{(benefits.totalYearlyAnnuity || 0).toLocaleString('en-IN')} / yr
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold rounded-full border border-teal-500/20 uppercase">
                            {q.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(q.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedQuoteForPdf({ ...snap, quote_number: q.quote_number, created_at: q.created_at })}
                              title="Download PDF"
                              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleWhatsApp(q)}
                              title="Dispatch via WhatsApp"
                              className="p-2 hover:bg-emerald-950/50 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCopyLink(q.share_token, q.id)}
                              title="Copy Share Link"
                              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-teal-400 transition-all"
                            >
                              {copiedId === q.id ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <Link
                              to={`/quotes/${q.id}`}
                              className="p-2 hover:bg-slate-800 rounded-lg text-teal-400 hover:text-teal-300 transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* PDF Modal */}
      {selectedQuoteForPdf && (
        <QuotePDFDocument
          quoteData={selectedQuoteForPdf}
          onClose={() => setSelectedQuoteForPdf(null)}
        />
      )}

    </div>
  );
}
