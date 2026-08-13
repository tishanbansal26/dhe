import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, LogOut, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileClaimsOpen, setIsMobileClaimsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user, agentProfile, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('portal.');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileClaimsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 glass-nav transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <TrendingUp className="text-navy-900 w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Radhe<span className="text-gold-400">Investments</span> {isAdminSubdomain && <span className="text-sm font-normal text-rose-400 ml-2 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded-full">Admin</span>}</span>
          </Link>
          
          {/* Desktop Menu */}
          {!isAdminSubdomain && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
              <Link to={isHome ? '#home' : '/'} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link to="/#products" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Insurance Plans</Link>
              <Link to="/#calculator" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">SIP Calculator</Link>
              
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search..." 
                  className="bg-slate-800/50 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-gold-500 w-48 transition-all focus:w-64"
                />
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Claim
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 backdrop-blur-xl">
                    <Link to="/claims/new" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white">File a new claim</Link>
                    <Link to="/claims/existing" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white">Claim is already filed with the Insurer</Link>
                    <Link to="/claims/info" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white">Know more about filing claim</Link>
                    <Link to="/claims/track" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white">Track existing claim</Link>
                    <Link to="/claims/cashless" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white">Cashless network</Link>
                  </div>
                </div>
              </div>

              {userProfile?.role === 'customer' ? (
                <Link to="/dashboard" className="text-gold-300 hover:text-gold-100 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-gold-500/30 bg-gold-500/10">My Dashboard</Link>
              ) : agentProfile?.role === 'admin' ? (
                <Link to="/admin" className="text-rose-300 hover:text-rose-100 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-rose-500/30 bg-rose-500/10">Admin Portal</Link>
              ) : agentProfile ? (
                <Link to="/employee" className="text-gold-300 hover:text-gold-100 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-gold-500/30 bg-gold-500/10">Employee Portal</Link>
              ) : null}
            </div>
          </div>
          )}
          
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <NotificationBell />
            )}
            
            {user ? (
              <button onClick={handleLogout} className="glow-button bg-slate-800 border border-slate-600 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2">
                Logout <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link to="/login" className="glow-button bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2 inline-flex">
                {isAdminSubdomain ? 'Admin Login' : 'Agent Login'} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-slate-800 border-b border-slate-700 max-h-[calc(100vh-5rem)] overflow-y-auto`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAdminSubdomain && (
              <>
                <Link to={isHome ? '#home' : '/'} onClick={closeMenu} className="block text-gray-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-md text-base font-medium">Home</Link>
                <Link to="/#products" onClick={closeMenu} className="block text-gray-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-md text-base font-medium">Insurance Plans</Link>
                <Link to="/#calculator" onClick={closeMenu} className="block text-gray-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-md text-base font-medium">SIP Calculator</Link>
                
                <div className="px-3 py-2">
                  <div className="relative flex items-center w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder="Search..." 
                      className="bg-slate-800/50 border border-slate-700 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500 w-full transition-all"
                    />
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => setIsMobileClaimsOpen(!isMobileClaimsOpen)}
                    className="w-full flex items-center justify-between text-gray-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Claim
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMobileClaimsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileClaimsOpen && (
                    <div className="pl-4 space-y-1 mt-1">
                      <Link to="/claims/new" onClick={closeMenu} className="block px-3 py-2 text-sm text-gray-400 hover:text-white">File a new claim</Link>
                      <Link to="/claims/existing" onClick={closeMenu} className="block px-3 py-2 text-sm text-gray-400 hover:text-white">Claim is already filed with the Insurer</Link>
                      <Link to="/claims/info" onClick={closeMenu} className="block px-3 py-2 text-sm text-gray-400 hover:text-white">Know more about filing claim</Link>
                      <Link to="/claims/track" onClick={closeMenu} className="block px-3 py-2 text-sm text-gray-400 hover:text-white">Track existing claim</Link>
                      <Link to="/claims/cashless" onClick={closeMenu} className="block px-3 py-2 text-sm text-gray-400 hover:text-white">Cashless network</Link>
                    </div>
                  )}
                </div>

                {userProfile?.role === 'customer' ? (
                  <Link to="/dashboard" onClick={closeMenu} className="block text-gold-300 hover:text-gold-100 hover:bg-gold-900/30 px-3 py-2 rounded-md text-base font-medium">My Dashboard</Link>
                ) : agentProfile?.role === 'admin' ? (
                  <Link to="/admin" onClick={closeMenu} className="block text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 px-3 py-2 rounded-md text-base font-medium">Admin Portal</Link>
                ) : agentProfile ? (
                  <Link to="/employee" onClick={closeMenu} className="block text-gold-300 hover:text-gold-100 hover:bg-gold-900/30 px-3 py-2 rounded-md text-base font-medium">Employee Portal</Link>
                ) : null}
              </>
            )}

            <div className="mt-4 pt-4 border-t border-slate-700 pb-2">
              {user ? (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl font-medium">
                  Logout <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <Link to="/login" onClick={closeMenu} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 px-4 py-3 rounded-xl font-medium">
                  {isAdminSubdomain ? 'Admin Login' : 'Agent Login'} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
        </div>
      </div>
    </nav>
  );
}
