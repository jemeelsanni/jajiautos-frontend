// src/utils/constants.ts
export const APP_NAME = 'JajiAutos';
export const APP_DESCRIPTION = 'Premium Vehicle Sales in Nigeria';

export const CONTACT_INFO = {
  phone: '+234 xxx xxx xxxx',
  email: 'info@jajiautos.ng',
  address: 'Victoria Island, Lagos, Nigeria',
  workingHours: 'Mon-Sat: 9AM-7PM'
};

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank',
  FINANCING: 'financing'
} as const;

export const CAR_CATEGORIES = [
  'Luxury SUV',
  'Sports Car',
  'Sedan',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Electric',
  'Hybrid'
] as const;

export const SORT_OPTIONS = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'year', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' }
] as const;