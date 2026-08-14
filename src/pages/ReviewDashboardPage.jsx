import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, X, Edit2, Shield, Search, ArrowRight, Save, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

export default function ReviewDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [importJob, setImportJob] = useState(null);
  const [extractions, setExtractions] = useState([]);
  
  // Field approval state: map of extraction ID to { status: 'APPROVED' | 'REJECTED' | 'EDITED', value: string }
  const [fieldStates, setFieldStates] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: job, error: jobError } = await supabase
        .from('product_ai_imports')
        .select('*')
        .eq('id', id)
        .single();
      if (jobError) throw jobError;
      setImportJob(job);

      const { data: ext, error: extError } = await supabase
        .from('product_ai_extractions')
        .select('*')
        .eq('import_id', id)
        .order('field_path');
      if (extError) throw extError;
      
      setExtractions(ext || []);
      
      // Initialize field states (default to APPROVED for high confidence extractions)
      const initialStates = {};
      (ext || []).forEach(f => {
        initialStates[f.id] = { 
          status: (f.verification_status === 'APPROVED' || f.verification_status === 'AI_EXTRACTED' || (f.confidence && f.confidence >= 70)) ? 'APPROVED' : 'PENDING', 
          value: f.value 
        };
      });
      setFieldStates(initialStates);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const updateFieldState = (extId, status, newValue = null) => {
    setFieldStates(prev => ({
      ...prev,
      [extId]: { ...prev[extId], status, value: newValue !== null ? newValue : prev[extId].value }
    }));
  };

  const handleApproveAll = () => {
    const approved = {};
    extractions.forEach(ext => {
      approved[ext.id] = {
        ...fieldStates[ext.id],
        status: 'APPROVED'
      };
    });
    setFieldStates(approved);
    toast.success('All fields marked as approved!');
  };

  const handlePublish = async () => {
    toast.loading('Saving product draft...', { id: 'publish' });
    try {
      // Reconstruct payload strictly matching insurance_plans schema
      const payload = {
        name: importJob?.input_product_name || 'Insurance Product Draft',
        company_id: null,
        category: 'Health', // Default fallback
        status: 'draft',
        active: true,
        coverage: {},
        eligibility: {},
        premium_data: {},
        benefits: [],
        waiting_periods: [],
        exclusions: [],
        faqs: [],
        metadata: {
          highlights: [],
          image_keywords: '',
          ai_import_id: id
        }
      };

      const highlightsList = [];
      let imageKeywords = '';

      extractions.forEach(ext => {
        const state = fieldStates[ext.id];
        if (!state || state.status === 'REJECTED') return;
        
        let parsedVal;
        try { parsedVal = JSON.parse(state.value); } catch(e) { parsedVal = state.value; }
        
        const path = ext.field_path;
        if (path === 'name') payload.name = parsedVal;
        else if (path === 'category') payload.category = parsedVal;
        else if (path === 'description') payload.description = parsedVal;
        else if (path === 'image_keywords') imageKeywords = parsedVal;
        else if (path.startsWith('coverage.')) payload.coverage[path.split('.')[1]] = parsedVal;
        else if (path.startsWith('eligibility.')) payload.eligibility[path.split('.')[1]] = parsedVal;
        else if (path.startsWith('premium_data.')) payload.premium_data[path.split('.')[1]] = parsedVal;
        else if (path.startsWith('benefits[')) payload.benefits.push(parsedVal);
        else if (path.startsWith('waiting_periods[')) payload.waiting_periods.push(parsedVal);
        else if (path.startsWith('exclusions[')) payload.exclusions.push(parsedVal);
        else if (path.startsWith('highlights[')) highlightsList.push(parsedVal);
        else if (path.startsWith('faqs[')) payload.faqs.push(parsedVal);
      });

      payload.metadata = {
        highlights: highlightsList,
        image_keywords: imageKeywords,
        ai_import_id: id
      };

      const { data, error } = await supabase.from('insurance_plans').insert([payload]).select().single();
      if (error) throw error;

      await supabase.from('product_ai_imports').update({ status: 'APPROVED', product_id: data.id }).eq('id', id);

      toast.success('Product saved as draft!', { id: 'publish' });
      navigate(`/admin/product-builder/${data.id}`);

    } catch (err) {
      console.error(err);
      toast.error('Failed to save draft: ' + err.message, { id: 'publish' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-slate-400">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading AI extraction review data...</p>
      </div>
    );
  }

  const approvedCount = Object.values(fieldStates).filter(s => s.status === 'APPROVED' || s.status === 'EDITED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>AI Extraction Review - Radhe Investments</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        
        {/* Sticky Top Header Toolbar */}
        <div className="sticky top-20 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 mb-8 shadow-2xl flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              Review Extracted Plan Data
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Product: <span className="text-teal-400 font-semibold">{importJob?.input_product_name || 'Insurance Plan'}</span> | <span className="text-slate-300 font-medium">{approvedCount} of {extractions.length} Fields Approved</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleApproveAll}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-sm font-semibold transition-all hover:text-white"
            >
              <CheckCheck className="w-4 h-4 text-teal-400" />
              Approve All
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all text-sm"
            >
              <Save className="w-4 h-4" /> Save Draft & Continue
            </button>
          </div>
        </div>

        {/* Extraction List */}
        <div className="space-y-4">
          {extractions.map(ext => {
            const state = fieldStates[ext.id] || { status: 'APPROVED', value: ext.value };
            const isHighConfidence = ext.confidence && ext.confidence >= 80;
            
            return (
              <div 
                key={ext.id} 
                className={`bg-slate-900/80 backdrop-blur-sm border ${
                  state.status === 'APPROVED' ? 'border-teal-500/40 bg-teal-950/10' :
                  state.status === 'EDITED' ? 'border-blue-500/50 bg-blue-950/10' :
                  state.status === 'REJECTED' ? 'border-rose-500/30 opacity-60 bg-rose-950/10' :
                  'border-yellow-500/50 bg-yellow-950/10'
                } p-5 rounded-2xl transition-all shadow-md`}
              >
                <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono bg-slate-950 text-teal-300 px-3 py-1 rounded-lg border border-slate-700">
                      {ext.field_path}
                    </span>
                    {ext.confidence && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        isHighConfidence ? 'bg-teal-500/15 text-teal-400 border-teal-500/30' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {ext.confidence}% Confidence
                      </span>
                    )}
                    {ext.source_type && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                        {ext.source_type === 'OFFICIAL_INSURER' ? <Search className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {ext.source_type}
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => updateFieldState(ext.id, 'APPROVED')}
                      title="Approve field"
                      className={`p-2 rounded-lg transition-colors ${state.status === 'APPROVED' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const edited = prompt('Edit value (JSON format if object/array):', state.value);
                        if (edited !== null) updateFieldState(ext.id, 'EDITED', edited);
                      }}
                      title="Edit field value"
                      className={`p-2 rounded-lg transition-colors ${state.status === 'EDITED' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateFieldState(ext.id, 'REJECTED')}
                      title="Reject field"
                      className={`p-2 rounded-lg transition-colors ${state.status === 'REJECTED' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <pre className="text-slate-200 font-mono text-xs sm:text-sm whitespace-pre-wrap">
                    {state.value}
                  </pre>
                </div>

                {ext.source_snippet && (
                  <div className="mt-3 text-xs text-slate-400 italic border-l-2 border-slate-600 pl-3">
                    "{ext.source_snippet}"
                    {ext.source_url && <span className="ml-2 not-italic text-blue-400">({ext.source_url})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Bottom Save Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md border border-teal-500/40 rounded-2xl py-3 px-6 shadow-2xl shadow-teal-500/20 flex items-center gap-4">
          <div className="text-sm text-slate-300 hidden sm:block">
            <span className="text-teal-400 font-bold">{approvedCount}</span> of {extractions.length} fields approved
          </div>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all text-sm"
          >
            <Save className="w-4 h-4" /> Save Draft & Open Builder
          </button>
        </div>

      </div>
    </div>
  );
}

