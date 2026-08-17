import { describe, it, expect } from 'vitest';
import { 
  sanitizeString, 
  sanitizeObject, 
  validateEmail, 
  validateIndianPhone, 
  validatePolicyNumber, 
  validatePincode,
  formatIndianCurrency
} from '../security/validator';

describe('Security & Input Validator', () => {
  it('strips dangerous HTML tags from user strings', () => {
    const dirty = '<script>alert("hack")</script>Hello World<b>Bold</b>';
    const clean = sanitizeString(dirty);
    expect(clean).not.toContain('<');
    expect(clean).not.toContain('>');
    expect(clean).toBe('scriptalert("hack")/scriptHello WorldbBold/b');
  });

  it('recursively sanitizes nested objects', () => {
    const dirtyObj = {
      name: '<img src=x onerror=alert(1)>John',
      profile: {
        bio: '<h1>Advisor</h1>'
      }
    };
    const cleanObj = sanitizeObject(dirtyObj);
    expect(cleanObj.name).toBe('img src=x onerror=alert(1)John');
    expect(cleanObj.profile.bio).toBe('h1Advisor/h1');
  });

  it('validates correct email formats', () => {
    expect(validateEmail('client@radheinv.site')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.in')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@missing.com')).toBe(false);
  });

  it('validates 10-digit Indian phone numbers', () => {
    expect(validateIndianPhone('9876543210')).toBe(true);
    expect(validateIndianPhone('+91 98765 43210')).toBe(true);
    expect(validateIndianPhone('1234567890')).toBe(false); // Does not start with 6-9
    expect(validateIndianPhone('98765')).toBe(false);
  });

  it('validates policy numbers', () => {
    expect(validatePolicyNumber('POL-2026-98124')).toBe(true);
    expect(validatePolicyNumber('110N161V13')).toBe(true);
    expect(validatePolicyNumber('bad/number')).toBe(false);
    expect(validatePolicyNumber('ab')).toBe(false);
  });

  it('validates Indian pincodes', () => {
    expect(validatePincode('110001')).toBe(true);
    expect(validatePincode('151505')).toBe(true);
    expect(validatePincode('012345')).toBe(false); // Cannot start with 0
    expect(validatePincode('1234')).toBe(false);
  });

  it('formats Indian currency properly', () => {
    const formatted = formatIndianCurrency(503640);
    expect(formatted).toContain('5,03,640');
  });
});
