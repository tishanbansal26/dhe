import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2, ArrowRight, ShieldAlert, FileSearch } from 'lucide-react';
import { PolicyExtractionService } from '../../../lib/services/PolicyExtractionService';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export default function AiImportWorkspace({ productId, onExtractionComplete }) {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [step, setStep] = useState('upload'); // upload -> processing -> review
  const [importJob, setImportJob] = useState(null);
  const [extractions, setExtractions] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let channel;
    if (importJob?.id && step === 'processing') {
      // Listen to Realtime updates for the job status
      channel = supabase
        .channel(`import-${importJob.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'product_ai_imports', filter: `id=eq.${importJob.id}` },
          (payload) => {
            const newStatus = payload.new.status;
            setProgressMsg(`Status: ${newStatus}...`);
            if (newStatus === 'REVIEW_REQUIRED' || newStatus === 'COMPLETED') {
              fetchExtractions(importJob.id);
            } else if (newStatus === 'FAILED') {
              toast.error('AI Extraction failed on server.');
              setStep('upload');
              setIsProcessing(false);
            }
          }
        )
        .subscribe();
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [importJob, step]);

  const fetchExtractions = async (importId) => {
    const { data, error } = await supabase
      .from('product_ai_extractions')
      .select('*')
      .eq('import_id', importId)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Failed to load extractions');
      return;
    }

    setExtractions(data || []);
    setStep('review');
    setIsProcessing(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const startExtraction = async () => {
    if (!productId) {
      toast.error("Please click 'Save Draft' at the top before uploading documents.");
      return;
    }
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setStep('processing');
    setProgressMsg('Uploading documents...');
    
    try {
      const job = await PolicyExtractionService.processJob(files, productId, (pct, msg) => {
        setProgressMsg(msg);
      });
      setImportJob(job);
    } catch (error) {
      toast.error('AI Extraction failed: ' + error.message);
      setStep('upload');
      setIsProcessing(false);
    }
  };

  const applyExtractions = () => {
    // Convert flat extractions array into nested object
    const result = {};
    
    // Simplistic reconstruction for demo purposes - in production, deeper mapping needed
    extractions.forEach(ex => {
      if (ex.verification_status !== 'REJECTED') {
         let valueStr = ex.value;
         try { valueStr = JSON.parse(valueStr); } catch(e){}
         // We simply pass this to the parent to merge where it can
         result[ex.field_path] = valueStr;
      }
    });

    onExtractionComplete(result);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">AI Document Intelligence</h2>
        <p className="text-gray-400">Upload multiple PDF brochures, wordings, or illustrations to automatically extract structured insurance data.</p>
        {!productId && (
          <div className="mt-4 p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl text-gold-400 text-sm flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>You must save the product as a draft before importing documents.</span>
          </div>
        )}
      </div>

      {step === 'upload' && (
        <div className="space-y-6 animate-fade-in">
          <div 
            onClick={() => productId && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all group ${productId ? 'border-slate-600 hover:bg-slate-800/50 hover:border-teal-500/50 cursor-pointer' : 'border-slate-800 opacity-50 cursor-not-allowed'}`}
          >
            <div className={`w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 ${productId ? 'group-hover:scale-110' : ''} transition-transform`}>
              <UploadCloud className={`w-10 h-10 ${productId ? 'text-teal-400' : 'text-slate-600'}`} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {files.length > 0 ? `${files.length} file(s) selected` : 'Click or drag PDF to upload'}
            </h3>
            {files.length > 0 && (
              <ul className="text-sm text-teal-400 mt-2 mb-4 space-y-1">
                {files.map(f => <li key={f.name}>{f.name}</li>)}
              </ul>
            )}
            <p className="text-sm text-gray-400">Supports PDF, DOCX (Max 50MB per file)</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.docx"
              multiple
            />
          </div>

          {files.length > 0 && productId && (
            <button 
              onClick={startExtraction}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-colors flex items-center justify-center gap-2"
            >
              Analyze Documents with AI <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center space-y-8 animate-fade-in py-12">
          <div className="relative w-32 h-32 mx-auto">
             <Loader2 className="w-full h-full text-teal-500 animate-spin" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Documents Securely...</h3>
            <p className="text-teal-400/80 text-sm max-w-md mx-auto mb-4">
              {progressMsg}
            </p>
            <p className="text-gray-500 text-xs">Processing is running securely on the backend.</p>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-6 animate-fade-in">
           <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div className="flex items-center gap-3">
               <FileSearch className="w-6 h-6 text-teal-400" />
               <h3 className="text-lg font-bold text-white">AI Review Workspace</h3>
             </div>
             <div className="text-sm text-gray-400">
               {extractions.length} fields extracted
             </div>
           </div>

           <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {extractions.map((ex) => (
               <div key={ex.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors">
                  <div className="flex justify-between mb-2">
                    <code className="text-xs text-teal-400 bg-teal-400/10 px-2 py-1 rounded">{ex.field_path}</code>
                    {ex.confidence && (
                      <span className={`text-xs px-2 py-1 rounded font-bold ${ex.confidence >= 90 ? 'text-green-400 bg-green-400/10' : ex.confidence >= 75 ? 'text-gold-400 bg-gold-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {ex.confidence}% Confidence
                      </span>
                    )}
                  </div>
                  <div className="text-white mb-3">
                    {ex.value}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t border-slate-700 pt-3">
                    <div className="flex gap-4">
                      <span>Source: {ex.source_document || 'Document'}</span>
                      {ex.source_page && <span>Page: {ex.source_page}</span>}
                    </div>
                  </div>
               </div>
             ))}
           </div>

           <button 
              onClick={applyExtractions}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-colors flex items-center justify-center gap-2"
            >
              Approve & Merge Data <CheckCircle className="w-5 h-5" />
            </button>
        </div>
      )}
    </div>
  );
}
