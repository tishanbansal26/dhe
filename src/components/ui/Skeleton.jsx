import React from 'react';

export function Skeleton({ className = '', variant = 'default' }) {
  const baseClasses = 'animate-pulse bg-slate-800/80 rounded-xl';
  
  if (variant === 'circle') {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }
  
  if (variant === 'text') {
    return <div className={`${baseClasses} h-4 w-3/4 rounded-md ${className}`} />;
  }

  return <div className={`${baseClasses} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
      <div className="pt-4 border-t border-slate-800/80 flex justify-between">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-slate-800/50 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-slate-800/70 rounded-md w-full" />
        </td>
      ))}
    </tr>
  );
}
