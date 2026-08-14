import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Lock, User, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithOtp, resetPassword } = useAuth();
  
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('portal.');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    try {
      const authData = await login(email, password);
      
      // Fetch user role to determine redirect
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();
        
      const role = userData?.role || authData.user.user_metadata?.role || 'customer';
      
      if (['admin', 'super_admin'].includes(role)) {
        if (isAdminSubdomain) {
          navigate('/');
        } else {
          navigate('/admin');
        }
      } else if (role === 'agent' || role === 'staff') {
        if (isAdminSubdomain) {
          // If they somehow login as agent on admin subdomain, redirect them out
          window.location.href = `https://${window.location.hostname.replace('admin.', '')}/employee`;
        } else {
          navigate('/employee');
        }
      } else {
        if (isAdminSubdomain) {
          // If they somehow login as customer on admin subdomain, redirect them out
          window.location.href = `https://${window.location.hostname.replace('admin.', '')}/dashboard`;
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setResetMessage('Password reset instructions sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{isAdminSubdomain ? 'Admin Portal Login' : 'Login / Sign In'} | Radhe Investments</title>
        <meta name="description" content="Secure login for Radhe Investments customers, advisors and administrators." />
      </Helmet>
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 md:p-10 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Lock className="w-8 h-8 text-navy-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{isAdminSubdomain ? 'Admin Login' : 'Welcome Back'}</h1>
          <p className="text-sm text-gray-400">Please authenticate to continue.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <span>{resetMessage}</span>
          </div>
        )}

        {otpSent && (
          <div className="mb-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm text-center">
            <strong>Check your email!</strong> A magic link has been sent to {email}.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                id="email"
                name="email"
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder={isAdminSubdomain ? "admin@radheinv.site" : "agent@radheinvest.com"}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <button 
                type="button" 
                onClick={handleResetPassword}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
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
                className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full glow-button bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center"
          >
            {loading ? 'Authenticating...' : 'Sign In with Password'}
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <button 
            type="button" 
            onClick={async () => {
              if (!email) {
                setError('Please enter your email address first.');
                return;
              }
              setError('');
              setLoading(true);
              try {
                await loginWithOtp(email);
                setOtpSent(true);
                setResetMessage('');
              } catch (err) {
                setError(err.message || 'Failed to send magic link.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center"
          >
            Send Magic Link / OTP
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
