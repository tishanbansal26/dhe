import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { PolicyExtractionService } from '../../../lib/services/PolicyExtractionService';
import toast from 'react-hot-toast';

export default function AiImportWorkspace({ onExtractionComplete }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('upload'); // upload -> processing -> review
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const startExtraction = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStep('processing');
    
    try {
      // Simulate chunk processing
      await PolicyExtractionService.processJob(file, (pct) => {
        setProgress(pct);
      });

      // Get final extraction
      const extractedData = await PolicyExtractionService.extractFromDocument(file);
      
      // Let parent handle the data
      onExtractionComplete(extractedData);
      
    } catch (error) {
      toast.error('AI Extraction failed: ' + error.message);
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">AI Policy Import</h2>
        <p className="text-gray-400">Upload a PDF brochure or policy wording to automatically extract structured insurance data.</p>
      </div>

      {step === 'upload' && (
        <div className="space-y-6 animate-fade-in">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 rounded-3xl p-12 text-center hover:bg-slate-800/50 hover:border-teal-500/50 transition-all cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {file ? file.name : 'Click or drag PDF to upload'}
            </h3>
            <p className="text-sm text-gray-400">Supports PDF, DOCX, and JPG (Max 50MB)</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.docx,.jpg,.png" 
            />
          </div>

          {file && (
            <button 
              onClick={startExtraction}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-colors flex items-center justify-center gap-2"
            >
              Analyze Document with AI <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center space-y-8 animate-fade-in py-12">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="8" 
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-white">{progress}%</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Policy Document...</h3>
            <p className="text-teal-400/80 text-sm max-w-md mx-auto">
              Extracting coverage limits, waiting periods, exclusions, and structured premiums. This may take a minute.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
