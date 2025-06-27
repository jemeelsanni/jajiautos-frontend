// src/services/api.ts - CLEAN API SERVICE WITH PROPER TYPES
import apiClient from './apiClient';
import type { 
  LoginCredentials, 
  User, 
  CreateUserData,
  Car,
  CreateCarData,
  TestDriveData,
  TestDriveResponse,
  Sale,
  CreateSaleData,
  DashboardOverview,
  DashboardAnalytics,
  ImageUploadResponse,
  CarsResponse,
  SalesResponse,
  UsersResponse
} from './types';

class ApiService {
  // ===========================
  // AUTHENTICATION
  // ===========================
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/login', credentials);
    
    // Store token and user data with multiple keys for compatibility
    const tokenKeys = ['jajiautos_token', 'token', 'authToken'];
    const userKeys = ['jajiautos_user', 'user', 'currentUser'];
    
    tokenKeys.forEach(key => {
      localStorage.setItem(key, response.data.token);
    });
    
    userKeys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(response.data.user));
    });
    
    return response.data;
  }

  async verifyToken(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/auth/verify');
    return response.data;
  }

  async logout(): Promise<void> {
    const keysToRemove = [
      'jajiautos_token', 'token', 'authToken', 'auth_token',
      'accessToken', 'access_token', 'jajiautos_user', 'user', 'currentUser'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    try {
      await apiClient.post('/auth/logout');
    } catch {
      console.log('Logout endpoint not available, proceeding with local cleanup');
    }
  }

  // ===========================
  // IMAGE UPLOAD
  // ===========================
  async uploadImage(formData: FormData): Promise<ImageUploadResponse> {
    console.log('📤 Uploading single image...');
    const response = await apiClient.post<ImageUploadResponse>('/cars/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('✅ Image uploaded successfully:', response.data);
    return response.data;
  }

  async uploadMultipleImages(files: File[]): Promise<ImageUploadResponse[]> {
    console.log(`📤 Uploading ${files.length} images...`);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post<ImageUploadResponse[]>('/cars/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('✅ Multiple images uploaded successfully:', response.data);
    return response.data;
  }

  async deleteImage(filename: string): Promise<void> {
    await apiClient.delete(`/cars/upload/image/${filename}`);
    console.log('✅ Image deleted successfully:', filename);
  }

  // ===========================
  // CARS MANAGEMENT
  // ===========================
  async getCars(params?: Record<string, string | number>): Promise<CarsResponse> {
    const response = await apiClient.get<CarsResponse>('/cars', { params });
    return response.data;
  }

  async getCarById(id: string): Promise<Car> {
    const response = await apiClient.get<Car>(`/cars/${id}`);
    return response.data;
  }

  async createCar(carData: Partial<CreateCarData>): Promise<Car> {
    console.log('🚗 Creating new car:', carData);
    const response = await apiClient.post<Car>('/cars', carData);
    return response.data;
  }

  async updateCar(id: string, carData: Partial<CreateCarData>): Promise<Car> {
    const response = await apiClient.put<Car>(`/cars/${id}`, carData);
    return response.data;
  }

  async deleteCar(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/cars/${id}`);
    return response.data;
  }

  async scheduleTestDrive(carId: string, testDriveData: TestDriveData): Promise<TestDriveResponse> {
    const response = await apiClient.post<TestDriveResponse>(`/cars/${carId}/test-drive`, testDriveData);
    return response.data;
  }

  // ===========================
  // SALES MANAGEMENT
  // ===========================
  async getSales(params?: Record<string, string | number>): Promise<SalesResponse> {
    const response = await apiClient.get<SalesResponse>('/sales', { params });
    return response.data;
  }

  async createSale(saleData: CreateSaleData): Promise<Sale> {
    console.log('💰 Creating new sale:', saleData);
    const response = await apiClient.post<Sale>('/sales', saleData);
    return response.data;
  }

  async updateSaleStatus(id: string, status: string): Promise<Sale> {
    const response = await apiClient.patch<Sale>(`/sales/${id}/status`, { status });
    return response.data;
  }

  async exportSales(): Promise<Blob> {
    const response = await apiClient.get('/sales/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  }

  // ===========================
  // DASHBOARD & ANALYTICS
  // ===========================
  async getDashboardOverview(timeRange: string = '30'): Promise<DashboardOverview> {
    const response = await apiClient.get<DashboardOverview>('/dashboard/overview', { 
      params: { timeRange } 
    });
    return response.data;
  }

  async getDashboardAnalytics(timeRange: string = '30'): Promise<DashboardAnalytics> {
    const response = await apiClient.get<DashboardAnalytics>('/dashboard/analytics', { 
      params: { timeRange } 
    });
    return response.data;
  }

  // ===========================
  // USER MANAGEMENT
  // ===========================
  async getUsers(params?: Record<string, string | number>): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/users', { params });
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<CreateUserData>): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  }

  async activateUser(id: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/activate`);
    return response.data;
  }

  async deactivateUser(id: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/deactivate`);
    return response.data;
  }

  // ===========================
  // HEALTH CHECK
  // ===========================
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await apiClient.get<{ status: string; timestamp: string }>('/health');
    return response.data;
  }
}

export default new ApiService();