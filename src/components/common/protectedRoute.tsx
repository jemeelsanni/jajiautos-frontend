// src/components/common/protectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    isAuthenticated: boolean;
    requiredRoles?: string[];
    userRole?: string;
    redirectTo?: string;
}

const ProtectedRoute = ({
    children,
    isAuthenticated,
    requiredRoles,
    userRole,
    redirectTo = '/admin'
}: ProtectedRouteProps) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check if user has required role (if specified)
    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
        return (
            <div className="pt-24 pb-16 bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        You don't have permission to access this page.
                    </p>
                    <a
                        href="/admin/dashboard"
                        className="text-red-600 hover:text-red-700 font-medium"
                    >
                        Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;