import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { CheckCircle, Circle, Loader2, ArrowRight } from 'lucide-react';
import { executeAiExtraction } from '../../../lib/aiProductExtractor';

const STEPS = [
  { id: 'QUEUED', label: 'Queued' },
  { id: 'EXTRACTING', label: 'Researching Official Sources' },
  { id: 'PROCESSING', label: 'Reading Documents & Extracting Tables' },
  { id: 'VALIDATING', label: 'Cross-checking & Detecting Conflicts' },
  { id: 'REVIEW_REQUIRED', label: 'Ready for Review' }
];

export default function ProgressDashboard({ importId, onReview }) {
  const [status, setStatus] = useState('QUEUED');
  const isExecutingRef = useRef(false);

  useEffect(() => {
    // Initial fetch and auto-execution trigger
    const fetchStatusAndExecute = async () => {
      const { data } = await supabase.from('product_ai_imports').select('status').eq('id', importId).single();
      if (data && data.status) {
        setStatus(data.status);
        
        // If status is QUEUED and not yet executing, immediately run the AI extractor
        if ((data.status === 'QUEUED' || data.status === 'EXTRACTING' || data.status === 'RESEARCHING_WEB') && !isExecutingRef.current) {
          isExecutingRef.current = true;
          executeAiExtraction(importId, (newStatus) => {
            setStatus(newStatus);
          });
        }
      }
    };
    fetchStatusAndExecute();

    // Fallback polling every 2 seconds in case Realtime is disabled or blocked
    const interval = setInterval(async () => {
      const { data } = await supabase.from('product_ai_imports').select('status').eq('id', importId).single();
      if (data && data.status) {
        setStatus(data.status);
      }
    }, 2000);

    // Subscribe to changes (Realtime)
    const channel = supabase
      .channel(`import-${importId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'product_ai_imports', filter: `id=eq.${importId}` },
        (payload) => {
          if (payload.new && payload.new.status) {
            setStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [importId]);

  const isReady = status === 'REVIEW_REQUIRED' || status === 'COMPLETED' || status === 'APPROVED' || status === 'READY_FOR_REVIEW';

  const getCurrentStepIndex = () => {
    if (isReady) return 4;
    if (status === 'VALIDATING' || status === 'DETECTING_CONFLICTS') return 3;
    if (status === 'PROCESSING' || status === 'PROCESSING_DOCUMENTS') return 2;
    if (status === 'EXTRACTING' || status === 'RESEARCHING_WEB') return 1;
    return 0;
  };

  const currentIdx = getCurrentStepIndex();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">AI Research in Progress</h2>
        <p className="text-slate-400 mt-2">Please wait while the AI compiles your product draft.</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 max-w-lg mx-auto text-left">
        <div className="space-y-6">
          {STEPS.map((step, idx) => {
            const isCompleted = currentIdx > idx || isReady;
            const isCurrent = currentIdx === idx && !isReady;

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-teal-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <div className={`font-medium ${isCompleted ? 'text-teal-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isReady && (
        <div className="mt-8 animate-fade-in-up">
          <button
            onClick={onReview}
            className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all text-base animate-bounce"
          >
            Review Extracted Product
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
