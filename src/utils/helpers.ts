// src/utils/helpers.ts
import type { Car, Purchase, Sale } from '../types/car';

/**
 * Format currency to Nigerian Naira
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Calculate savings percentage
 */
export const calculateSavingsPercent = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Generate unique transaction ID
 */
export const generateTransactionId = (): string => {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Generate receipt from purchase
 */
export const generateReceipt = (car: Car): Purchase => {
  return {
    id: generateTransactionId(),
    carName: car.name,
    amount: car.price,
    date: new Date().toISOString().split('T')[0]
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Nigerian format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+234|0)[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Calculate car age
 */
export const calculateCarAge = (year: number): number => {
  return new Date().getFullYear() - year;
};

/**
 * Get car condition based on mileage and age
 */
export const getCarCondition = (mileage: number, year: number): string => {
  const age = calculateCarAge(year);
  
  if (mileage === 0 && age === 0) return 'New';
  if (mileage < 20000 && age <= 2) return 'Like New';
  if (mileage < 50000 && age <= 5) return 'Excellent';
  if (mileage < 100000 && age <= 8) return 'Good';
  return 'Fair';
};

/**
 * Filter cars by category
 */
export const filterCarsByCategory = (cars: Car[], category: string): Car[] => {
  if (!category) return cars;
  return cars.filter(car => car.category.toLowerCase() === category.toLowerCase());
};

/**
 * Sort cars by different criteria
 */
export const sortCars = (cars: Car[], sortBy: string): Car[] => {
  const sortedCars = [...cars];
  
  switch (sortBy) {
    case 'price-low':
      return sortedCars.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedCars.sort((a, b) => b.price - a.price);
    case 'year':
      return sortedCars.sort((a, b) => b.year - a.year);
    case 'rating':
      return sortedCars.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'name':
    default:
      return sortedCars.sort((a, b) => a.name.localeCompare(b.name));
  }
};


/**
 * Generate unique sale ID
 */
export const generateSaleId = (): string => {
  return `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new sale record
 */
export const createSaleRecord = (car: Car, customerInfo: { name: string; email: string; paymentMethod: string }): Sale => {
  return {
    id: generateSaleId(),
    carId: car.id,
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    amount: car.price,
    date: new Date().toISOString().split('T')[0],
    status: "completed",
    paymentMethod: customerInfo.paymentMethod
  };
};

/**
 * Search cars by name or brand
 */
export const searchCars = (cars: Car[], searchTerm: string): Car[] => {
  if (!searchTerm) return cars;
  
  const term = searchTerm.toLowerCase();
  return cars.filter(car => 
    car.name.toLowerCase().includes(term) ||
    car.brand.toLowerCase().includes(term) ||
    car.category.toLowerCase().includes(term)
  );
};

/**
 * Calculate monthly payment for financing
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  if (annualRate === 0) return principal / months;
  
  const monthlyRate = annualRate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment);
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: string | number | boolean | object | null) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};