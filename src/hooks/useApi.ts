// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import type { Car, Sale } from '../types/car';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const makeApiResponse = <T>(data: T | null, loading: boolean, error: string | null): ApiResponse<T> => ({
  data,
  loading,
  error
});

export const useApi = () => {
  const [currentLoading, setLoading] = useState(false);

  const makeRequest = useCallback(async <T>(
    request: () => Promise<T>
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      const result = await request();
      return makeApiResponse(result, false, null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      return makeApiResponse<T>(null, false, errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Car API methods
  const getCars = useCallback(async (): Promise<Car[]> => {
    const result = await makeRequest(async () => {
      // Simulate API call
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('Failed to fetch cars');
      return response.json();
    });
    if (!result.data) throw new Error('No data received');
    return result.data as Car[];
  }, [makeRequest]);

  const getCarById = useCallback(async (id: string): Promise<Car | null> => {
    const result = await makeRequest(async () => {
      const response = await fetch(`/api/cars/${id}`);
      if (!response.ok) throw new Error('Failed to fetch car');
      return response.json();
    });
    return result.data;
  }, [makeRequest]);

  const createCar = useCallback(async (carData: Partial<Car>): Promise<Car | null> => {
    const result = await makeRequest(async () => {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      });
      if (!response.ok) throw new Error('Failed to create car');
      return response.json();
    });
    return result.data;
  }, [makeRequest]);

  const updateCar = useCallback(async (id: string, carData: Partial<Car>): Promise<Car | null> => {
    const result = await makeRequest(async () => {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      });
      if (!response.ok) throw new Error('Failed to update car');
      return response.json();
    });
    return result.data;
  }, [makeRequest]);

  const deleteCar = useCallback(async (id: string): Promise<boolean> => {
    const result = await makeRequest(async () => {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete car');
      return true;
    });
    return result !== null;
  }, [makeRequest]);

  // Sales API methods
  const getSales = useCallback(async (): Promise<Sale[]> => {
    const result = await makeRequest(async () => {
      const response = await fetch('/api/sales');
      if (!response.ok) throw new Error('Failed to fetch sales');
      return response.json();
    });
    if (!result.data) throw new Error('No sales data received');
    return result.data as Sale[];
  }, [makeRequest]);

  const createSale = useCallback(async (saleData: Partial<Sale>): Promise<Sale | null> => {
    const result = await makeRequest(async () => {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      if (!response.ok) throw new Error('Failed to create sale');
      return response.json();
    });
    return result.data;
  }, [makeRequest]);

  // Payment API methods
  const processPayment = useCallback(async (paymentData: unknown): Promise<unknown> => {
    return makeRequest(async () => {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) throw new Error('Payment processing failed');
      return response.json();
    });
  }, [makeRequest]);

  return {
    loading: currentLoading,
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    getSales,
    createSale,
    processPayment
  };
};

