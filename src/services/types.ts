// src/services/types.ts - Complete types for the application
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

// API specific types
export interface LoginCredentials {
  username: string;
  password: string;
}

export type CreateCarData = Omit<Car, 'id' | 'createdAt' | 'updatedAt'>;

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

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER';
}

export interface TestDriveData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
}

export interface TestDriveResponse {
  id: string;
  carId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  scheduledDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

export interface TopPerformingCar extends Car {
  rating: number;
  reviews: number;
  salesCount: number;
}

export interface DashboardOverview {
  summary: DashboardStats;
  lowStockCars: LowStockCar[];
  recentSales: RecentSale[];
  topPerformingCars: TopPerformingCar[];
}

export interface DashboardAnalytics {
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

// Form types
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

export interface TestDriveFormData {
  date: string;
  time: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// Response types
export interface CarsResponse {
  cars: Car[];
  total?: number;
  page?: number;
  limit?: number;
  pagination?: Pagination;
}

export interface SalesResponse {
  sales: Sale[];
  total?: number;
  page?: number;
  limit?: number;
  pagination?: Pagination;
}

export interface UsersResponse {
  users: User[];
  pagination?: Pagination;
}

// Error handling
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Authentication
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Purchase history
export interface Purchase {
  id: string;
  carName: string;
  amount: number;
  date: string;
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

// Badge variant type
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// Image upload types
export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
}

// Test drive API data
export interface TestDriveApiData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
}