// src/types/car.ts - Clean fix for TypeScript issues
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  make: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image?: string;
  category: string;
  year: number;
  mileage: number;
  fuel: string;
  fuelType?: string;
  transmission: string;
  engine?: string;
  horsepower?: number;
  torque?: string;
  acceleration?: string;
  topSpeed?: string;
  fuelEconomy?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  description: string;
  features: string[];
  safetyFeatures?: string[];
  warranty?: string;
  featured?: boolean;
  inStock: number;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  dealType?: string | null;
  status?: 'available' | 'reserved' | 'sold';
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    reviews: number;
  };
}

export interface Sale {
  id: string;
  carId: string;
  userId?: string;
  salespersonId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  amount?: number;
  price?: number;
  date?: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'completed' | 'pending' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  car?: {
    id: string;
    name: string;
    brand: string;
    model: string;
    images: string[];
    category: string;
  };
  salesperson?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    sales: number;
    cars: number;
    reviews?: number;
  };
}

export interface CreateSaleData {
  carId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export interface Purchase {
  id: string;
  carName: string;
  amount: number;
  date: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface TestDriveFormData {
  date: string;
  time: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface TestDriveApiData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
}

export interface CarsResponse {
  cars: Car[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface SalesResponse {
  sales: Sale[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface CarFormData {
  name: string;
  price: string;
  originalPrice: string;
  images: string;
  category: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  engine: string;
  horsepower: string;
  description: string;
  features: string;
  inStock: string;
  warranty: string;
  brand: string;
  model: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  fuelEconomy: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  safetyFeatures: string;
  featured: boolean;
}

// Dashboard specific types
export interface DashboardStats {
  totalCars: number;
  totalSales: number;
  totalRevenue: number;
  averageSaleValue: number;
  pendingSales?: number;
  completedSales?: number;
}

export interface LowStockCar {
  id: string;
  name: string;
  category: string;
  inStock: number;
  images: string[];
}

export interface RecentSale {
  id: string;
  customerName: string;
  amount: number;
  createdAt: string;
  car: {
    id: string;
    name: string;
    images: string[];
  };
}

// FIXED: Simple TopPerformingCar interface that includes salesCount
export interface TopPerformingCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  make: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image?: string;
  category: string;
  year: number;
  mileage: number;
  fuel: string;
  fuelType?: string;
  transmission: string;
  engine?: string;
  horsepower?: number;
  torque?: string;
  acceleration?: string;
  topSpeed?: string;
  fuelEconomy?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  description: string;
  features: string[];
  safetyFeatures?: string[];
  warranty?: string;
  featured?: boolean;
  inStock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  dealType?: string | null;
  status?: 'available' | 'reserved' | 'sold';
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    reviews: number;
  };
  // Performance specific properties
  salesCount: number;
}

// Analytics types
export interface AnalyticsData {
  totalRevenue: number;
  totalSales: number;
  totalCars: number;
  averageSalePrice: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topSellingBrands: { brand: string; sales: number }[];
  salesByStatus: { status: string; count: number }[];
  recentTrends: {
    salesGrowth: number;
    revenueGrowth: number;
    inventoryTurnover: number;
  };
}

// Report types
export interface ReportData {
  type: 'sales' | 'inventory' | 'financial' | 'customer';
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: Record<string, unknown>;
  generatedAt: string;
  generatedBy: string;
}

export interface ReportFilter {
  dateRange: string;
  reportType: string;
  format: 'pdf' | 'csv' | 'excel';
  includeCharts: boolean;
}

// Create User Data
export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER';
}

// Badge variant type
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

