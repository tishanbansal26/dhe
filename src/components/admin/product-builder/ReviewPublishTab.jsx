import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export default function ReviewPublishTab({ data }) {
  // Pre-publish checklist verification
  const checks = [
    {
      id: 'name',
      label: 'Product Name',
      description: 'The display name of the product',
      passed: !!data.name && data.name.trim().length > 0
    },
    {
      id: 'company',
      label: 'Insurer Company',
      description: 'The insurance company offering this product',
      passed: !!data.company_id
    },
    {
      id: 'category',
      label: 'Product Category',
      description: 'The classification (e.g. Health, Life)',
      passed: !!data.category
    },
    {
      id: 'description',
      label: 'Description',
      description: 'Detailed description or highlights',
      passed: !!data.description && data.description.trim().length > 10
    },
    {
      id: 'coverage',
      label: 'Coverage Details',
      description: 'At least one coverage limit defined',
      passed: !!data.coverage && Object.keys(data.coverage).length > 0
    }
  ];

  const allPassed = checks.every(c => c.passed);
  const issuesCount = checks.filter(c => !c.passed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-white">Review & Publish</h2>
        <p className="text-sm text-gray-400">Ensure all required information is provided before publishing.</p>
      </div>

      <div className={`glass-panel p-6 rounded-2xl border ${allPassed ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'} flex items-start gap-4`}>
        {allPassed ? (
          <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-1" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
        )}
        <div>
          <h3 className={`text-lg font-medium ${allPassed ? 'text-green-400' : 'text-amber-400'}`}>
            {allPassed ? 'Ready to Publish' : 'Cannot Publish - Missing Information'}
          </h3>
          <p className="text-slate-300 mt-1">
            {allPassed 
              ? 'All required fields are completed. You can safely publish this product.' 
              : `There are ${issuesCount} issues to resolve before this product can be published.`}
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Pre-Publish Checklist</h3>
        
        {checks.map(check => (
          <div key={check.id} className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            {check.passed ? (
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${check.passed ? 'text-white' : 'text-red-400'}`}>{check.label}</p>
              <p className="text-sm text-slate-400 mt-0.5">{check.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
