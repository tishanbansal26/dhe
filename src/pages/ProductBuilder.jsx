import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, Eye, CheckCircle, UploadCloud, Shield, Check, AlertTriangle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import OverviewTab from '../components/admin/product-builder/OverviewTab';
import CoverageTab from '../components/admin/product-builder/CoverageTab';
import EligibilityTab from '../components/admin/product-builder/EligibilityTab';
import WaitingPeriodsTab from '../components/admin/product-builder/WaitingPeriodsTab';
import ExclusionsTab from '../components/admin/product-builder/ExclusionsTab';
import AiImportWorkspace from '../components/admin/product-builder/AiImportWorkspace';
import MediaDocsTab from '../components/admin/product-builder/MediaDocsTab';
import ReviewPublishTab from '../components/admin/product-builder/ReviewPublishTab';

export default function ProductBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [productData, setProductData] = useState({
    name: '',
    company_id: '',
    category: 'Health',
    type: '',
    status: 'draft',
    description: '',
    coverage: {},
    eligibility: {},
    premium_data: {},
    benefits: [],
    waiting_periods: [],
    exclusions: [],
    faqs: [],
    ai_metadata: {},
    active: true
  });

  useEffect(() => {
    fetchCompanies();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('insurance_companies').select('*').order('name');
    if (data) setCompanies(data);
  };

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('insurance_plans').select('*').eq('id', id).single();
    if (data) {
      setProductData({
        ...productData,
        ...data,
        coverage: data.coverage || {},
        eligibility: data.eligibility || {},
        premium_data: data.premium_data || {},
        benefits: data.benefits || [],
        waiting_periods: data.waiting_periods || [],
        exclusions: data.exclusions || [],
        faqs: data.faqs || [],
        ai_metadata: data.ai_metadata || {}
      });
    }
    setLoading(false);
  };

  const saveProduct = async (statusOverride = null) => {
    setIsSaving(true);
    const payload = {
      ...productData,
      status: statusOverride || productData.status
    };

    let result;
    if (id) {
      result = await supabase.from('insurance_plans').update(payload).eq('id', id).select().single();
    } else {
      result = await supabase.from('insurance_plans').insert([payload]).select().single();
    }

    if (result.error) {
      toast.error('Failed to save product: ' + result.error.message);
    } else {
      toast.success(statusOverride === 'published' ? 'Product published!' : 'Draft saved successfully');
      setProductData({ ...productData, ...result.data, id: result.data.id });
      if (!id && result.data.id) {
        navigate(`/admin/product-builder/${result.data.id}`, { replace: true });
      }
    }
    setIsSaving(false);
  };

  const handleAiExtraction = (extractedData) => {
    setProductData((prev) => ({
      ...prev,
      ...extractedData
    }));
    toast.success('AI data imported successfully! Please review the fields.');
    setActiveTab('overview');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'coverage', label: 'Coverage Limits' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'waiting_periods', label: 'Waiting Periods' },
    { id: 'exclusions', label: 'Exclusions' },
    { id: 'docs', label: 'Media & Documents' },
    { id: 'review', label: 'Review & Publish' },
    { id: 'ai', label: 'AI Import', icon: <UploadCloud className="w-4 h-4 ml-2" /> }
  ];

  if (loading) return <div className="p-8 text-center text-teal-400">Loading Product...</div>;

  return (
    <div className="min-h-screen bg-navy-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg" title="Back to Plans">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-3">
                {productData.name || 'Untitled Product'}
                <span className={`text-xs px-2 py-0.5 rounded-full border ${productData.status === 'published' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-gold-500/10 text-gold-400 border-gold-500/30'}`}>
                  {productData.status.toUpperCase()}
                </span>
              </h1>
              <p className="text-sm text-gray-400">Policy Product Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => saveProduct()} 
              disabled={isSaving}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 hover:bg-slate-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 text-sm font-medium flex items-center gap-2 transition-colors">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={() => saveProduct('published')} 
              disabled={isSaving}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Publish Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-3">
          <div className="glass-panel border border-slate-700 rounded-2xl overflow-hidden sticky top-28">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <h3 className="font-semibold text-white">Sections</h3>
            </div>
            <div className="flex flex-col p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center transition-colors ${activeTab === tab.id ? 'bg-teal-500/10 text-teal-400' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`}
                >
                  {tab.label}
                  {tab.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="md:col-span-9">
          <div className="glass-panel border border-slate-700 rounded-3xl p-8 min-h-[600px]">
            {activeTab === 'overview' && (
              <OverviewTab data={productData} updateData={(d) => setProductData({...productData, ...d})} companies={companies} />
            )}
            {activeTab === 'coverage' && (
              <CoverageTab data={productData} updateData={(d) => setProductData({...productData, ...d})} />
            )}
            {activeTab === 'eligibility' && (
              <EligibilityTab data={productData} updateData={(d) => setProductData({...productData, ...d})} />
            )}
            {activeTab === 'waiting_periods' && (
              <WaitingPeriodsTab data={productData} updateData={(d) => setProductData({...productData, ...d})} />
            )}
            {activeTab === 'exclusions' && (
              <ExclusionsTab data={productData} updateData={(d) => setProductData({...productData, ...d})} />
            )}
            {activeTab === 'docs' && (
              <MediaDocsTab data={productData} updateData={(d) => setProductData({...productData, ...d})} />
            )}
            {activeTab === 'review' && (
              <ReviewPublishTab data={productData} />
            )}
            {activeTab === 'ai' && (
              <AiImportWorkspace productId={id} onExtractionComplete={handleAiExtraction} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
