/**
 * Security & Input Validation Library for Radhe Investments
 * Protects against XSS, input injection, invalid phone/email formats, and enforces schema boundaries.
 */

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .trim();
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    clean[key] = typeof value === 'string' ? sanitizeString(value) : sanitizeObject(value);
  }
  return clean;
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
};

export const validateIndianPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/[^0-9]/g, '');
  // Allows 10 digit Indian number or 12 digit with 91 prefix
  return (digits.length === 10 && /^[6-9]/.test(digits)) || 
         (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2)));
};

export const formatIndianCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const validatePolicyNumber = (num) => {
  if (!num || typeof num !== 'string') return false;
  // Alphanumeric with hyphens, 5-30 chars
  return /^[A-Z0-9\-_]{5,30}$/i.test(num.trim());
};

export const validatePincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return false;
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};
