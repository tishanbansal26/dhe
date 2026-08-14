import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, X, Edit2, Shield, Search, ArrowRight, Save } from 'lucide-react';
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
      
      // Initialize field states
      const initialStates = {};
      (ext || []).forEach(f => {
        initialStates[f.id] = { status: f.verification_status === 'AI_EXTRACTED' ? 'APPROVED' : 'PENDING', value: f.value };
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

  const handlePublish = async () => {
    toast.loading('Publishing product draft...', { id: 'publish' });
    try {
      // Reconstruct the JSON payload from approved/edited fields
      const payload = {
        name: importJob.input_product_name,
        company_id: null,
        category: 'Health', // Default fallback
        status: 'draft',
        coverage: {},
        eligibility: {},
        premium_data: {},
        benefits: [],
        waiting_periods: [],
        exclusions: [],
        highlights: [],
        faqs: []
      };

      extractions.forEach(ext => {
        const state = fieldStates[ext.id];
        if (state.status === 'REJECTED' || state.status === 'PENDING') return;
        
        let parsedVal;
        try { parsedVal = JSON.parse(state.value); } catch(e) { parsedVal = state.value; }
        
        const path = ext.field_path;
        if (path === 'name') payload.name = parsedVal;
        else if (path === 'category') payload.category = parsedVal;
        else if (path === 'description') payload.description = parsedVal;
        else if (path === 'image_keywords') payload.image_keywords = parsedVal;
        else if (path.startsWith('coverage.')) payload.coverage[path.split('.')[1]] = parsedVal;
        else if (path.startsWith('eligibility.')) payload.eligibility[path.split('.')[1]] = parsedVal;
        else if (path.startsWith('premium_data.')) payload.premium_data[path.split('.')[1]] = parsedVal;
        else if (path.startsWith('benefits[')) payload.benefits.push(parsedVal);
        else if (path.startsWith('waiting_periods[')) payload.waiting_periods.push(parsedVal);
        else if (path.startsWith('exclusions[')) payload.exclusions.push(parsedVal);
        else if (path.startsWith('highlights[')) payload.highlights.push(parsedVal);
        else if (path.startsWith('faqs[')) payload.faqs.push(parsedVal);
      });

      const { data, error } = await supabase.from('insurance_plans').insert([payload]).select().single();
      if (error) throw error;

      await supabase.from('product_ai_imports').update({ status: 'APPROVED' }).eq('id', id);

      toast.success('Product saved as draft!', { id: 'publish' });
      navigate(`/admin/product-builder/${data.id}`);

    } catch (err) {
      console.error(err);
      toast.error('Failed to publish: ' + err.message, { id: 'publish' });
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading extraction data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>AI Extraction Review - Radhe Investments</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Review Extracted Data
          </h1>
          <p className="text-slate-400 mt-2">
            Product: {importJob?.input_product_name || 'Unknown'} | Extracted Fields: {extractions.length}
          </p>
        </div>
        <button
          onClick={handlePublish}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
        >
          <Save className="w-5 h-5" /> Save Draft & Continue
        </button>
      </div>

      <div className="space-y-4">
        {extractions.map(ext => {
          const state = fieldStates[ext.id];
          const isHighConfidence = ext.confidence && ext.confidence >= 80;
          
          return (
            <div key={ext.id} className={`bg-slate-800/50 backdrop-blur-sm border ${state.status === 'PENDING' ? 'border-yellow-500/50' : 'border-slate-700'} p-5 rounded-xl transition-colors`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono bg-slate-900 text-slate-300 px-3 py-1 rounded border border-slate-700">
                    {ext.field_path}
                  </span>
                  {ext.confidence && (
                    <span className={`text-xs px-2 py-1 rounded font-bold ${isHighConfidence ? 'bg-teal-500/10 text-teal-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {ext.confidence}% Confidence
                    </span>
                  )}
                  {ext.source_type && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 flex items-center gap-1">
                      {ext.source_type === 'OFFICIAL_INSURER' ? <Search className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {ext.source_type}
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFieldState(ext.id, 'APPROVED')}
                    className={`p-2 rounded-lg transition-colors ${state.status === 'APPROVED' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const edited = prompt('Edit value (JSON format if object/array):', state.value);
                      if (edited !== null) updateFieldState(ext.id, 'EDITED', edited);
                    }}
                    className={`p-2 rounded-lg transition-colors ${state.status === 'EDITED' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateFieldState(ext.id, 'REJECTED')}
                    className={`p-2 rounded-lg transition-colors ${state.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
                  {state.value}
                </pre>
              </div>

              {ext.source_snippet && (
                <div className="mt-3 text-sm text-slate-500 italic border-l-2 border-slate-600 pl-3">
                  " {ext.source_snippet} "
                  {ext.source_url && <span className="ml-2 not-italic text-blue-400 text-xs">({ext.source_url})</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
