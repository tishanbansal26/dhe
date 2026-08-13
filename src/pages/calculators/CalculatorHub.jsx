import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Shield, HeartPulse, ShieldCheck, PieChart, Users, ArrowRight, TrendingUp, Activity, Flame, Baby, CalendarDays, Clock, Calendar } from 'lucide-react';
import SEO from '../../components/SEO';
import { generateBreadcrumbSchema } from '../../lib/schema';

const calculators = [
  {
    id: 'life-insurance-cover',
    title: 'Life Insurance Cover',
    description: 'Estimate how much life cover your family needs based on income, expenses, and liabilities.',
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    path: '/calculators/life-insurance-cover-calculator',
    color: 'bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50'
  },
  {
    id: 'term-insurance',
    title: 'Term Insurance',
    description: 'Calculate the right term insurance coverage and duration to protect your dependents.',
    icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
    path: '/calculators/term-insurance-calculator',
    color: 'bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50'
  },
  {
    id: 'health-cover',
    title: 'Health Coverage',
    description: 'Find out how much health insurance you need based on your age, city, and family size.',
    icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
    path: '/calculators/health-insurance-cover-calculator',
    color: 'bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/50'
  },
  {
    id: 'family-health',
    title: 'Family Health',
    description: 'Estimate the ideal family floater coverage to protect your loved ones against medical emergencies.',
    icon: <Users className="w-8 h-8 text-orange-400" />,
    path: '/calculators/family-health-insurance-calculator',
    color: 'bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50'
  },
  {
    id: 'insurance-gap',
    title: 'Insurance Gap',
    description: 'Analyze your current insurance portfolio and identify any critical coverage gaps.',
    icon: <PieChart className="w-8 h-8 text-teal-400" />,
    path: '/calculators/insurance-gap-calculator',
    color: 'bg-teal-500/10 border-teal-500/20 group-hover:border-teal-500/50'
  },
  {
    id: 'senior-health',
    title: 'Senior Citizen Health',
    description: 'Determine the right level of medical coverage to protect your elderly parents.',
    icon: <HeartPulse className="w-8 h-8 text-purple-400" />,
    path: '/calculators/senior-citizen-health-insurance-calculator',
    color: 'bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50'
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Estimate the corpus required for a comfortable retirement and see if your savings are on track.',
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    path: '/calculators/retirement-calculator',
    color: 'bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50'
  }
];

const healthCalculators = [
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index to understand your health category and insurance premium impact.',
    icon: <Activity className="w-8 h-8 text-teal-400" />,
    path: '/calculators/bmi-calculator',
    color: 'bg-teal-500/10 border-teal-500/20 group-hover:border-teal-500/50'
  },
  {
    id: 'bmr',
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate to understand how many calories your body burns at rest.',
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    path: '/calculators/bmr-calculator',
    color: 'bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50'
  },
  {
    id: 'gfr',
    title: 'GFR Calculator',
    description: 'Calculate your Estimated Glomerular Filtration Rate (eGFR), an important kidney function metric.',
    icon: <Activity className="w-8 h-8 text-cyan-400" />,
    path: '/calculators/gfr-calculator',
    color: 'bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/50'
  },
  {
    id: 'ovulation',
    title: 'Ovulation Calculator',
    description: 'Calculate your ovulation date and fertile window to plan for pregnancy.',
    icon: <HeartPulse className="w-8 h-8 text-pink-400" />,
    path: '/calculators/ovulation-calculator',
    color: 'bg-pink-500/10 border-pink-500/20 group-hover:border-pink-500/50'
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Calculator',
    description: 'Calculate your estimated due date and current timeline based on your Last Menstrual Period.',
    icon: <Baby className="w-8 h-8 text-purple-400" />,
    path: '/calculators/pregnancy-calculator',
    color: 'bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50'
  },
  {
    id: 'pregnancy-calendar',
    title: 'Pregnancy Calendar',
    description: 'Track your pregnancy trimesters and key milestones based on your conception date.',
    icon: <Calendar className="w-8 h-8 text-fuchsia-400" />,
    path: '/calculators/pregnancy-calendar',
    color: 'bg-fuchsia-500/10 border-fuchsia-500/20 group-hover:border-fuchsia-500/50'
  },
  {
    id: 'conception',
    title: 'Conception Date Calculator',
    description: 'Work backwards from your expected due date to find out when you likely conceived.',
    icon: <CalendarDays className="w-8 h-8 text-indigo-400" />,
    path: '/calculators/conception-date-calculator',
    color: 'bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50'
  },
  {
    id: 'lmp',
    title: 'LMP Calculator',
    description: 'Calculate your Last Menstrual Period (LMP) based on your expected due date.',
    icon: <Clock className="w-8 h-8 text-rose-400" />,
    path: '/calculators/lmp-calculator',
    color: 'bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/50'
  }
];

export default function CalculatorHub() {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Insurance & Financial Calculators - Radhe Investments"
        description="Use our simple calculators to understand your insurance needs, coverage gaps, and financial planning requirements before buying a policy."
        canonicalUrl="https://www.radheinv.site/calculators"
      >
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Home", url: "https://www.radheinv.site" },
            { name: "Calculators", url: "https://www.radheinv.site/calculators" }
          ]))}
        </script>
      </SEO>
      
      <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
            <HeartPulse className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Health & Maternity Calculators</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Track your health metrics, calculate due dates, and plan for maternity coverage with our specialized tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {healthCalculators.map((calc) => (
            <div 
              key={calc.id}
              onClick={() => navigate(calc.path)}
              className="group bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border transition-colors ${calc.color}`}>
                {calc.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">{calc.title}</h3>
              <p className="text-sm text-gray-400 mb-6 flex-grow">{calc.description}</p>
              
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs mt-auto">
                Calculate Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Financial & Insurance Calculators</h2>
          <p className="text-gray-400 text-lg max-w-3xl">Understand your insurance needs, coverage gaps, and financial planning requirements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <div 
              key={calc.id}
              onClick={() => navigate(calc.path)}
              className="group bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-colors ${calc.color}`}>
                {calc.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{calc.title}</h3>
              <p className="text-gray-400 mb-6">{calc.description}</p>
              
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                Calculate Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Need personalized advice?</h3>
          <p className="text-gray-400 mb-6">
            Our calculators provide indicative estimates for educational purposes. For a tailored financial plan, speak with our insurance advisors.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-teal-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-teal-400 transition-colors inline-flex items-center gap-2"
          >
            Talk to an Advisor
          </button>
        </div>
      </div>
    </>
  );
}
