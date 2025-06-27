// src/hooks/useAuth.ts - Fixed with proper API integration
import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import type { User } from '../services/types';

export { User };

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jajiautos_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await ApiService.verifyToken();
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      // Clear invalid token
      localStorage.removeItem('jajiautos_token');
      localStorage.removeItem('jajiautos_user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await ApiService.login({ username, password });
      
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  };
};