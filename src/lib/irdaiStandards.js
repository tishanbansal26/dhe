/**
 * IRDAI Regulatory Standards & Master Guidelines (2024-2026)
 * Single source of truth for regulatory compliance across Radhe Investments.
 *
 * References:
 * - IRDAI Master Circular on Health Insurance Business (May 29, 2024 - Ref: IRDAI/HLT/REG/2024)
 * - Insurance Act 1938 (Section 45 Indisputability)
 * - IRDAI (Protection of Policyholders' Interests) Regulations, 2024
 * - IRDAI Standardization of Exclusions (Circular Ref: IRDAI/HLT/REG/CIR/194/09/2019)
 * - Indian Motor Tariff Rules & Regulations
 */

export const IRDAI_STANDARDS = {
  HEALTH: {
    domain: 'Health Insurance',
    regulationRef: 'IRDAI Master Circular (May 2024)',
    coverageDefaults: {
      roomRent: 'Single Private AC Room (No Proportionate Deductions)',
      icuLimit: 'No Capping / Actual ICU Charges Covered',
      preHospitalization: '60 Days (IRDAI Standard)',
      postHospitalization: '180 Days (IRDAI Standard)',
      restorationBenefit: '100% Unlimited Automatic Restoration (100% Reload)',
      daycare: 'All 540+ Day Care Procedures Covered in Full',
      ambulance: 'Up to ₹2,500 per Hospitalization + Air Ambulance up to SI',
      noClaimBonus: '50% Cumulative Bonus per claim-free year (Guaranteed Retention)',
      healthCheckup: 'Annual Health Check-up for all insured members from Day 1',
      ayushParity: '100% Parity with Allopathy in Recognized AYUSH Hospitals'
    },
    eligibilityDefaults: {
      minAgeAdult: '18 Years',
      maxAge: 'No Entry Age Limit (Mandatory IRDAI 2024 Inclusivity)',
      childAge: '91 Days to 25 Years (Newborn covered from Day 1 if Maternity opted)',
      renewability: 'Guaranteed Lifelong Renewable',
      copay: '0% Co-Pay at all network hospitals (Zero deduction)',
      medicalCheckup: 'No Telemer / Physical Pre-Policy Medical checkup up to age 50'
    },
    waitingPeriods: [
      {
        name: 'Initial Waiting Period',
        duration: '30 Days',
        description: 'IRDAI Standard Clause: 30-day waiting period from inception for illnesses. Accidental hospitalizations are 100% covered from Day 1.'
      },
      {
        name: 'Specific Illnesses / Surgeries',
        duration: '24 Months (IRDAI Cap)',
        description: 'IRDAI Capped Limit: Max 24 months for named conditions (Cataract, Hernia, Hydrocele, Joint Replacements, Piles, Sinusitis, Benign Prostatic Hypertrophy, Kidney/Gall Bladder stones).'
      },
      {
        name: 'Pre-Existing Diseases (PED)',
        duration: '36 Months (Strict IRDAI 2024 Cap)',
        description: 'IRDAI Master Circular 2024: Maximum PED waiting period legally capped at 36 months (reduced from 48m). No claim can be rejected on PED grounds post 3 continuous years.'
      },
      {
        name: 'Moratorium / Incontestability Period',
        duration: '5 Continuous Years (60 Months)',
        description: 'IRDAI 2024 Mandate: After 5 consecutive years of continuous coverage, the policy cannot be contested or repudiated for non-disclosure except proven active fraud.'
      },
      {
        name: 'Cashless Pre-Auth & Discharge TAT',
        duration: '1 Hour Pre-Auth / 3 Hours Discharge',
        description: 'IRDAI Cashless Everywhere Norm: Hospital cashless pre-authorization decision within 60 minutes and final discharge authorization within 3 hours.'
      },
      {
        name: 'Maternity & Newborn Waiting Period',
        duration: '24 Months',
        description: 'Standard IRDAI defined waiting period for maternity expenses, normal/C-section delivery, and 90-day newborn vaccination coverage.'
      }
    ],
    exclusions: [
      {
        name: 'Mandatory Modern Treatments Inclusion',
        type: 'Standard',
        description: 'IRDAI Mandate: Modern treatments including Robotic Surgeries, Oral Chemotherapy, Balloon Sinuplasty, Deep Brain Stimulation, and Stem Cell Therapy MUST NOT be excluded and are covered up to policy limits.'
      },
      {
        name: 'Cosmetic & Aesthetic Procedures',
        type: 'Permanent',
        description: 'IRDAI Standard Exclusion (Code- Excl08): Expenses for cosmetic or plastic surgery unless necessitated by accidental trauma, burns, or cancer reconstruction.'
      },
      {
        name: 'Substance Abuse & Self-Inflicted Injury',
        type: 'Permanent',
        description: 'IRDAI Standard Exclusion (Code- Excl12): Treatment for alcoholism, drug abuse, or intentional self-injury.'
      },
      {
        name: 'Unproven / Experimental Treatments',
        type: 'Standard',
        description: 'IRDAI Standard Exclusion (Code- Excl11): Expenses for treatments, procedures, or medicines not supported by published clinical evidence or regulatory medical boards.'
      },
      {
        name: 'War, Radioactive Perils & Nuclear Contamination',
        type: 'Permanent',
        description: 'IRDAI Standard Exclusion: Injury or illness caused directly by declared/undeclared war, invasion, nuclear radiation or radioactive chemical contamination.'
      }
    ]
  },

  LIFE: {
    domain: 'Life & Term Insurance',
    regulationRef: 'Insurance Act 1938 & IRDAI Life Regulations 2024',
    coverageDefaults: {
      sumAssuredRange: '₹50 Lakhs to ₹10 Crores+',
      policyTerm: '10 to 40 Years (Coverage up to Age 85 / Whole Life 99 Years)',
      pptOptions: 'Regular Pay, Limited Pay (5, 10, 12 Yrs), Pay Till 60, Single Pay',
      payoutOptions: '100% Lump Sum or 50% Lump Sum + Monthly Increasing Income',
      terminalIllness: '100% Accelerated Sum Assured Payout on diagnosis',
      taxBenefits: 'Section 80C (Tax deduction up to ₹1.5L) & Section 10(10D) (100% Tax-Free Payout)'
    },
    eligibilityDefaults: {
      minAgeAdult: '18 Years',
      maxAge: '65 Years',
      maturityAge: '85 Years / Whole Life (99 Years)',
      minIncome: '₹3 Lakhs/year (Salaried), ₹5 Lakhs (Self-employed)',
      gracePeriod: '30 Days (Annual/Quarterly), 15 Days (Monthly NACH)',
      freeLook: '30 Days unconditional trial cancellation with 100% premium refund'
    },
    waitingPeriods: [
      {
        name: 'Section 45 Indisputability Clause',
        duration: '3 Years (36 Months)',
        description: 'Insurance Act 1938 Section 45: A life insurance policy cannot be questioned or repudiated on any ground whatsoever after 3 continuous years from inception or revival.'
      },
      {
        name: 'Suicide Exclusion Clause',
        duration: '12 Months',
        description: 'IRDAI Life Regulations: In case of death due to suicide within 12 months, 80% of total premiums paid (or surrender value) is refunded to the legal nominee.'
      },
      {
        name: 'Free-Look Cancellation Period',
        duration: '30 Days (Electronic Dispatch)',
        description: 'IRDAI Consumer Protection: Unconditional 30-day trial return window with 100% premium refund from receipt of electronic/digital policy document.'
      },
      {
        name: 'Premium Grace Period',
        duration: '30 Days (15 Days Monthly)',
        description: 'IRDAI Mandated Grace: 30 days grace period for annual/half-yearly/quarterly modes and 15 days for monthly NACH mode without loss of life cover.'
      },
      {
        name: 'Policy Revival Window',
        duration: '5 Years',
        description: 'IRDAI Norm: 5-year timeframe from the date of first unpaid premium to revive a lapsed policy with accumulated guaranteed bonuses intact.'
      }
    ],
    exclusions: [
      {
        name: 'Suicide in First 12 Months',
        type: 'Temporary',
        description: 'IRDAI Life Regulations: Death due to suicide within 12 months of inception or revival results in 80% premium refund. Post 12 months, full death benefit is payable.'
      },
      {
        name: 'Hazardous Adventure Sports',
        type: 'Standard',
        description: 'IRDAI Exclusion: Participation in dangerous motorized racing, skydiving, or deep-sea diving unless declared and underwritten under a specific adventure rider.'
      },
      {
        name: 'Aviation Hazard (Non-Commercial)',
        type: 'Permanent',
        description: 'IRDAI Standard: Flying in non-commercial private aircraft as crew or hobbyist unless explicitly underwritten.'
      },
      {
        name: 'Criminal Acts & Felony Participation',
        type: 'Permanent',
        description: 'IRDAI Standard: Death resulting directly from active participation in illegal riots or criminal offenses with unlawful intent.'
      }
    ]
  },

  MOTOR: {
    domain: 'Motor Insurance',
    regulationRef: 'Indian Motor Tariff & Motor Vehicles Act',
    coverageDefaults: {
      idvRange: 'Up to 95% of Vehicle Invoice Price (Customizable IDV)',
      tppdLimit: 'Statutory ₹7.5 Lakhs (Unlimited Third-Party Bodily Injury / Death Liability)',
      cpaCover: 'Statutory ₹15 Lakhs CPA Cover for Owner-Driver',
      zeroDep: '100% Claim on Glass, Rubber, Plastic & Metal without Depreciation deductions',
      engineProtect: 'Covers Hydrostatic Lock, Crankcase damage & Lubricant leakage repair',
      rsa: '24x7 Roadside Assistance within 45 mins (Towing, Flat Tyre, Jumpstart, Fuel)',
      rti: 'Return to Invoice: 100% On-road invoice price + Road Tax reimbursement on Total Loss/Theft',
      consumables: 'Full reimbursement for Engine oil, Nut bolts, Bearings, Coolant & Consumables',
      keyReplacement: 'Up to ₹25,000 Key & Lock replacement cover'
    },
    eligibilityDefaults: {
      maxVehicleAgeZeroDep: 'Up to 5 / 7 Years from Registration Date',
      ncbTransfer: '100% transferable across any Indian General Insurer up to 50%',
      garageNetwork: '10,000+ Authorized Network Garages with Cashless Repair facility'
    },
    waitingPeriods: [
      {
        name: 'Compulsory Personal Accident (CPA)',
        duration: '₹15 Lakhs Mandate',
        description: 'Indian Motor Tariff: Mandatory ₹15 Lakhs CPA cover for owner-driver covering accidental death and permanent total disability.'
      },
      {
        name: 'Third-Party Property Damage (TPPD)',
        duration: '₹7.5 Lakhs Statutory Cap',
        description: 'Motor Vehicles Act: Statutory cover up to ₹7.5 Lakhs for third-party property damage with unlimited liability for bodily injuries.'
      },
      {
        name: 'No Claim Bonus (NCB) Retention',
        duration: '90 Days Window',
        description: 'IRDAI Tariff: Accumulated NCB discount (20% to 50%) is protected and fully transferable across Indian general insurers within 90 days of policy expiry.'
      },
      {
        name: 'Survey & Claim Settlement TAT',
        duration: '48 Hours Survey / 30 Days Settlement',
        description: 'IRDAI Protection of Policyholders Regulations: Surveyor deputation within 48 hours and final claim settlement within 30 days of documentation.'
      }
    ],
    exclusions: [
      {
        name: 'Driving Without Valid License',
        type: 'Permanent',
        description: 'General Insurance / Motor Tariff: Accidents occurring while the driver does not possess an active, valid driving license.'
      },
      {
        name: 'Driving Under Influence (DUI / Intoxication)',
        type: 'Permanent',
        description: 'Motor Tariff Clause: Accidents or damages caused when the driver is intoxicated with alcohol, narcotics, or prohibited drugs.'
      },
      {
        name: 'Normal Wear & Tear and Gradual Aging',
        type: 'Standard',
        description: 'Indian Motor Tariff: Gradual mechanical depreciation, rust, corrosion, or electrical breakdown without external accident.'
      },
      {
        name: 'Consequential & Indirect Damages',
        type: 'Standard',
        description: 'Tariff Regulation: Driving vehicle after oil leak causing engine seizure without engine-protector add-on.'
      },
      {
        name: 'Illegal Speed Contests & Racing',
        type: 'Permanent',
        description: 'Motor Tariff Exclusion: Vehicle used for unapproved rallies, speed trials, or organized racing contests.'
      }
    ]
  },

  INVESTMENT: {
    domain: 'Investment & ULIP',
    regulationRef: 'IRDAI (Unit Linked Insurance Products) Regulations',
    coverageDefaults: {
      minInvestment: '₹24,000 / Year (₹2,000 / Month NACH)',
      lockinPeriod: '5 Years Mandatory IRDAI Lock-in Period',
      fundOptions: '8+ Segregated Funds (Large Cap Equity, Multi Cap, Debt, Balanced)',
      expectedReturns: '12% - 15% CAGR Historical Performance',
      partialWithdrawal: '100% Tax-Free Partial Withdrawals post 5 Years',
      lifeMultiplier: '10X to 40X of Annualized Premium (Life Insurance Benefit)'
    },
    eligibilityDefaults: {
      minAgeAdult: '18 Years',
      maxAge: '65 Years',
      maturityAge: '75 / 85 Years',
      taxExemption: 'Section 80C & Section 10(10D) Tax-Free maturity payout'
    },
    waitingPeriods: [
      {
        name: 'Mandatory Lock-in Period',
        duration: '5 Years',
        description: 'IRDAI ULIP Regulation: Mandatory 5-year lock-in period before partial or full surrender proceeds can be disbursed without charges.'
      },
      {
        name: 'Free-Look Cancellation Period',
        duration: '30 Days',
        description: 'IRDAI Consumer Protection: 30-day return window allowing full units NAV refund minus nominal medical/stamp duty fees.'
      },
      {
        name: 'Grace Period for Investment',
        duration: '30 Days',
        description: 'Grace period allowed to deposit annualized premium without discontinuance of unit allocations.'
      }
    ],
    exclusions: [
      {
        name: 'Market Risk Disclaimer',
        type: 'Standard',
        description: 'IRDAI Mandate: Investment returns in ULIPs are subject to market risks, and the NAV of units can fluctuate based on capital market performance.'
      }
    ]
  }
};

/**
 * Returns standardized IRDAI presets for any given category
 */
export function getIrdaiCategoryStandards(categoryName) {
  const cat = (categoryName || 'Health').toLowerCase();
  if (cat.includes('motor') || cat.includes('car') || cat.includes('vehicle')) {
    return IRDAI_STANDARDS.MOTOR;
  }
  if (cat.includes('life') || cat.includes('term')) {
    return IRDAI_STANDARDS.LIFE;
  }
  if (cat.includes('investment') || cat.includes('ulip')) {
    return IRDAI_STANDARDS.INVESTMENT;
  }
  return IRDAI_STANDARDS.HEALTH;
}
