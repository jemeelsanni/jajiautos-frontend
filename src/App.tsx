// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import type { User, Car, Sale } from './types/car';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Your existing state management functions here...
  const handleAdminLogin = async (username?: string): Promise<boolean> => {
    // Handle admin login logic
    try {
      // Your login logic here
      setIsAuthenticated(true);
      setUser({ id: '1', role: 'SUPER_ADMIN', username: username || 'admin' } as User);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false;
    }
  };

  const handleCarAdded = async () => {
    // Refresh cars data
    console.log('Car added, refreshing data...');
  };

  const handleCarUpdated = async () => {
    // Refresh cars data
    console.log('Car updated, refreshing data...');
  };

  const handleCarDeleted = async () => {
    // Refresh cars data
    console.log('Car deleted, refreshing data...');
  };
  const handleSaleAdded = async () => {
    // Refresh sales data
    try {
      // Replace with actual API call to fetch updated sales
      const updatedSales: Sale[] = [];
      setSales(updatedSales);
    } catch (error) {
      console.error('Error updating sales:', error);
    }
  };

  const handleViewDetails = async (car: Car): Promise<void> => {
    console.log('Viewing details for car:', car.id);
  };

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        setLoading(true);
        // Load your cars and sales data here
        const mockCars: Car[] = []; // Replace with actual API call
        setCars(mockCars);
        // setSales(await fetchSales());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={() => {
            setIsAuthenticated(false);
            setUser(null);
          }}
        />
        <main>
          <AppRoutes
            isAuthenticated={isAuthenticated}
            user={user}
            cars={cars}
            sales={sales}
            loading={loading}
            onAdminLogin={handleAdminLogin}
            onCarAdded={handleCarAdded}
            onCarUpdated={handleCarUpdated}
            onCarDeleted={handleCarDeleted}
            onSaleAdded={handleSaleAdded}
            onViewDetails={handleViewDetails}
          />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;