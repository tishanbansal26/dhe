import React from 'react';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActionableEmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are currently no records available in this section.',
  actionLabel = null,
  actionUrl = null,
  onAction = null
}) {
  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center space-y-4">
      <div className="w-14 h-14 bg-slate-800/80 border border-slate-700/60 text-slate-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-7 h-7" />
      </div>

      <div className="max-w-md mx-auto space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-white">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-400">{description}</p>
      </div>

      {(actionLabel && (actionUrl || onAction)) && (
        <div className="pt-2">
          {onAction ? (
            <button
              onClick={onAction}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/10 inline-flex items-center gap-2"
            >
              {actionLabel} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to={actionUrl}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/10 inline-flex items-center gap-2"
            >
              {actionLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
