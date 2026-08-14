import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Phone, User, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, insurance_plans(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-teal-400 font-mono">Loading leads...</div>;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-teal-400 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-white">Lead & Inquiry Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">Captured leads from the Quote Generator & plan pages.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Interest / Plan</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{lead.customer_name}</p>
                        <p className="text-xs text-slate-400">Age: {lead.age} • {lead.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={`tel:${lead.mobile}`} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors">
                      <Phone className="w-4 h-4" /> {lead.mobile}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 font-medium">
                      {lead.insurance_plans?.name || 'General Inquiry'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                      {lead.status || 'New'}
                    </span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No leads captured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
