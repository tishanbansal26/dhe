import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title = "No Data Found", description = "Get started by creating a new record.", icon: Icon = PackageOpen, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-700/50 rounded-3xl bg-slate-900/20">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-sm">{description}</p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
