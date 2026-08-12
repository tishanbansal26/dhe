import React from 'react';
import { HeartPulse, Shield, Car, TrendingUp, BriefcaseMedical, Baby, Home } from 'lucide-react';

export const categories = [
  {
    id: 'health',
    name: 'Health Insurance',
    icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
    color: 'from-rose-500/20 to-orange-500/10',
    borderColor: 'border-rose-500/30',
    incentiveBadge: 'Upto 25% Discount'
  },
  {
    id: 'life',
    name: 'Term Life',
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    incentiveBadge: 'Lowest Price Guarantee'
  },
  {
    id: 'investment',
    name: 'Investment & Retirement',
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    incentiveBadge: 'Tax Saver 80C'
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    icon: <Car className="w-8 h-8 text-purple-400" />,
    color: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    incentiveBadge: 'Instant Policy'
  }
];

export const plans = [
  // HEALTH PLANS
  {
    id: 'niva-bupa-reassure',
    categoryId: 'health',
    provider: 'Niva Bupa',
    name: 'Niva Bupa ReAssure 2.0',
    icon: <BriefcaseMedical className="w-8 h-8 text-rose-400" />,
    color: 'from-rose-500/20 to-orange-500/10',
    borderColor: 'border-rose-500/30',
    tag: 'Bestseller',
    summary: 'Comprehensive health cover with unlimited base sum insured recharge.',
    benefits: ['Unlimited Sum Insured', 'Lock the clock (Age lock)', 'No claim bonus up to 100%', 'Day care treatments covered'],
    premium: 'Starting ₹750 / month',
    csr: '99.9%',
    networkHospitals: '10,000+',
    heroDescription: 'Experience true peace of mind with ReAssure 2.0, offering industry-first benefits like age-lock for premiums and unlimited sum insured restorations.',
    eligibility: {
      minEntryAge: '18 Years (Adult), 91 Days (Child)',
      maxEntryAge: '65 Years',
      maxMaturityAge: 'Whole Life',
      premiumPaymentTerm: 'Annual, Multi-year',
      policyTerm: '1, 2, or 3 Years'
    },
    detailedBenefits: [
      { title: 'ReAssure Forever', description: 'Unlimited base sum insured restorations triggered from the very first claim.' },
      { title: 'Lock the Clock', description: 'Your premium is based on your entry age and will not increase due to age until a claim is made.' },
      { title: 'Booster+', description: 'Unused base sum insured carries forward to the next year.' }
    ],
    faqs: [
      { category: 'Cover', question: 'Are pre-existing diseases covered?', answer: 'Yes, pre-existing diseases are covered after a waiting period of 36 months.' },
      { category: 'Policy', question: 'Is maternity covered?', answer: 'Maternity cover is not included in the base plan but can be added as an optional rider.' }
    ]
  },
  {
    id: 'star-health-comprehensive',
    categoryId: 'health',
    provider: 'Star Health',
    name: 'Star Comprehensive Insurance',
    icon: <BriefcaseMedical className="w-8 h-8 text-blue-400" />,
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    tag: 'Family Floater',
    summary: 'No sub-limits on room rent and cover for maternity and newborn baby.',
    benefits: ['No Room Rent Capping', 'Maternity Cover included', 'Free Health Checkup', 'Bariatric Surgery Cover'],
    premium: 'Starting ₹850 / month',
    csr: '90.0%',
    networkHospitals: '14,000+',
    heroDescription: 'A complete health insurance policy for your entire family, providing wide coverage without restrictive sub-limits on hospital room rents.',
    eligibility: {
      minEntryAge: '18 Years (Adult), 91 Days (Child)',
      maxEntryAge: '65 Years',
      maxMaturityAge: 'Whole Life',
      premiumPaymentTerm: 'Annual',
      policyTerm: '1, 2, or 3 Years'
    },
    detailedBenefits: [
      { title: 'No Sub-limits', description: 'Enjoy single private A/C room without any capping or proportionate deductions.' },
      { title: 'Maternity & Newborn', description: 'Coverage for maternity expenses (normal and caesarean) and newborn baby cover from day 1.' },
      { title: 'Outpatient Dental & Ophthalmic', description: 'Coverage for outpatient dental and ophthalmic treatments after a waiting period.' }
    ],
    faqs: [
      { category: 'Cover', question: 'What is the waiting period for maternity?', answer: 'The waiting period for maternity cover is 24 months of continuous coverage.' },
      { category: 'Policy', question: 'Is co-payment applicable?', answer: 'No co-payment is applicable if the entry age is up to 60 years.' }
    ]
  },
  {
    id: 'care-supreme',
    categoryId: 'health',
    provider: 'Care Health',
    name: 'Care Supreme',
    icon: <BriefcaseMedical className="w-8 h-8 text-emerald-400" />,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    tag: 'Value for Money',
    summary: 'Get up to 500% cumulative bonus and unlimited automatic recharge.',
    benefits: ['Cumulative Bonus up to 500%', 'Unlimited Recharge', 'Annual Health Check-up', 'Advance Technology Methods'],
    premium: 'Starting ₹600 / month',
    csr: '95.2%',
    networkHospitals: '11,000+',
    heroDescription: 'A supreme health insurance plan that multiplies your sum insured rapidly through cumulative bonuses, ensuring you always have adequate cover.',
    eligibility: {
      minEntryAge: '18 Years (Adult), 91 Days (Child)',
      maxEntryAge: 'Lifelong',
      maxMaturityAge: 'Whole Life',
      premiumPaymentTerm: 'Annual, Multi-year',
      policyTerm: '1, 2, or 3 Years'
    },
    detailedBenefits: [
      { title: 'Cumulative Bonus Super', description: 'Increase your sum insured by 100% per year up to a maximum of 500%.' },
      { title: 'Unlimited Automatic Recharge', description: 'Unlimited reinstatement of the base sum insured once it is exhausted.' }
    ],
    faqs: [
      { category: 'Cover', question: 'Does cumulative bonus reduce on claim?', answer: 'Yes, the cumulative bonus will be reduced at the same rate at which it accrued if a claim is made.' }
    ]
  },
  
  // LIFE/TERM PLANS
  {
    id: 'icici-pru-iprotect',
    categoryId: 'life',
    provider: 'ICICI Prudential',
    name: 'iProtect Smart',
    icon: <Shield className="w-8 h-8 text-orange-400" />,
    color: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'border-orange-500/30',
    tag: 'Top Rated',
    summary: 'Comprehensive term insurance with 34 critical illnesses cover.',
    benefits: ['Terminal Illness Cover', 'Accidental Death Benefit', 'Critical Illness add-on', 'Special premium for women'],
    premium: 'Starting ₹550 / month',
    csr: '99.2%',
    heroDescription: 'Protect your family\'s financial future with a highly customizable term plan that pays out on death, terminal illness, or disability.',
    eligibility: {
      minEntryAge: '18 Years',
      maxEntryAge: '65 Years',
      maxMaturityAge: '85 Years',
      premiumPaymentTerm: 'Regular, Limited, Single',
      policyTerm: '5 to 67 Years'
    },
    detailedBenefits: [
      { title: 'Terminal Illness', description: 'Get the entire life cover amount immediately upon diagnosis of a terminal illness.' },
      { title: 'Critical Illness Benefit', description: 'Lump sum payout on first diagnosis of any of the 34 covered critical illnesses.' }
    ],
    faqs: [
      { category: 'Policy', question: 'Can I add my spouse to the same policy?', answer: 'No, this is an individual policy, but your spouse can purchase a separate policy with special rates.' }
    ]
  },
  {
    id: 'hdfc-life-click-2-protect',
    categoryId: 'life',
    provider: 'HDFC Life',
    name: 'Click 2 Protect Super',
    icon: <Shield className="w-8 h-8 text-red-400" />,
    color: 'from-red-500/20 to-rose-500/10',
    borderColor: 'border-red-500/30',
    tag: 'Flexible Options',
    summary: 'A smart term plan offering life cover with return of premium option.',
    benefits: ['Life Aim Option', 'Return of Premium', 'Waiver of Premium on CI', 'Increasing Cover'],
    premium: 'Starting ₹600 / month',
    csr: '99.5%',
    heroDescription: 'A versatile term insurance plan that adapts to your changing needs, offering increasing cover options and return of premium.',
    eligibility: {
      minEntryAge: '18 Years',
      maxEntryAge: '65 Years',
      maxMaturityAge: '85 Years',
      premiumPaymentTerm: 'Regular, Limited, Single',
      policyTerm: '10 to 67 Years'
    },
    detailedBenefits: [
      { title: 'Return of Premium', description: 'Get 100% of your total premiums paid back if you survive the policy term.' },
      { title: 'Life Stage Option', description: 'Increase your life cover at key milestones like marriage or childbirth without medicals.' }
    ],
    faqs: [
      { category: 'Policy', question: 'What is the Life Aim option?', answer: 'It is an option where your cover amount increases by a fixed percentage every year.' }
    ]
  },

  // INVESTMENT PLANS
  {
    id: 'bajaj-allianz-guarantee',
    categoryId: 'investment',
    provider: 'Bajaj Allianz',
    name: 'Guaranteed Income Goal',
    icon: <TrendingUp className="w-8 h-8 text-cyan-400" />,
    color: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'border-cyan-500/30',
    tag: 'Guaranteed Returns',
    summary: 'Lock in your returns and get guaranteed income for your future goals.',
    benefits: ['Guaranteed Maturity Benefit', 'Regular Income Option', 'Life Cover', 'Tax Benefits'],
    premium: 'Starting ₹2000 / month',
    csr: '99.1%',
    heroDescription: 'A non-linked, non-participating life insurance plan that guarantees your returns, shielding you from market volatility.',
    eligibility: {
      minEntryAge: '18 Years',
      maxEntryAge: '60 Years',
      maxMaturityAge: '72 Years',
      premiumPaymentTerm: '5, 7, 10, 12 Years',
      policyTerm: '10 to 24 Years'
    },
    detailedBenefits: [
      { title: 'Guaranteed Returns', description: 'Know exactly what you will get at maturity right when you buy the policy.' },
      { title: 'Income Option', description: 'Choose to receive the maturity benefit as a lump sum or as regular income for a specified period.' }
    ],
    faqs: [
      { category: 'Policy', question: 'Are the returns completely tax-free?', answer: 'Yes, maturity proceeds are generally tax-free under section 10(10D) subject to prevailing tax laws.' }
    ]
  },

  // MOTOR PLANS
  {
    id: 'hdfc-ergo-car',
    categoryId: 'motor',
    provider: 'HDFC Ergo',
    name: 'Comprehensive Car Insurance',
    icon: <Car className="w-8 h-8 text-purple-400" />,
    color: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    tag: 'Cashless Network',
    summary: 'Extensive coverage for your car with access to 8000+ cashless garages.',
    benefits: ['Own Damage Cover', 'Third Party Liability', 'Zero Depreciation Add-on', '24x7 Roadside Assistance'],
    premium: 'Based on IDV',
    csr: '98.5%',
    networkHospitals: '8,000+ Garages',
    heroDescription: 'Protect your vehicle against accidents, theft, and natural calamities with HDFC Ergo\'s seamless claims process.',
    eligibility: {
      minEntryAge: 'N/A',
      maxEntryAge: 'N/A',
      maxMaturityAge: 'N/A',
      premiumPaymentTerm: 'Annual',
      policyTerm: '1 or 3 Years'
    },
    detailedBenefits: [
      { title: 'Cashless Repairs', description: 'Get your car repaired without paying out of pocket at our vast network of network garages.' },
      { title: 'Zero Depreciation', description: 'Get full claim amount without any deduction for depreciation on parts replaced.' }
    ],
    faqs: [
      { category: 'Cover', question: 'What is NCB?', answer: 'No Claim Bonus (NCB) is a discount on your own damage premium for every claim-free year.' }
    ]
  }
];
