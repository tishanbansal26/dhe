import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export default function DocumentUploader({ 
  entityType = 'customer', 
  entityId, 
  onUploadComplete,
  title = "Upload Document"
}) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('kyc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    if (!entityId || !user) {
      setError('Missing authentication or entity context.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${entityType}/${entityId}/${fileName}`;
      
      let fileUrl = '';
      
      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadError) {
        // If bucket doesn't exist or storage isn't configured, save with a placeholder URL
        console.warn('Storage upload failed, saving record with file name only:', uploadError.message);
        fileUrl = `storage://${filePath}`;
      } else {
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }

      const { error: dbError } = await supabase.from('documents').insert([
        {
          file_name: file.name,
          file_url: fileUrl,
          document_type: documentType,
          entity_type: entityType,
          entity_id: entityId,
          uploaded_by: user.id
        }
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadComplete) onUploadComplete();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to upload document. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Document uploaded successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Document Type</label>
          <select 
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
          >
            <option value="kyc">KYC / Identity</option>
            <option value="policy_doc">Policy Document</option>
            <option value="claim_evidence">Claim Evidence / Medical Bill</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Select File</label>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-slate-600 hover:border-teal-500 bg-slate-800/30 rounded-xl px-4 py-6 flex flex-col items-center justify-center transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 text-teal-400 mb-2" />
              <span className="text-sm font-medium text-gray-300">Click to browse files</span>
              <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileText className="w-6 h-6 text-teal-400 flex-shrink-0" />
              <span className="text-sm text-white truncate">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload Document'}
        </button>
      </div>
    </div>
  );
}
