import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { UserPlus, User, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    document.title = 'Sign Up - Radhe Investments';
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signup(email, password, name, role);
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
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create an Account</h2>
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

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Account Role</label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="block w-full px-3 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full glow-button bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center"
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
