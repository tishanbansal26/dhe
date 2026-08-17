import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

const STATUS_CONFIGS = {
  active: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle2, label: 'Active' },
  approved: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle2, label: 'Approved' },
  settled: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', icon: CheckCircle2, label: 'Settled' },
  pending: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: Clock, label: 'Pending Review' },
  under_review: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: Clock, label: 'Under Review' },
  expired: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: AlertTriangle, label: 'Expired' },
  cancelled: { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', icon: XCircle, label: 'Cancelled' },
  rejected: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: XCircle, label: 'Rejected' },
  new: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Clock, label: 'New' },
  contacted: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', icon: Clock, label: 'Contacted' },
  converted: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle2, label: 'Converted' }
};

export default function StatusBadge({ status = 'pending', customLabel = null, showIcon = true, size = 'md' }) {
  const normalized = String(status).toLowerCase().replace(/\s+/g, '_');
  const config = STATUS_CONFIGS[normalized] || {
    bg: 'bg-slate-800',
    border: 'border-slate-700',
    text: 'text-slate-300',
    icon: ShieldAlert,
    label: status
  };

  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.border} ${config.text} ${sizeClasses}`}>
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {customLabel || config.label}
    </span>
  );
}
