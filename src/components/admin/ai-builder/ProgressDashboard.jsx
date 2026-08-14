import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { CheckCircle, Circle, Loader2, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 'QUEUED', label: 'Queued' },
  { id: 'RESEARCHING_WEB', label: 'Researching Official Sources' },
  { id: 'PROCESSING_DOCUMENTS', label: 'Reading Documents & Extracting Tables' },
  { id: 'DETECTING_CONFLICTS', label: 'Cross-checking & Detecting Conflicts' },
  { id: 'READY_FOR_REVIEW', label: 'Ready for Review' }
];

export default function ProgressDashboard({ importId, onReview }) {
  const [status, setStatus] = useState('QUEUED');

  useEffect(() => {
    // Initial fetch
    const fetchStatus = async () => {
      const { data } = await supabase.from('product_ai_imports').select('status').eq('id', importId).single();
      if (data) setStatus(data.status);
    };
    fetchStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`import-${importId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'product_ai_imports', filter: `id=eq.${importId}` },
        (payload) => {
          setStatus(payload.new.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [importId]);

  const getCurrentStepIndex = () => {
    return STEPS.findIndex(s => s.id === status);
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
            const isCompleted = currentIdx > idx || status === 'READY_FOR_REVIEW' || status === 'APPROVED' || status === 'PUBLISHED';
            const isCurrent = currentIdx === idx && status !== 'READY_FOR_REVIEW';

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

      {status === 'READY_FOR_REVIEW' && (
        <div className="mt-8 animate-fade-in-up">
          <button
            onClick={onReview}
            className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-teal-500/25 transition-all"
          >
            Review Extracted Product
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
