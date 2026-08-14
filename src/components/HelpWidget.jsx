import React, { useState } from 'react';
import { MessageCircle, Phone, HelpCircle, X, ChevronRight, Send, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';
import CallbackForm from './CallbackForm';

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const { settings } = useSiteSettings();

  const rawPhone = settings.contact_phone || '+91 96036 10000';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Radhe Investments, I would like expert advice on insurance plans.')}`;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open assistance panel"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-[0_4px_25px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300 relative group"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-slate-950 transition-transform duration-300" />
          ) : (
            <MessageCircle className="w-7 h-7 text-slate-950 transition-transform duration-300" />
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-400 border-2 border-slate-900"></span>
            </span>
          )}
        </button>
      </div>

      {/* Floating Help Menu Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-2xl shadow-slate-950/80 animate-fade-in-up space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Need Advice or Support?</h3>
              <p className="text-xs text-slate-400">Direct assistance from certified advisors</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-300">WhatsApp Advisor</h4>
                  <p className="text-xs text-slate-400">Instant answers on quotes & claims</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Request Callback */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowCallbackModal(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-teal-300">Request a Free Callback</h4>
                  <p className="text-xs text-slate-400">We call you back in 15 minutes</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Claims & FAQs */}
            <a
              href="/claims/info"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-blue-300">Claims & Hospital Network</h4>
                  <p className="text-xs text-slate-400">Cashless hospitals & claim tracking</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
            Helpline: <span className="text-teal-400 font-mono font-semibold">{rawPhone}</span>
          </div>
        </div>
      )}

      {/* Callback Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setShowCallbackModal(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <CallbackForm onClose={() => setShowCallbackModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
