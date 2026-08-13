import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LeadCaptureModal({ isOpen, onClose, planInterest = 'General', productId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [coverageType, setCoverageType] = useState('individual'); // individual, family
  const [coverageAmount, setCoverageAmount] = useState('500000');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Strict Input Validation
    if (!name || name.trim().length < 2) {
      setError('Please enter a valid full name.');
      setLoading(false);
      return;
    }
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }
    if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      setLoading(false);
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      setError('Age must be between 18 and 99.');
      setLoading(false);
      return;
    }
    if (!gender || !['male', 'female'].includes(gender)) {
      setError('Please select a valid gender.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('leads').insert([
        {
          name: name.trim(),
          age: ageNum,
          gender,
          phone,
          pincode,
          plan_interest: planInterest,
          product_id: productId || null,
          status: 'new'
        }
      ]);

      if (insertError) throw insertError;

      setStep(4); // Success step
      setTimeout(() => {
        onClose();
        setStep(1);
        setAge(''); setGender(''); setPhone(''); setPincode(''); setName('');
      }, 3000);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 4 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Quote Requested!</h3>
            <p className="text-gray-400">An advisor will connect with you shortly regarding the {planInterest} plan.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500">
                <span className={step >= 1 ? 'text-teal-400' : ''}>Coverage</span>
                <span className={step >= 2 ? 'text-teal-400' : ''}>Profile</span>
                <span className={step >= 3 ? 'text-teal-400' : ''}>Contact</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-500 h-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Get Your Quote</h3>
              <p className="text-gray-400 text-sm">Personalize your {planInterest} quote.</p>
            </div>

            {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}

            <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-4">
              
              {/* Step 1: Coverage */}
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Who do you want to insure?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setCoverageType('individual')} className={`py-3 rounded-xl border text-sm font-bold transition-colors ${coverageType === 'individual' ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-gray-500'}`}>
                        Self
                      </button>
                      <button type="button" onClick={() => setCoverageType('family')} className={`py-3 rounded-xl border text-sm font-bold transition-colors ${coverageType === 'family' ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-gray-500'}`}>
                        Family
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Required Coverage (₹)</label>
                    <select value={coverageAmount} onChange={(e)=>setCoverageAmount(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500">
                      <option value="500000">₹5 Lakhs</option>
                      <option value="1000000">₹10 Lakhs</option>
                      <option value="2500000">₹25 Lakhs</option>
                      <option value="5000000">₹50 Lakhs</option>
                      <option value="10000000">₹1 Crore</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Profile */}
              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-400 mb-1">Age of Eldest Member</label>
                    <input id="age" name="age" type="number" required min="18" max="99" value={age} onChange={(e)=>setAge(e.target.value)} placeholder="e.g. 30" className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                    <select id="gender" name="gender" required value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input id="fullName" name="fullName" type="text" required value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Mobile Number</label>
                    <input id="phone" name="phone" type="tel" required pattern="[0-9]{10}" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Enter 10-digit number" className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-400 mb-1">Pincode</label>
                    <input id="pincode" name="pincode" type="text" required pattern="[0-9]{6}" value={pincode} onChange={(e)=>setPincode(e.target.value)} placeholder="e.g. 400001" className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button type="button" onClick={handlePrev} className="w-1/3 flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                )}
                <button type="submit" disabled={loading} className={`${step > 1 ? 'w-2/3' : 'w-full'} flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] disabled:opacity-50`}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 3 ? 'Get Quote' : 'Continue'}
                  {!loading && step < 3 && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>
            {step === 3 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our Terms of Use and Privacy Policy.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
