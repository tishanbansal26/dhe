import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UploadCloud, Search, CheckCircle, ArrowRight, Layers, Link as LinkIcon, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import ProgressDashboard from '../components/admin/ai-builder/ProgressDashboard';

export default function ProductBuilderAI() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // 'input', 'processing'
  const [loading, setLoading] = useState(false);
  
  // Inputs
  const [productName, setProductName] = useState('');
  const [insurer, setInsurer] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState([]);
  const [files, setFiles] = useState([]);

  const [importId, setImportId] = useState(null);

  const handleAddUrl = () => {
    if (urlInput && !urls.includes(urlInput)) {
      setUrls([...urls, urlInput]);
      setUrlInput('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleStartResearch = async () => {
    if (!productName && files.length === 0 && urls.length === 0) {
      toast.error('Please provide a product name, URL, or upload a document.');
      return;
    }
    setLoading(true);

    try {
      // 1. Create product_ai_imports record
      const { data: importData, error: importError } = await supabase
        .from('product_ai_imports')
        .insert([{
          input_product_name: productName,
          input_insurer: insurer,
          input_urls: urls,
          total_documents: files.length,
          status: 'QUEUED'
        }])
        .select()
        .single();

      if (importError) throw importError;
      
      const newImportId = importData.id;
      setImportId(newImportId);

      // 2. Upload files to product_documents bucket
      if (files.length > 0) {
        toast.loading('Uploading documents...', { id: 'upload' });
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${newImportId}/${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product_documents')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;

          // Record document metadata
          await supabase.from('product_documents').insert([{
            import_id: newImportId,
            file_name: file.name,
            file_type: file.type,
            file_url: fileName
          }]);
        }
        toast.success('Documents uploaded', { id: 'upload' });
      }

      // 3. Trigger orchestrator
      const { data: orchestratorData, error: orchestratorError } = await supabase.functions.invoke('ai-product-orchestrator', {
        body: { import_id: newImportId }
      });

      if (orchestratorError) throw orchestratorError;

      // Move to progress UI
      setStep('processing');

    } catch (err) {
      console.error(err);
      toast.error('Failed to start AI Research: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing' && importId) {
    return <ProgressDashboard importId={importId} onReview={() => navigate(`/admin/ai-builder/review/${importId}`)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>Create Product with AI - Radhe Investments</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Create Insurance Product with AI
          </span>
          <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-sm rounded-full border border-teal-500/20">
            BETA
          </span>
        </h1>
        <p className="text-slate-400 mt-2">
          Provide any combination of product name, URLs, or documents. The AI will research, extract, and structure the entire product for your review.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-400" />
            Option A: Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Sampoorna Raksha Promise"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Insurer (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Tata AIA Life"
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-teal-400" />
            Option B: Official URLs
          </h2>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://official-insurer.com/product"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <button onClick={handleAddUrl} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium">
              Add
            </button>
          </div>
          {urls.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300">
                  <span className="truncate max-w-[200px]">{url}</span>
                  <button onClick={() => setUrls(urls.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            Option C: Document Upload
          </h2>
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="ai-docs-upload"
            />
            <label htmlFor="ai-docs-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
              <span className="text-slate-300 font-medium mb-1">Click to upload multiple documents</span>
              <span className="text-sm text-slate-500">Supports PDF, DOCX, PNG, JPG</span>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-300">
                  <span className="truncate flex-1">{file.name}</span>
                  <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400 ml-2">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleStartResearch}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Starting AI Research...' : 'Research & Build Product'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
