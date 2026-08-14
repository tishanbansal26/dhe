import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { UserPlus, User, Lock, Mail, ShieldAlert } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const extraData = role === 'agent' ? { company_name: selectedCompanies, type: 'sub' } : {};
      const data = await signup(email, password, name, role, extraData);
      if (!data?.session) {
        // Supabase requires email verification
        setVerificationSent(true);
      } else {
        // Auto logged in
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Create an Account | Radhe Investments</title>
        <meta name="description" content="Sign up for Radhe Investments to manage insurance policies, file cashless claims and access expert financial advice." />
      </Helmet>
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-sm text-gray-400">Join Radhe Investments today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {verificationSent ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Check your email</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              We've sent a verification link to <strong>{email}</strong>. Please check your inbox to confirm your account.
            </p>
            <Link 
              to="/login"
              className="inline-block glow-button bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'customer' ? 'bg-teal-500 text-slate-900 shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'agent' ? 'bg-teal-500 text-slate-900 shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  Employee
                </button>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    id="password"
                    name="password"
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {role === 'agent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Companies Associated With</label>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-800/50 border border-slate-600 rounded-xl">
                    {[
                      "Tata AIA", "HDFC Life", "LIC", "Max Life", "SBI Life", "ICICI Prudential",
                      "Bajaj Allianz", "Kotak Life", "PNB MetLife", "Reliance Nippon", "Star Health",
                      "Niva Bupa", "Care Health", "Aditya Birla", "Other"
                    ].map(company => {
                      const isSelected = selectedCompanies.includes(company);
                      return (
                        <button
                          type="button"
                          key={company}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCompanies(selectedCompanies.filter(c => c !== company));
                            } else {
                              setSelectedCompanies([...selectedCompanies, company]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${isSelected ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' : 'bg-slate-700/50 text-gray-400 border-slate-600 hover:bg-slate-700'}`}
                        >
                          {company}
                        </button>
                      );
                    })}
                  </div>
                  {selectedCompanies.length === 0 && <p className="text-xs text-red-400 mt-2">Please select at least one company.</p>}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || (role === 'agent' && selectedCompanies.length === 0)}
                className="w-full glow-button bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  Log in here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
