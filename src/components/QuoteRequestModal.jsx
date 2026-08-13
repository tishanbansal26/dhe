import React, { useState } from 'react';
import { X, Send, Phone, User, MapPin, Building, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function QuoteRequestModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    insurance_type: 'Health Insurance',
    age: '',
    city: '',
    contact_method: 'Phone Call',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('leads').insert([{
        name: formData.name,
        phone: formData.phone,
        plan_interest: formData.insurance_type,
        status: 'new',
        // In a real schema we might add age, city, contact_method if columns exist
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Request a Quote</h2>
          <p className="text-gray-400 text-sm mb-6">Our advisors will contact you shortly with personalized options.</p>

          {success ? (
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">Quote Requested!</h3>
              <p className="text-emerald-100/70 text-sm">We'll be in touch with you very soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-400 text-sm">{error}</p>}
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-teal-500" placeholder="John Doe" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mobile Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-teal-500" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Insurance Type</label>
                  <select value={formData.insurance_type} onChange={e => setFormData({...formData, insurance_type: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-teal-500 text-sm">
                    <option>Health Insurance</option>
                    <option>Term Life</option>
                    <option>Pension / Retirement</option>
                    <option>Child Plan</option>
                    <option>Critical Illness</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-8 pr-3 py-2.5 text-white focus:outline-none focus:border-teal-500 text-sm" placeholder="Mansa" />
                  </div>
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                {loading ? 'Submitting...' : 'Request My Quote'} <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
