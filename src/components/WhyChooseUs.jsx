import React from 'react';
import { Users, Coins, FileCheck, MapPin, FileText, Shield } from 'lucide-react';

import { supabase } from '../lib/supabase';

const initialStats = [
  {
    id: 1,
    key: 'users',
    title: '...',
    subtitle: 'Families Protected and Secured So Far',
    icon: <Users className="w-12 h-12 text-emerald-400" />,
    smallIcon: <FileText className="w-4 h-4 text-emerald-900" />,
    color: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-100'
  },
  {
    id: 2,
    key: 'claims',
    title: '...',
    subtitle: 'Total Portfolio Assets Under Management',
    icon: <Coins className="w-12 h-12 text-rose-400" />,
    smallIcon: <FileText className="w-4 h-4 text-rose-900" />,
    color: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'border-rose-500/30',
    iconBg: 'bg-rose-100'
  },
  {
    id: 3,
    key: 'settlement',
    title: '99.41%',
    subtitle: 'Individual Death Claim Settlement Ratio',
    icon: <FileCheck className="w-12 h-12 text-amber-400" />,
    smallIcon: <FileText className="w-4 h-4 text-amber-900" />,
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'border-amber-500/30',
    iconBg: 'bg-amber-100'
  },
  {
    id: 4,
    key: 'plans',
    title: '...',
    subtitle: 'Presence across major cities in India',
    icon: <MapPin className="w-12 h-12 text-blue-400" />,
    smallIcon: <Shield className="w-4 h-4 text-blue-900" />,
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-blue-100'
  }
];

export default function WhyChooseUs() {
  const [stats, setStats] = React.useState(initialStats);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: claimsCount } = await supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'approved');
        const { count: plansCount } = await supabase.from('insurance_plans').select('*', { count: 'exact', head: true });

        setStats(prevStats => prevStats.map(stat => {
          if (stat.key === 'users') {
            return { ...stat, title: `${userCount || '10K'}+ Users`, subtitle: 'Happy Customers' };
          }
          if (stat.key === 'claims') {
            return { ...stat, title: `${claimsCount || '99'}%`, subtitle: 'Claim Settlement' };
          }
          if (stat.key === 'plans') {
            return { ...stat, title: `${plansCount || '50'}+ Plans`, subtitle: 'Insurance Partners' };
          }
          return stat;
        }));
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }

    fetchStats();
  }, []);
  return (
    <section className="py-20 relative bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why choose <span className="text-white">Radhe Investments?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className={`relative glass-panel rounded-3xl p-8 border transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl ${stat.borderColor} overflow-hidden group`}
            >
              {/* Subtle background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${stat.color} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-extrabold text-white leading-tight">
                    {stat.title.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word}
                        <br/>
                      </React.Fragment>
                    ))}
                  </h3>
                  <div className={`w-8 h-8 rounded-full ${stat.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {stat.smallIcon}
                  </div>
                </div>
                
                <div className="flex-grow flex items-center justify-center mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  {stat.icon}
                </div>

                <p className="text-sm text-center font-medium text-gray-300 mt-auto leading-relaxed">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
