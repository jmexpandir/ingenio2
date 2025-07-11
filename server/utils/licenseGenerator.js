import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export function generateLicenseKey(productSlug = 'WP') {
  // Generate a unique license key format: WP-XXXX-XXXX-XXXX
  const prefix = productSlug.slice(0, 2).toUpperCase();
  const segments = [];
  
  for (let i = 0; i < 3; i++) {
    segments.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  }
  
  return `${prefix}-${segments.join('-')}`;
}

export function validateLicenseKeyFormat(licenseKey) {
  // Check if license key matches the expected format
  const pattern = /^[A-Z]{2}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  return pattern.test(licenseKey);
}

export function hashDomain(domain) {
  return crypto.createHash('sha256').update(domain.toLowerCase()).digest('hex');
}

export function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
}

export function isLicenseExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export function addDaysToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}