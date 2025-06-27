// src/services/apiClient.ts - Fixed version with proper token handling
import axios, { AxiosInstance, AxiosError } from 'axios';
import config from '../config';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Log the API URL being used
console.log(`🌐 API Client initialized with URL: ${apiClient.defaults.baseURL}`);

// Helper function to get token from storage
const getAuthToken = (): string | null => {
  // Try multiple possible token keys (most likely first)
  const possibleKeys = [
    'jajiautos_token',
    'token',
    'authToken',
    'auth_token',
    'accessToken',
    'access_token'
  ];
  
  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);
    if (token && token !== 'undefined' && token !== 'null') {
      console.log(`📱 Found token with key: ${key}`, token.substring(0, 20) + '...');
      return token;
    }
  }
  
  console.log('⚠️ No valid auth token found in localStorage');
  console.log('📋 Available keys:', Object.keys(localStorage));
  return null;
};

// Helper function to remove all possible tokens
const clearAllTokens = (): void => {
  const possibleKeys = [
    'jajiautos_token',
    'token',
    'authToken',
    'auth_token',
    'accessToken',
    'access_token',
    'jajiautos_user',
    'user',
    'currentUser'
  ];
  
  possibleKeys.forEach(key => {
    localStorage.removeItem(key);
  });
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Added token to request: ${token.substring(0, 20)}...`);
    } else {
      console.log('🚫 No token available for request');
    }
    
    // Log request for debugging
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
      hasAuth: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    
    if (response) {
      console.error(`❌ API Error ${response.status}:`, response.data);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('🔓 Unauthorized - clearing tokens and potentially redirecting');
        clearAllTokens();
        
        // Only redirect if we're in an admin route that requires auth
        const currentPath = window.location.pathname;
        const isAdminRoute = currentPath.includes('/admin/');
        const isLoginPage = currentPath.includes('/admin') && !currentPath.includes('/admin/');
        
        if (isAdminRoute && !isLoginPage) {
          console.log('🔄 Redirecting to admin login from:', currentPath);
          window.location.href = '/admin';
        }
      }
      
      interface ErrorResponse {
        error?: string;
        message?: string;
      }
      
      // Extract error message
      const errorData = response.data as ErrorResponse;
      const message = errorData?.error || errorData?.message || response.statusText;
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.error('❌ Network Error: No response received');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      console.error('❌ Request Setup Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Helper function to handle API responses
export const handleApiResponse = <T>(promise: Promise<import('axios').AxiosResponse<T>>): Promise<T> => {
  return promise
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

// Helper function to manually set token (for testing)
export const setAuthToken = (token: string, key: string = 'jajiautos_token'): void => {
  localStorage.setItem(key, token);
  console.log(`🔐 Token set with key: ${key}`);
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Export configured axios instance
export default apiClient;