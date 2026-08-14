import { describe, it, expect } from 'vitest';
import { calculateQuote, validateQuoteInputs } from '../quoteEngine';

// Sample mock config mirroring the database configuration for Tata AIA FG Pension
const mockPlanConfig = {
  product_code: 'FG_PENSION',
  uin: '110N161V13',
  product_name: 'Tata AIA Life Insurance Fortune Guarantee Pension',
  insurer: 'Tata AIA Life Insurance Company Limited',
  product_category: 'Life',
  free_look_days: 30,
  section_45_years: 3,
  suicide_clause_months: 12,
  nps_rate_bonus_pct: 1.0,
  options: [
    {
      id: 'option_1',
      code: 'IMMEDIATE_LIFE',
      name: 'Option 1: Immediate Life Annuity',
      type: 'immediate',
      has_death_benefit: false,
      has_rop: false,
      has_ga: false
    },
    {
      id: 'option_2',
      code: 'IMMEDIATE_LIFE_ROP',
      name: 'Option 2: Immediate Life Annuity with Return of Purchase Price',
      type: 'immediate',
      has_death_benefit: true,
      has_rop: true,
      has_ga: false
    },
    {
      id: 'option_3',
      code: 'DEFERRED_GA_I_ROP',
      name: 'Option 3: Deferred Life Annuity (GA-I) with Return of Purchase Price',
      type: 'deferred',
      ga_type: 'GA_I',
      has_death_benefit: true,
      has_rop: true,
      has_ga: true
    },
    {
      id: 'option_4',
      code: 'DEFERRED_GA_II_ROP',
      name: 'Option 4: Deferred Life Annuity (GA-II) with Return of Purchase Price',
      type: 'deferred',
      ga_type: 'GA_II',
      has_death_benefit: true,
      has_rop: true,
      has_ga: true
    }
  ],
  eligibility: {
    min_entry_age: 30,
    max_entry_age_immediate: 85,
    max_entry_age_deferred: 84,
    max_vesting_age: 85,
    min_premium_single: 150000,
    min_premium_annual: 25000
  },
  modal_loadings: {
    annual: 1.0,
    half_yearly: 0.51,
    quarterly: 0.26,
    monthly: 0.0883
  },
  frequency_multipliers: {
    annual_arrears: 1.0,
    half_yearly_arrears: 0.49,
    quarterly_arrears: 0.2425,
    monthly_arrears: 0.08,
    annual_advance: 0.93
  },
  hpp_slabs: {
    single_pay_threshold: 500000,
    regular_pay_threshold: 100000,
    rate_uplift_bps: 25
  }
};

describe('Generic Insurance Quote Engine', () => {

  describe('Eligibility & Boundary Validation', () => {
    it('should reject inputs with age below minimum entry age (30)', () => {
      const result = validateQuoteInputs(mockPlanConfig, {
        age: 25,
        premiumAmount: 500000,
        premiumMode: 'single'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Minimum entry age is 30');
    });

    it('should reject single pay premiums below ₹1,50,000', () => {
      const result = validateQuoteInputs(mockPlanConfig, {
        age: 50,
        premiumAmount: 100000,
        premiumMode: 'single'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Minimum premium for Single Pay is ₹1,50,000');
    });

    it('should reject combinations that exceed max vesting age of 85', () => {
      const result = validateQuoteInputs(mockPlanConfig, {
        age: 80,
        defermentPeriod: 10,
        premiumAmount: 500000,
        premiumMode: 'single'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Annuity payouts must commence by age 85');
    });

    it('should accept valid standard inputs', () => {
      const result = validateQuoteInputs(mockPlanConfig, {
        age: 55,
        premiumAmount: 2500000,
        premiumMode: 'single'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Actuarial Calculations & Option Quotes', () => {
    it('should calculate Option 2 Immediate Life ROP correctly', () => {
      const calculation = calculateQuote(mockPlanConfig, {
        name: 'Rajinder Kumar',
        age: 60,
        premiumAmount: 2500000,
        premiumMode: 'single',
        optionId: 'option_2',
        payoutFrequency: 'annual_arrears'
      });

      expect(calculation.success).toBe(true);
      const { quote } = calculation;
      expect(quote.configuration.hasRop).toBe(true);
      expect(quote.benefits.totalYearlyAnnuity).toBeGreaterThan(140000);
      expect(quote.benefits.guaranteedReturnOfPurchasePrice).toBe(2500000);
      expect(quote.cashflowTimeline.length).toBeGreaterThan(20);
    });

    it('should compute Option 4 Deferred GA-II with Persistency Boosters accurately', () => {
      const calculation = calculateQuote(mockPlanConfig, {
        name: 'Sunita Sharma',
        age: 50,
        premiumAmount: 100000,
        premiumMode: 'annual',
        ppt: 10,
        defermentPeriod: 10,
        optionId: 'option_4',
        payoutFrequency: 'annual_arrears'
      });

      expect(calculation.success).toBe(true);
      const { quote } = calculation;
      expect(quote.configuration.ppt).toBe(10);
      expect(quote.benefits.annuityBooster).toBeGreaterThan(0);
      expect(quote.benefits.totalAccruedGA).toBeGreaterThan(0);
      expect(quote.cashflowTimeline[10].deathBenefit).toBeGreaterThan(1000000);
    });

    it('should apply +1.0% rate bonus for NPS subscribers', () => {
      const standardCalc = calculateQuote(mockPlanConfig, {
        age: 60,
        premiumAmount: 1000000,
        premiumMode: 'single',
        optionId: 'option_2',
        isNpsSubscriber: false
      });

      const npsCalc = calculateQuote(mockPlanConfig, {
        age: 60,
        premiumAmount: 1000000,
        premiumMode: 'single',
        optionId: 'option_2',
        isNpsSubscriber: true
      });

      expect(npsCalc.quote.benefits.npsBonus).toBe(10000); // 1% of 10L = 10,000
      expect(npsCalc.quote.benefits.totalYearlyAnnuity).toBe(
        standardCalc.quote.benefits.totalYearlyAnnuity + 10000
      );
    });

    it('should correctly convert annual frequency to monthly instalments (96% x 1/12 = 0.08)', () => {
      const annualCalc = calculateQuote(mockPlanConfig, {
        age: 55,
        premiumAmount: 2000000,
        premiumMode: 'single',
        optionId: 'option_2',
        payoutFrequency: 'annual_arrears'
      });

      const monthlyCalc = calculateQuote(mockPlanConfig, {
        age: 55,
        premiumAmount: 2000000,
        premiumMode: 'single',
        optionId: 'option_2',
        payoutFrequency: 'monthly_arrears'
      });

      const expectedMonthly = Math.round(annualCalc.quote.benefits.totalYearlyAnnuity * 0.08);
      expect(monthlyCalc.quote.benefits.annuityInstalmentAmount).toBe(expectedMonthly);
    });
  });

});
