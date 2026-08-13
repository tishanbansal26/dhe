import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Shield, HeartPulse, ArrowRight } from 'lucide-react';

const relatedMap = {
  health: [
    {
      title: 'Health Coverage Calculator',
      desc: 'Find out how much health insurance you need.',
      icon: <HeartPulse className="w-6 h-6 text-rose-400" />,
      path: '/calculators/health-insurance-cover-calculator',
      color: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50'
    },
    {
      title: 'Family Health Calculator',
      desc: 'Estimate the ideal family floater coverage.',
      icon: <HeartPulse className="w-6 h-6 text-orange-400" />,
      path: '/calculators/family-health-insurance-calculator',
      color: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50'
    },
    {
      title: 'Senior Citizen Calculator',
      desc: 'Determine coverage for elderly parents.',
      icon: <HeartPulse className="w-6 h-6 text-purple-400" />,
      path: '/calculators/senior-citizen-health-insurance-calculator',
      color: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50'
    }
  ],
  life: [
    {
      title: 'Life Cover Calculator',
      desc: 'Estimate how much life cover your family needs.',
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      path: '/calculators/life-insurance-cover-calculator',
      color: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50'
    },
    {
      title: 'Term Insurance Calculator',
      desc: 'Calculate the right term insurance coverage.',
      icon: <Shield className="w-6 h-6 text-indigo-400" />,
      path: '/calculators/term-insurance-calculator',
      color: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50'
    },
    {
      title: 'Insurance Gap Calculator',
      desc: 'Analyze your portfolio for coverage gaps.',
      icon: <Calculator className="w-6 h-6 text-teal-400" />,
      path: '/calculators/insurance-gap-calculator',
      color: 'bg-teal-500/10 border-teal-500/20 hover:border-teal-500/50'
    }
  ],
  term: [
    {
      title: 'Term Insurance Calculator',
      desc: 'Calculate the right term insurance coverage.',
      icon: <Shield className="w-6 h-6 text-indigo-400" />,
      path: '/calculators/term-insurance-calculator',
      color: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50'
    },
    {
      title: 'Life Cover Calculator',
      desc: 'Estimate how much life cover your family needs.',
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      path: '/calculators/life-insurance-cover-calculator',
      color: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50'
    },
    {
      title: 'Insurance Gap Calculator',
      desc: 'Analyze your portfolio for coverage gaps.',
      icon: <Calculator className="w-6 h-6 text-teal-400" />,
      path: '/calculators/insurance-gap-calculator',
      color: 'bg-teal-500/10 border-teal-500/20 hover:border-teal-500/50'
    }
  ]
};

export default function RelatedCalculators({ category }) {
  const navigate = useNavigate();
  
  // Default to life if category isn't matched exactly
  const calculators = relatedMap[category] || relatedMap['life'];

  return (
    <div className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-teal-400" />
        <h3 className="text-xl font-bold text-white">Useful Calculators</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {calculators.map((calc, idx) => (
          <div 
            key={idx}
            onClick={() => navigate(calc.path)}
            className={`group rounded-2xl p-6 border transition-all cursor-pointer ${calc.color}`}
          >
            <div className="flex items-center gap-3 mb-3">
              {calc.icon}
              <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors">{calc.title}</h4>
            </div>
            <p className="text-sm text-gray-400 mb-4">{calc.desc}</p>
            <span className="text-teal-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
              Calculate <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
