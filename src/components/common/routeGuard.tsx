// src/components/common/routeGuard.tsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isRouteAccessible } from '../../routes/routeConfig';
import { ComponentLoading } from './spinner';

interface RouteGuardProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    userRole?: string;
    isLoading?: boolean;
}

const RouteGuard = ({ children, isAuthenticated, userRole, isLoading }: RouteGuardProps) => {
    const location = useLocation();

    useEffect(() => {
        // Track route access for analytics
        console.log(`Route accessed: ${location.pathname}`, {
            authenticated: isAuthenticated,
            userRole,
            timestamp: new Date().toISOString()
        });
    }, [location.pathname, isAuthenticated, userRole]);

    // Show loading while authentication is being checked
    if (isLoading) {
        return <ComponentLoading text="Checking permissions..." />;
    }

    // Check if current route is accessible
    const hasAccess = isRouteAccessible(
        location.pathname,
        userRole || '',
        isAuthenticated
    );

    // Redirect logic
    if (!hasAccess) {
        // If not authenticated and trying to access protected route
        if (!isAuthenticated && location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin" state={{ from: location }} replace />;
        }

        // If authenticated but insufficient permissions
        if (isAuthenticated && location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin/dashboard" replace />;
        }

        // For other inaccessible routes, redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RouteGuard;