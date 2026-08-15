/**
 * ULIP Actuarial Engine for Tata AIA Smart Sampoorna Raksha Supreme (110L179V02)
 * Simulates month-by-month fund accumulation based on 4% and 8% gross returns.
 */

export const getMortalityRate = (age) => {
  const rates = {
    18: 0.740, 19: 0.766, 20: 0.782, 21: 0.790, 22: 0.793, 23: 0.792, 24: 0.789,
    25: 0.787, 26: 0.787, 27: 0.789, 28: 0.800, 29: 0.812, 30: 0.826, 31: 0.850,
    32: 0.881, 33: 0.918, 34: 0.964, 35: 1.016, 36: 1.077, 37: 1.147, 38: 1.227,
    39: 1.318, 40: 1.421, 41: 1.535, 42: 1.665, 43: 1.813, 44: 1.982, 45: 2.179,
    46: 2.408, 47: 2.675, 48: 2.984, 49: 3.339, 50: 3.759, 51: 4.208, 52: 4.698,
    53: 5.223, 54: 5.776, 55: 6.348, 56: 6.933, 57: 7.528, 58: 8.132, 59: 8.747,
    60: 9.380, 61: 10.042, 62: 10.744, 63: 11.501, 64: 12.326, 65: 13.233,
    66: 14.237, 67: 15.347, 68: 16.569, 69: 17.904, 70: 19.341, 71: 20.846,
    72: 22.336, 73: 23.602, 74: 25.019, 75: 27.863, 76: 30.821, 77: 34.000,
    78: 38.000, 79: 42.000, 80: 47.000, 81: 52.000, 82: 58.000, 83: 65.000,
    84: 72.000, 85: 80.000
  };
  return rates[age] || (rates[85] + (age - 85) * 8);
};

