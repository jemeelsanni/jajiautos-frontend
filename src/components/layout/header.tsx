// src/components/layout/Header.tsx - Complete Dynamic Header
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '../common/button';
import { getNavRoutes } from '../../routes/routeConfig';
import { getIconComponent } from '../../utils/iconUtils';

interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER';
}

interface HeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
    user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout, user }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const getRoleDisplayName = (role: string) => {
        const roleNames = {
            'SUPER_ADMIN': 'Super Admin',
            'SALES_PERSONNEL': 'Sales Personnel',
            'INVENTORY_MANAGER': 'Inventory Manager'
        };
        return roleNames[role as keyof typeof roleNames] || role;
    };

    const isCurrentPath = (path: string) => {
        // Handle exact matches and nested routes
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const handleLogoClick = () => {
        const destination = isAuthenticated ? '/admin/dashboard' : '/';
        navigate(destination);
        setMobileMenuOpen(false);
    };

    // Get navigation items based on authentication and user role
    const navItems = getNavRoutes(user?.role || '', isAuthenticated);

    // Filter nav items that should be shown
    const visibleNavItems = navItems.filter(item => item.showInNav !== false);

    return (
        <header className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200' : 'bg-white shadow-lg'}
      border-b-4 border-red-600
    `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <button
                        onClick={handleLogoClick}
                        className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
                    >
                        <div className="relative">
                            <Car className="h-12 w-12 text-red-600" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
                                JajiAutos
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">Premium Collection</p>
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-1">
                        {visibleNavItems.map((item) => {
                            const IconComponent = getIconComponent(item.icon || 'Car');
                            const isActive = isCurrentPath(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                    ${isActive
                                            ? 'bg-red-100 text-red-600 shadow-md'
                                            : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                                        }
                  `}
                                >
                                    <IconComponent size={16} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Info & Actions */}
                    <div className="flex items-center space-x-4">
                        {/* User Profile (Desktop) */}
                        {isAuthenticated && user && (
                            <div className="hidden lg:flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {getRoleDisplayName(user.role)}
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-red-600 font-semibold text-sm">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Auth Actions */}
                        {isAuthenticated ? (
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                icon={LogOut}
                                size="sm"
                            >
                                Logout
                            </Button>
                        ) : (
                            <Link to="/admin">
                                <Button
                                    variant="outline"
                                    icon={User}
                                    size="sm"
                                >
                                    Admin
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
                        {/* User Info (Mobile) */}
                        {isAuthenticated && user && (
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-red-600 font-semibold">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {getRoleDisplayName(user.role)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Navigation Links */}
                        <div className="grid grid-cols-2 gap-2 px-4">
                            {visibleNavItems.map((item) => {
                                const IconComponent = getIconComponent(item.icon || 'Car');
                                const isActive = isCurrentPath(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`
                      flex items-center gap-2 p-3 text-left rounded-xl transition-colors
                      ${isActive
                                                ? 'bg-red-50 text-red-600'
                                                : 'hover:bg-gray-50 text-gray-700'
                                            }
                    `}
                                    >
                                        <IconComponent size={16} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-100 px-4">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 p-3 text-left hover:bg-red-50 rounded-xl w-full text-red-600 font-medium transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-xl w-full text-gray-700 font-medium transition-colors"
                                >
                                    <User size={16} />
                                    Admin Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100 px-4">
                            <div className="text-center text-xs text-gray-500">
                                <p>&copy; 2025 JajiAutos. Premium Collection.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;