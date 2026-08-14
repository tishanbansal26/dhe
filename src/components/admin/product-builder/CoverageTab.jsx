import React from 'react';
import { Shield, Heart, Car, TrendingUp, CheckSquare, Layers, AlertCircle, Info } from 'lucide-react';

export default function CoverageTab({ data, updateData }) {
  const category = (data.category || 'Health').toLowerCase();
  const coverage = data.coverage || {};
  const eligibility = data.eligibility || {};

  const handleCoverageChange = (field, value) => {
    updateData({ coverage: { ...coverage, [field]: value } });
  };

  const handleEligibilityChange = (field, value) => {
    updateData({ eligibility: { ...eligibility, [field]: value } });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-teal-400" />
          Coverage & Eligibility Proforma
          <span className="text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold bg-slate-800 text-teal-300 border border-slate-700">
            {data.category || 'Health'} Mode
          </span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Define the precise financial limits, benefit allowances, and underwriting eligibility rules for this product.
        </p>
      </div>

      {/* 🏥 HEALTH INSURANCE COVERAGE PROFORMA */}
      {category.includes('health') && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Heart className="w-4 h-4 text-emerald-400" />
              Inpatient & Hospitalization Limits
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CoverageInput 
                label="Room Rent Limit" 
                placeholder="e.g. Single Private AC Room (No Capping)"
                value={coverage.roomRent}
                onChange={(v) => handleCoverageChange('roomRent', v)}
              />
              <CoverageInput 
                label="ICU Charges Limit" 
                placeholder="e.g. No Capping / Actuals"
                value={coverage.icuLimit}
                onChange={(v) => handleCoverageChange('icuLimit', v)}
              />
              <CoverageInput 
                label="Pre-Hospitalization" 
                placeholder="e.g. 60 Days"
                value={coverage.preHospitalization}
                onChange={(v) => handleCoverageChange('preHospitalization', v)}
              />
              <CoverageInput 
                label="Post-Hospitalization" 
                placeholder="e.g. 180 Days"
                value={coverage.postHospitalization}
                onChange={(v) => handleCoverageChange('postHospitalization', v)}
              />
              <CoverageInput 
                label="Restoration / Reload Benefit" 
                placeholder="e.g. 100% Instant Unlimited Restore"
                value={coverage.restorationBenefit}
                onChange={(v) => handleCoverageChange('restorationBenefit', v)}
              />
              <CoverageInput 
                label="Daycare Procedures" 
                placeholder="e.g. All Day Care Procedures Covered"
                value={coverage.daycare}
                onChange={(v) => handleCoverageChange('daycare', v)}
              />
              <CoverageInput 
                label="Road Ambulance Limit" 
                placeholder="e.g. Up to ₹2,000 per Hospitalization"
                value={coverage.ambulance}
                onChange={(v) => handleCoverageChange('ambulance', v)}
              />
              <CoverageInput 
                label="No Claim Bonus (NCB)" 
                placeholder="e.g. 50% per year up to 100% / 200%"
                value={coverage.noClaimBonus}
                onChange={(v) => handleCoverageChange('noClaimBonus', v)}
              />
              <CoverageInput 
                label="Annual Health Check-up" 
                placeholder="e.g. Available from Day 1 for all Adults"
                value={coverage.healthCheckup}
                onChange={(v) => handleCoverageChange('healthCheckup', v)}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              Health Eligibility & Family Composition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CoverageInput 
                label="Min Entry Age (Adult)" 
                placeholder="e.g. 18 Years"
                value={eligibility.minAgeAdult}
                onChange={(v) => handleEligibilityChange('minAgeAdult', v)}
              />
              <CoverageInput 
                label="Max Entry Age (Adult)" 
                placeholder="e.g. 65 Years / No Limit"
                value={eligibility.maxAge}
                onChange={(v) => handleEligibilityChange('maxAge', v)}
              />
              <CoverageInput 
                label="Child Entry Age" 
                placeholder="e.g. 91 Days to 25 Years"
                value={eligibility.childAge}
                onChange={(v) => handleEligibilityChange('childAge', v)}
              />
              <CoverageInput 
                label="Renewability" 
                placeholder="e.g. Lifelong Guaranteed Renewal"
                value={eligibility.renewability}
                onChange={(v) => handleEligibilityChange('renewability', v)}
              />
              <CoverageInput 
                label="Pre-Policy Medical Checkup" 
                placeholder="e.g. Not required up to age 45"
                value={eligibility.medicalCheckup}
                onChange={(v) => handleEligibilityChange('medicalCheckup', v)}
              />
              <CoverageInput 
                label="Co-Payment Clause" 
                placeholder="e.g. 0% for all network hospitals"
                value={eligibility.copay}
                onChange={(v) => handleEligibilityChange('copay', v)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 🛡️ LIFE & TERM INSURANCE COVERAGE PROFORMA */}
      {(category.includes('life') || category.includes('term')) && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-purple-400" />
              Death Benefit & Policy Term Architecture
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CoverageInput 
                label="Sum Assured Bracket" 
                placeholder="e.g. ₹50 Lakhs to ₹10 Crores+"
                value={coverage.sumAssuredRange}
                onChange={(v) => handleCoverageChange('sumAssuredRange', v)}
              />
              <CoverageInput 
                label="Policy Term (Years)" 
                placeholder="e.g. 10 to 40 Years (or Till Age 85 / 100)"
                value={coverage.policyTerm}
                onChange={(v) => handleCoverageChange('policyTerm', v)}
              />
              <CoverageInput 
                label="Premium Paying Term (PPT)" 
                placeholder="e.g. Regular Pay, Limited (5, 10, 12 yrs), Pay Till 60"
                value={coverage.pptOptions}
                onChange={(v) => handleCoverageChange('pptOptions', v)}
              />
              <CoverageInput 
                label="Payout Options" 
                placeholder="e.g. Lump sum, Monthly Income, or 50% Lump sum + 50% Income"
                value={coverage.payoutOptions}
                onChange={(v) => handleCoverageChange('payoutOptions', v)}
              />
              <CoverageInput 
                label="Terminal Illness Benefit" 
                placeholder="e.g. 100% Accelerated Sum Assured Payout"
                value={coverage.terminalIllness}
                onChange={(v) => handleCoverageChange('terminalIllness', v)}
              />
              <CoverageInput 
                label="Tax Exemption Eligibility" 
                placeholder="e.g. Section 80C (Premiums) & Section 10(10D) (Payouts)"
                value={coverage.taxBenefits}
                onChange={(v) => handleCoverageChange('taxBenefits', v)}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-purple-400" />
              Life Underwriting & Eligibility Criteria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CoverageInput 
                label="Min Entry Age" 
                placeholder="e.g. 18 Years"
                value={eligibility.minAgeAdult}
                onChange={(v) => handleEligibilityChange('minAgeAdult', v)}
              />
              <CoverageInput 
                label="Max Entry Age" 
                placeholder="e.g. 65 Years"
                value={eligibility.maxAge}
                onChange={(v) => handleEligibilityChange('maxAge', v)}
              />
              <CoverageInput 
                label="Maximum Maturity Age" 
                placeholder="e.g. 85 Years / Whole Life (99 Years)"
                value={eligibility.maturityAge}
                onChange={(v) => handleEligibilityChange('maturityAge', v)}
              />
              <CoverageInput 
                label="Income Eligibility / Minimum Annual Income" 
                placeholder="e.g. ₹3 Lakhs/year (Salaried), ₹5 Lakhs (Self-employed)"
                value={eligibility.minIncome}
                onChange={(v) => handleEligibilityChange('minIncome', v)}
              />
              <CoverageInput 
                label="Grace Period" 
                placeholder="e.g. 30 Days for Annual/Quarterly; 15 Days for Monthly"
                value={eligibility.gracePeriod}
                onChange={(v) => handleEligibilityChange('gracePeriod', v)}
              />
              <CoverageInput 
                label="Free-Look Period" 
                placeholder="e.g. 30 Days from receipt of electronic policy"
                value={eligibility.freeLook}
                onChange={(v) => handleEligibilityChange('freeLook', v)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 🚗 MOTOR INSURANCE COVERAGE PROFORMA */}
      {category.includes('motor') && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Car className="w-4 h-4 text-blue-400" />
              Vehicle Coverage & Damage Protections
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CoverageInput 
                label="IDV (Insured Declared Value) Range" 
                placeholder="e.g. Up to 95% of Vehicle Invoice Price"
                value={coverage.idvRange}
                onChange={(v) => handleCoverageChange('idvRange', v)}
              />
              <CoverageInput 
                label="Third Party Property Damage (TPPD)" 
                placeholder="e.g. Up to ₹7.5 Lakhs (Unlimited Bodily Injury)"
                value={coverage.tppdLimit}
                onChange={(v) => handleCoverageChange('tppdLimit', v)}
              />
              <CoverageInput 
                label="Compulsory Personal Accident (CPA)" 
                placeholder="e.g. ₹15 Lakhs for Owner-Driver"
                value={coverage.cpaCover}
                onChange={(v) => handleCoverageChange('cpaCover', v)}
              />
              <CoverageInput 
                label="Zero Depreciation (Bumper to Bumper)" 
                placeholder="e.g. 100% claim on Glass, Plastic, Rubber, Metal parts"
                value={coverage.zeroDep}
                onChange={(v) => handleCoverageChange('zeroDep', v)}
              />
              <CoverageInput 
                label="Engine & Gearbox Protection" 
                placeholder="e.g. Covers hydrostatic lock & oil leakage damage"
                value={coverage.engineProtect}
                onChange={(v) => handleCoverageChange('engineProtect', v)}
              />
              <CoverageInput 
                label="24x7 Roadside Assistance (RSA)" 
                placeholder="e.g. Towing, Flat Tyre, Battery Jumpstart, Fuel Delivery"
                value={coverage.rsa}
                onChange={(v) => handleCoverageChange('rsa', v)}
              />
              <CoverageInput 
                label="Return to Invoice (RTI)" 
                placeholder="e.g. 100% reimbursement of on-road purchase price on total loss/theft"
                value={coverage.rti}
                onChange={(v) => handleCoverageChange('rti', v)}
              />
              <CoverageInput 
                label="Consumables & Fasteners Cover" 
                placeholder="e.g. Engine oil, nuts, bolts, lubricants covered in full"
                value={coverage.consumables}
                onChange={(v) => handleCoverageChange('consumables', v)}
              />
              <CoverageInput 
                label="Key & Lock Replacement" 
                placeholder="e.g. Up to ₹25,000 per replacement"
                value={coverage.keyReplacement}
                onChange={(v) => handleCoverageChange('keyReplacement', v)}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              Motor Eligibility & Vehicle Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CoverageInput 
                label="Maximum Vehicle Age for Zero-Dep" 
                placeholder="e.g. Up to 5 / 7 Years from Registration"
                value={eligibility.maxVehicleAgeZeroDep}
                onChange={(v) => handleEligibilityChange('maxVehicleAgeZeroDep', v)}
              />
              <CoverageInput 
                label="No Claim Bonus (NCB) Transfer" 
                placeholder="e.g. 100% transfer allowed up to 50%"
                value={eligibility.ncbTransfer}
                onChange={(v) => handleEligibilityChange('ncbTransfer', v)}
              />
              <CoverageInput 
                label="Cashless Garage Network" 
                placeholder="e.g. 7,500+ Authorized Garages Nationwide"
                value={eligibility.garageNetwork}
                onChange={(v) => handleEligibilityChange('garageNetwork', v)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 📈 INVESTMENT / ULIP COVERAGE PROFORMA */}
      {category.includes('investment') && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Investment Architecture & Returns Parameters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CoverageInput 
                label="Minimum Annual Investment" 
                placeholder="e.g. ₹24,000/year (₹2,000/month)"
                value={coverage.minInvestment}
                onChange={(v) => handleCoverageChange('minInvestment', v)}
              />
              <CoverageInput 
                label="Lock-in Period" 
                placeholder="e.g. 5 Years mandatory under IRDAI guidelines"
                value={coverage.lockinPeriod}
                onChange={(v) => handleCoverageChange('lockinPeriod', v)}
              />
              <CoverageInput 
                label="Fund Strategy Choices" 
                placeholder="e.g. 8 Funds (Bluechip Equity, Balanced, Dynamic Debt)"
                value={coverage.fundOptions}
                onChange={(v) => handleCoverageChange('fundOptions', v)}
              />
              <CoverageInput 
                label="Expected Benchmark Returns" 
                placeholder="e.g. 12% - 15% CAGR historical returns"
                value={coverage.expectedReturns}
                onChange={(v) => handleCoverageChange('expectedReturns', v)}
              />
              <CoverageInput 
                label="Partial Withdrawal Facility" 
                placeholder="e.g. Free unlimited partial withdrawals post 5 years"
                value={coverage.partialWithdrawal}
                onChange={(v) => handleCoverageChange('partialWithdrawal', v)}
              />
              <CoverageInput 
                label="Life Insurance Multiplier" 
                placeholder="e.g. 10X to 40X of Annual Premium"
                value={coverage.lifeMultiplier}
                onChange={(v) => handleCoverageChange('lifeMultiplier', v)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function CoverageInput({ label, placeholder, value, onChange }) {
  const displayVal = typeof value === 'object' ? (value?.value || '') : (value || '');
  return (
    <div>
      <label className="block text-xs font-medium text-gray-300 mb-2">{label}</label>
      <input
        type="text"
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
        placeholder={placeholder}
        value={displayVal}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
