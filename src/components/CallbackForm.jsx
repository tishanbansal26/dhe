import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function CallbackForm() {
  const [isNRI, setIsNRI] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await supabase.from('insurance_plans').select('id, name');
      if (data) {
        setPlans(data);
      }
    } catch (e) {
      console.error('Failed to fetch plans', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !plan) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!acceptedTerms) {
      toast.error('Please accept the privacy policy to continue');
      return;
    }
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name,
        phone,
        email,
        plan_interest: plan,
        source: 'homepage_callback_form',
        description: `NRI: ${isNRI ? 'Yes' : 'No'}`,
        stage: 'new',
        status: 'new'
      });

      if (error) throw error;
      
      toast.success('Thank you! Our expert will call you shortly.');
      setName('');
      setPhone('');
      setEmail('');
      setPlan('');
      setIsNRI(false);
      setAcceptedTerms(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Looking to buy a new life insurance plan?
        </h2>
        <p className="text-gray-400">Our experts are happy to help you!</p>
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-rose-600 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            
            {/* NRI Toggle */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Are you an NRI?</label>
              <div className="flex bg-white/20 rounded-lg p-1 w-full">
                <button
                  type="button"
                  onClick={() => setIsNRI(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isNRI ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setIsNRI(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${!isNRI ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
                >
                  {!isNRI && <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                  No
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Mobile No */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Mobile No.</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-white/10 border border-r-0 border-white/20 text-white/80 rounded-l-lg">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile Number"
                  className="w-full bg-white/10 border border-l-0 border-white/20 text-white placeholder-white/60 rounded-r-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none [&>option]:bg-slate-800"
              >
                <option value="" disabled className="text-gray-400">Select plan</option>
                {plans.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
            
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-white/50 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-white/80 leading-relaxed cursor-pointer max-w-4xl">
                By submitting details, I accept Radhe Investment's Privacy Policy. Radhe Investments will send you updates on your policy, new products & services, insurance solutions or related information. A sales expert will call you to assist with your requirement.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto shrink-0 bg-white text-rose-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-lg transition-colors whitespace-nowrap disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Get a Call Back'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
