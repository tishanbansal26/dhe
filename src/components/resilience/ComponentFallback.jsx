import React from 'react';
import { AlertCircle, RefreshCw, PhoneCall, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComponentFallback({
  componentName = 'Feature',
  message = null,
  onRetry = null,
  actionLabel = 'Contact Support',
  actionUrl = '/#contact'
}) {
  return (
    <div className="w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-lg backdrop-blur-sm">
      <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="max-w-md mx-auto space-y-1.5">
        <h4 className="text-base sm:text-lg font-bold text-white">
          {componentName} is temporarily unavailable
        </h4>
        <p className="text-xs sm:text-sm text-slate-400">
          {message || 'Your saved data and account remain completely safe. The rest of the platform is fully operational.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        )}
        
        {actionUrl.startsWith('http') || actionUrl.startsWith('tel:') ? (
          <a
            href={actionUrl}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5" /> {actionLabel}
          </a>
        ) : (
          <Link
            to={actionUrl}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            {actionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
