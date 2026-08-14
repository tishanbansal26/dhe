import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Phone, MapPin, Globe, MessageCircle, Share2, Hash } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-24 bg-teal-500/10 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <TrendingUp className="text-navy-900 w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Radhe<span className="text-teal-400">Investments</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Securing futures and building wealth. Radhe Investments offers top-tier insurance policies and investment plans tailored for your peace of mind.
            </p>
            <div className="flex gap-3">
              {settings.social_facebook ? (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-400/50 transition-all"><Globe className="w-4 h-4" /></a>
              ) : null}
              {settings.social_instagram ? (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-400/50 transition-all"><Share2 className="w-4 h-4" /></a>
              ) : null}
              {settings.social_linkedin ? (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-400/50 transition-all"><Hash className="w-4 h-4" /></a>
              ) : null}
              <a 
                href={`https://wa.me/${(settings.contact_phone || '+91 96036 10000').replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp Support" 
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/50 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="/#products" 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>Insurance Plans
                </a>
              </li>
              <li>
                <a 
                  href="/#calculator" 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>SIP Calculator
                </a>
              </li>
              <li><Link to="/compare" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>Compare Plans</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>Agent Portal</Link></li>
            </ul>
          </div>

          {/* Claims Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Claims & Support</h3>
            <ul className="space-y-4">
              <li><Link to="/claims/new" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>File a Claim</Link></li>
              <li><Link to="/claims/track" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>Track Claim Status</Link></li>
              <li><Link to="/claims/cashless" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>Cashless Network</Link></li>
              <li><Link to="/claims/info" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>Claim Process Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Opp More Super Market,<br/>Mansa, Punjab</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="hover:text-teal-400 transition-colors">{settings.contact_phone}</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MessageCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`https://wa.me/${settings.contact_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">WhatsApp Support</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-teal-400 transition-colors">{settings.contact_email}</a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Radhe Investments. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
