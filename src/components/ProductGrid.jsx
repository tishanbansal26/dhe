import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PhoneCall, HeartPulse, Shield, Car, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LeadCaptureModal from './LeadCaptureModal';

const categoryMeta = {
  health: {
    name: 'Health Insurance',
    icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
    color: 'from-rose-500/20 to-orange-500/10',
    borderColor: 'border-rose-500/30',
    incentiveBadge: 'Upto 25% Discount',
    description: 'Compare plans from Niva Bupa, Star Health, Care and more.'
  },
  life: {
    name: 'Term Life',
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    incentiveBadge: 'Lowest Price Guarantee',
    description: 'Secure your family with term plans from Tata AIA, HDFC Life, and Max Life.'
  },
  investment: {
    name: 'Investment & Retirement',
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    incentiveBadge: 'Tax Saver 80C',
    description: 'Grow your wealth and plan retirement with guaranteed return products.'
  },
  motor: {
    name: 'Motor Insurance',
    icon: <Car className="w-8 h-8 text-purple-400" />,
    color: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    incentiveBadge: 'Instant Policy',
    description: 'Comprehensive car and bike insurance from ICICI Lombard, Bajaj Allianz, and more.'
  }
};

export default function ProductGrid() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('insurance_plans').select('category');
        if (error) throw error;
        const uniqueCategories = [...new Set(data.map(item => item.category))].map(id => ({
          id: id.toLowerCase(),
          ...(categoryMeta[id.toLowerCase()] || {
            name: id,
            icon: <Shield className="w-8 h-8 text-gray-400" />,
            color: 'from-gray-500/20 to-gray-500/10',
            borderColor: 'border-gray-500/30',
            incentiveBadge: 'New',
            description: 'Explore verified insurance plans and policies.'
          })
        }));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section id="products" className="py-20 relative border-t border-white/5 bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Find the <span className="text-teal-400">Perfect Plan</span>
            </h2>
            <p className="text-gray-400 max-w-2xl text-lg">
              Compare policies from top insurers and secure your future with the best coverage at the lowest premiums.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl border border-slate-600 transition-colors font-semibold shadow-lg"
          >
            <PhoneCall className="w-4 h-4 text-teal-400" /> Talk to an Expert
          </button>
        </div>

        <LeadCaptureModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          planInterest="General Query"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="group cursor-pointer relative glass-panel rounded-3xl p-8 border border-slate-700/50 hover:border-slate-500 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              
              {/* Incentive Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                {cat.incentiveBadge}
              </div>

              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-slate-800/80 border ${cat.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {cat.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-gray-400 text-sm mb-8">{cat.description}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-teal-400 font-semibold group-hover:text-teal-300">View Plans</span>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
