// src/routes/AppRoutes.tsx - Fixed routing structure
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/common/protectedRoute';
import { ComponentLoading } from '../components/common/spinner';
import type { User, Car, Sale } from '../types/car';

// Lazy load components for better performance
const HeroSection = lazy(() => import('../components/customer/heroSection'));
const FeaturedCars = lazy(() => import('../components/customer/featuredCars'));
const InventoryPage = lazy(() => import('../components/pages/inventoryPage'));
const ServicesPage = lazy(() => import('../components/pages/servicesPage'));
const AboutPage = lazy(() => import('../components/pages/aboutPage'));
const ContactPage = lazy(() => import('../components/pages/contactPage'));
const AdminLogin = lazy(() => import('../components/admin/adminLogin'));
const AdminDashboard = lazy(() => import('../components/admin/adminDashboard'));
const AdminInventory = lazy(() => import('../components/admin/adminInventory'));
const SalesManagement = lazy(() => import('../components/admin/salesManagement'));
const AdminAnalytics = lazy(() => import('../components/admin/adminAnalytics'));
const UserManagement = lazy(() => import('../components/admin/userManagement'));
const Reports = lazy(() => import('../components/admin/reports'));
const AddSaleRoute = lazy(() => import('../components/admin/addSaleRoute'));
const AddCarRoute = lazy(() => import('../components/admin/addCarRoute'));

interface AppRoutesProps {
    isAuthenticated: boolean;
    user: User | null;
    cars: Car[];
    sales: Sale[];
    loading: boolean;
    onViewDetails: (car: Car) => Promise<void>;
    onAdminLogin: (username?: string, password?: string) => Promise<boolean>;
    onCarAdded: () => Promise<void>;
    onCarUpdated: () => Promise<void>;
    onCarDeleted: () => Promise<void>;
    onSaleAdded: () => Promise<void>;
}

const AppRoutes = ({
    isAuthenticated,
    user,
    cars,
    sales,
    loading,
    onViewDetails,
    onAdminLogin,
    onCarAdded,
    onCarUpdated,
    onCarDeleted,
    onSaleAdded
}: AppRoutesProps) => {
    return (
        <Suspense fallback={<ComponentLoading text="Loading page..." />}>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicHomePage
                            cars={cars}
                            loading={loading}
                            onViewDetails={onViewDetails}
                        />
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <InventoryPage
                            cars={cars}
                            onViewDetails={onViewDetails}
                            loading={loading}
                        />
                    }
                />

                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Login Route */}
                <Route
                    path="/admin"
                    element={
                        isAuthenticated ?
                            <Navigate to="/admin/dashboard" replace /> :
                            <AdminLogin onLogin={onAdminLogin} />
                    }
                />

                {/* Protected Admin Routes - FIXED: Separate each route */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/inventory"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['INVENTORY_MANAGER', 'SUPER_ADMIN']}
                            userRole={user?.role}
                        >
                            <AdminInventory
                                onCarAdded={onCarAdded}
                                onCarUpdated={onCarUpdated}
                                onCarDeleted={onCarDeleted}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/add-car"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['INVENTORY_MANAGER', 'SUPER_ADMIN']}
                            userRole={user?.role}
                        >
                            <AddCarRoute onCarAdded={onCarAdded} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/sales"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['SALES_PERSONNEL', 'SUPER_ADMIN']}
                            userRole={user?.role}
                        >
                            <SalesManagement
                                sales={sales}
                                onSaleAdded={onSaleAdded}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/add-sale"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['SALES_PERSONNEL', 'SUPER_ADMIN']}
                            userRole={user?.role}
                        >
                            <AddSaleRoute onSaleAdded={onSaleAdded} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/analytics"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['SUPER_ADMIN', 'SALES_PERSONNEL', 'INVENTORY_MANAGER']}
                            userRole={user?.role}
                        >
                            <AdminAnalytics sales={sales} cars={cars} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['SUPER_ADMIN']}
                            userRole={user?.role}
                        >
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            requiredRoles={['SUPER_ADMIN', 'SALES_PERSONNEL', 'INVENTORY_MANAGER']}
                            userRole={user?.role}
                        >
                            <Reports sales={sales} cars={cars} users={user ? [user] : []} />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

// 404 Not Found Page Component
const NotFoundPage = () => (
    <div className="pt-24 pb-16 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="space-x-4">
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Go Home
                </a>
                <a
                    href="/inventory"
                    className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Browse Cars
                </a>
            </div>
        </div>
    </div>
);

// Props interface for PublicHomePage
interface PublicHomePageProps {
    cars: Car[];
    loading: boolean;
    onViewDetails: (car: Car) => void;
}

// Separate component for public home page
const PublicHomePage = ({ cars, loading, onViewDetails }: PublicHomePageProps) => (
    <>
        <HeroSection onExplore={() => window.location.href = '/inventory'} />
        <FeaturedCars
            cars={cars.filter((car: Car) => car.featured)}
            onViewDetails={onViewDetails}
            loading={loading}
        />
    </>
);

export default AppRoutes;