export const generateUlipQuote = (inputs) => {
  const {
    age,
    gender = 'male',
    premium = 100000,
    ppt = 10,
    policyTerm = 40,
    paymentMode = 'annual',
    planOption = 'classic',
    fundManagementCharge = 1.20 // 1.20% p.a. for Multi Cap Fund
  } = inputs;

  const isSinglePay = paymentMode === 'single';
  const isFemale = gender.toLowerCase() === 'female';

  // 1. Sum Assured Calculation
  let baseSumAssured = 0;
  if (isSinglePay) {
    baseSumAssured = age < 50 ? premium * 1.25 : premium * 1.10;
  } else {
    baseSumAssured = age < 50 ? premium * 7 : premium * 5;
  }

  // 2. Determine Monthly Growth Rates
  const grossRate4 = 4.0;
  const grossRate8 = 8.0;
  const netRate4 = Math.max(grossRate4 - fundManagementCharge, 0);
  const netRate8 = Math.max(grossRate8 - fundManagementCharge, 0);
  
  const monthlyGrowth4 = Math.pow(1 + netRate4 / 100, 1 / 12) - 1;
  const monthlyGrowth8 = Math.pow(1 + netRate8 / 100, 1 / 12) - 1;

  let fundValue4 = 0;
  let fundValue8 = 0;
  let totalPremiumsPaid = 0;

  // Trackers for Loyalty Additions (Classic only)
  const pacHistory = []; // Track Premium Allocation Charges
  const mcHistory4 = []; // Track Mortality Charges for 4% fund
  const mcHistory8 = []; // Track Mortality Charges for 8% fund

  let policyAdminChargeRate = isSinglePay ? 0.00075 : 0.0041; // 0.075% Single, 0.41% Regular
  let currentAdminCharge = 0;

  const timeline = [];

  for (let year = 1; year <= policyTerm; year++) {
    let yearlyPremiumPaid = 0;
    
    // Yearly Policy Admin Charge Inflation
    if (year >= 5 && planOption === 'classic') {
      currentAdminCharge = premium * policyAdminChargeRate;
      if (currentAdminCharge > 500) currentAdminCharge = 500;
      // Increment rate by 5% for next year, cap at year 18
      if (year < 18) {
        policyAdminChargeRate *= 1.05;
      }
    }

    // Determine Premium Allocation Charge (PAC) for this year
    let pacRate = 0;
    if (planOption === 'classic') {
      if (isSinglePay && year === 1) pacRate = 0.03;
      else if (!isSinglePay) {
        if (year === 1) pacRate = 0.12;
        else if (year === 2) pacRate = 0.06;
        else if (year === 3) pacRate = 0.04;
        else if (year === 4) pacRate = 0.02;
      }
    }

    let yearlyPacDeducted = 0;
    let yearlyMcDeducted4 = 0;
    let yearlyMcDeducted8 = 0;
    let yearlyLoyaltyAdded4 = 0;
    let yearlyLoyaltyAdded8 = 0;

    for (let month = 1; month <= 12; month++) {
      const globalMonth = (year - 1) * 12 + month;
      const currentAge = age + Math.floor((globalMonth - 1) / 12);
      
      // 1. Premium Addition & PAC Deduction
      let monthlyPremium = 0;
      if (year <= ppt && (!isSinglePay || (isSinglePay && globalMonth === 1))) {
        if (paymentMode === 'annual' && month === 1) monthlyPremium = premium;
        else if (paymentMode === 'monthly') monthlyPremium = premium / 12;
        else if (isSinglePay && globalMonth === 1) monthlyPremium = premium;
        // Skipping quarterly/half-yearly for simplicity in monthly loop unless needed
      }

      if (monthlyPremium > 0) {
        totalPremiumsPaid += monthlyPremium;
        yearlyPremiumPaid += monthlyPremium;
        const pac = monthlyPremium * pacRate;
        yearlyPacDeducted += pac;

        fundValue4 += (monthlyPremium - pac);
        fundValue8 += (monthlyPremium - pac);
      }

      // Smart Lady Benefit (Month 1)
      if (globalMonth === 1 && isFemale) {
        const smartLadyBonus = isSinglePay ? premium * 0.0025 : premium * 0.0050;
        fundValue4 += smartLadyBonus;
        fundValue8 += smartLadyBonus;
      }

      // 2. Policy Admin Charge Deduction (Start Year 5)
      if (year >= 5 && planOption === 'classic') {
        fundValue4 = Math.max(fundValue4 - currentAdminCharge, 0);
        fundValue8 = Math.max(fundValue8 - currentAdminCharge, 0);
      }

      // 3. Loyalty Additions (Refund of PAC and MC)
      if (planOption === 'classic') {
        // Refund of Mortality Charges (120 months prior)
        if (globalMonth > 120) {
          const oldMc4 = mcHistory4[globalMonth - 120 - 1] || 0;
          const oldMc8 = mcHistory8[globalMonth - 120 - 1] || 0;
          fundValue4 += oldMc4;
          fundValue8 += oldMc8;
          yearlyLoyaltyAdded4 += oldMc4;
          yearlyLoyaltyAdded8 += oldMc8;
        }

        // Refund of Premium Allocation Charges (End of Yr 10-13)
        if (month === 12 && year >= 10 && year <= 13) {
          const oldPac = pacHistory[year - 10] || 0;
          const refund = oldPac * 2;
          fundValue4 += refund;
          fundValue8 += refund;
          yearlyLoyaltyAdded4 += refund;
          yearlyLoyaltyAdded8 += refund;
        }
      }

      // 4. Mortality Charge Deduction
      const mortalityRate = getMortalityRate(currentAge) / 1000 / 12;
      const guaranteedDeathBenefit = Math.max(baseSumAssured, 1.05 * totalPremiumsPaid);
      
      const sar4 = Math.max(guaranteedDeathBenefit - fundValue4, 0);
      const sar8 = Math.max(guaranteedDeathBenefit - fundValue8, 0);
      
      const mc4 = sar4 * mortalityRate;
      const mc8 = sar8 * mortalityRate;

      fundValue4 = Math.max(fundValue4 - mc4, 0);
      fundValue8 = Math.max(fundValue8 - mc8, 0);

      mcHistory4.push(mc4);
      mcHistory8.push(mc8);
      yearlyMcDeducted4 += mc4;
      yearlyMcDeducted8 += mc8;

      // 5. Fund Growth (NAV Compounding)
      fundValue4 *= (1 + monthlyGrowth4);
      fundValue8 *= (1 + monthlyGrowth8);
    } // End Month Loop

    // Store PAC for this year
    pacHistory.push(yearlyPacDeducted);

    // End of Year Snapshot
    timeline.push({
      policyYear: year,
      age: age + year,
      premiumPaid: yearlyPremiumPaid,
      totalPremiumsPaid,
      guaranteedDeathBenefit: Math.max(baseSumAssured, 1.05 * totalPremiumsPaid),
      fundValue4: Math.round(fundValue4),
      fundValue8: Math.round(fundValue8),
      deathBenefit4: Math.max(Math.round(fundValue4), Math.round(baseSumAssured), Math.round(1.05 * totalPremiumsPaid)),
      deathBenefit8: Math.max(Math.round(fundValue8), Math.round(baseSumAssured), Math.round(1.05 * totalPremiumsPaid)),
      loyaltyAdded4: Math.round(yearlyLoyaltyAdded4),
      loyaltyAdded8: Math.round(yearlyLoyaltyAdded8)
    });
  } // End Year Loop

  return {
    quoteNumber: `Q${Date.now()}`,
    planName: 'Smart Sampoorna Raksha Supreme',
    insurer: 'Tata AIA Life Insurance',
    uin: '110L179V02',
    configuration: {
      premiumAmount: premium,
      ppt,
      policyTerm,
      premiumMode: paymentMode,
      optionName: planOption.charAt(0).toUpperCase() + planOption.slice(1)
    },
    benefits: {
      baseSumAssured,
      fundValueAtMaturity4: timeline[timeline.length - 1].fundValue4,
      fundValueAtMaturity8: timeline[timeline.length - 1].fundValue8
    },
    timeline
  };
};
