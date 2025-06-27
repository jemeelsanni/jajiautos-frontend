// src/routes/routeConfig.ts - Updated with all admin routes
export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  protected: boolean;
  roles?: string[];
  icon?: string;
  showInNav?: boolean;
  exact?: boolean;
  order?: number;
}

// Public Routes Configuration
export const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: 'HomePage',
    protected: false,
    icon: 'Car',
    showInNav: true,
    exact: true,
    order: 1
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: 'InventoryPage',
    protected: false,
    icon: 'Package',
    showInNav: true,
    order: 2
  },
  {
    path: '/services',
    name: 'Services',
    component: 'ServicesPage',
    protected: false,
    icon: 'Wrench',
    showInNav: true,
    order: 3
  },
  {
    path: '/about',
    name: 'About',
    component: 'AboutPage',
    protected: false,
    icon: 'Info',
    showInNav: true,
    order: 4
  },
  {
    path: '/contact',
    name: 'Contact',
    component: 'ContactPage',
    protected: false,
    icon: 'Phone',
    showInNav: true,
    order: 5
  }
];

// Admin Routes Configuration
export const adminRoutes: RouteConfig[] = [
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: 'AdminDashboard',
    protected: true,
    roles: ['SUPER_ADMIN', 'SALES_PERSONNEL', 'INVENTORY_MANAGER'],
    icon: 'BarChart3',
    showInNav: true,
    order: 1
  },
  {
    path: '/admin/inventory',
    name: 'Inventory',
    component: 'AdminInventory',
    protected: true,
    roles: ['SUPER_ADMIN', 'INVENTORY_MANAGER'],
    icon: 'Package',
    showInNav: true,
    order: 2
  },
  {
    path: '/admin/add-car',
    name: 'Add Vehicle',
    component: 'AddCarRoute',
    protected: true,
    roles: ['SUPER_ADMIN', 'INVENTORY_MANAGER'],
    icon: 'Plus',
    showInNav: false, // Hidden from nav, accessible via quick actions
    order: 21
  },
  {
    path: '/admin/sales',
    name: 'Sales',
    component: 'SalesManagement',
    protected: true,
    roles: ['SUPER_ADMIN', 'SALES_PERSONNEL'],
    icon: 'DollarSign',
    showInNav: true,
    order: 3
  },
  {
    path: '/admin/add-sale',
    name: 'Add Sale',
    component: 'AddSaleRoute',
    protected: true,
    roles: ['SUPER_ADMIN', 'SALES_PERSONNEL'],
    icon: 'Plus',
    showInNav: false, // Hidden from nav, accessible via quick actions
    order: 31
  },
  {
    path: '/admin/analytics',
    name: 'Analytics',
    component: 'AdminAnalytics',
    protected: true,
    roles: ['SUPER_ADMIN', 'SALES_PERSONNEL', 'INVENTORY_MANAGER'],
    icon: 'TrendingUp',
    showInNav: true,
    order: 4
  },
  {
    path: '/admin/users',
    name: 'Users',
    component: 'UserManagement',
    protected: true,
    roles: ['SUPER_ADMIN'],
    icon: 'Users',
    showInNav: true,
    order: 5
  },
  {
    path: '/admin/reports',
    name: 'Reports',
    component: 'Reports',
    protected: true,
    roles: ['SUPER_ADMIN', 'SALES_PERSONNEL', 'INVENTORY_MANAGER'],
    icon: 'FileText',
    showInNav: true,
    order: 6
  }
];

// Auth Routes Configuration
export const authRoutes: RouteConfig[] = [
  {
    path: '/admin',
    name: 'Admin Login',
    component: 'AdminLogin',
    protected: false,
    showInNav: false,
    order: 1
  },
  {
    path: '/admin/login',
    name: 'Admin Login',
    component: 'AdminLogin',
    protected: false,
    showInNav: false,
    order: 2
  }
];

// Enhanced utility functions for route management
export const getRoutesByRole = (userRole: string, isAuthenticated: boolean): RouteConfig[] => {
  if (!isAuthenticated) {
    return [...publicRoutes, ...authRoutes.filter(route => route.showInNav !== false)];
  }

  const accessibleAdminRoutes = adminRoutes.filter(route =>
    !route.roles || route.roles.includes(userRole)
  );

  return accessibleAdminRoutes;
};

// Enhanced getNavRoutes function with better logic
export const getNavRoutes = (userRole: string = '', isAdmin: boolean = false): RouteConfig[] => {
  let routes: RouteConfig[] = [];

  if (isAdmin && userRole) {
    // For authenticated admin users, show admin routes they have access to
    routes = adminRoutes.filter(route => {
      // Check if route should be shown in navigation
      if (route.showInNav === false) return false;

      // Check if user has required role
      if (route.roles && !route.roles.includes(userRole)) return false;

      return true;
    });
  } else {
    // For public users, show public routes
    routes = publicRoutes.filter(route => route.showInNav !== false);
  }

  // Sort by order and return
  return routes.sort((a, b) => (a.order || 999) - (b.order || 999));
};

// Alternative getNavRoutes for backwards compatibility
export const getNavigationRoutes = (userRole: string, isAuthenticated: boolean): RouteConfig[] => {
  return getRoutesByRole(userRole, isAuthenticated).filter(route => route.showInNav !== false);
};

// Check if a specific route is accessible to a user
export const isRouteAccessible = (
  routePath: string,
  userRole: string,
  isAuthenticated: boolean
): boolean => {
  const allRoutes = [...publicRoutes, ...adminRoutes, ...authRoutes];
  const route = allRoutes.find(r => r.path === routePath);

  if (!route) return false;
  if (!route.protected) return true;
  if (!isAuthenticated) return false;
  if (!route.roles) return true;

  return route.roles.includes(userRole);
};

// Get route metadata for a specific path
export const getRouteMetadata = (path: string) => {
  return routeMetadata.routes[path as keyof typeof routeMetadata.routes] || {
    title: routeMetadata.title,
    description: routeMetadata.description,
    keywords: routeMetadata.keywords
  };
};

// Check if user has access to any admin routes
export const hasAdminAccess = (userRole: string): boolean => {
  return adminRoutes.some(route =>
    !route.roles || route.roles.includes(userRole)
  );
};

// Get routes for a specific role
export const getRoutesBySpecificRole = (role: string): RouteConfig[] => {
  return adminRoutes.filter(route =>
    !route.roles || route.roles.includes(role)
  );
};

// Get quick action routes (routes that are accessible but not shown in nav)
export const getQuickActionRoutes = (userRole: string): RouteConfig[] => {
  return adminRoutes.filter(route => {
    if (route.showInNav !== false) return false;
    if (route.roles && !route.roles.includes(userRole)) return false;
    return true;
  });
};

// Route metadata
export const routeMetadata = {
  title: 'JajiAutos',
  description: 'Premium Vehicle Sales in Nigeria',
  keywords: 'cars, luxury cars, vehicle sales, Nigeria, Lagos',
  routes: {
    '/': {
      title: 'JajiAutos - Premium Vehicle Sales',
      description: 'Discover luxury vehicles in Nigeria. Premium cars with exceptional service.',
      keywords: 'luxury cars Nigeria, premium vehicles Lagos'
    },
    '/inventory': {
      title: 'Car Inventory - JajiAutos',
      description: 'Browse our extensive collection of premium vehicles.',
      keywords: 'car inventory, available cars, luxury vehicles'
    },
    '/services': {
      title: 'Services - JajiAutos',
      description: 'Professional automotive services including maintenance, financing, and more.',
      keywords: 'car services, vehicle maintenance, auto financing'
    },
    '/about': {
      title: 'About Us - JajiAutos',
      description: 'Learn about JajiAutos, Nigeria\'s premier automotive dealership.',
      keywords: 'about JajiAutos, car dealership Nigeria, automotive company'
    },
    '/contact': {
      title: 'Contact Us - JajiAutos',
      description: 'Get in touch with our automotive experts for assistance.',
      keywords: 'contact JajiAutos, car dealership contact, automotive support'
    },
    '/admin/dashboard': {
      title: 'Admin Dashboard - JajiAutos',
      description: 'Administrative dashboard for managing JajiAutos operations.',
      keywords: 'admin dashboard, car dealership management'
    },
    '/admin/inventory': {
      title: 'Inventory Management - JajiAutos',
      description: 'Manage vehicle inventory and stock levels.',
      keywords: 'inventory management, car stock, vehicle management'
    },
    '/admin/add-car': {
      title: 'Add Vehicle - JajiAutos',
      description: 'Add new vehicles to inventory.',
      keywords: 'add vehicle, inventory management, new car'
    },
    '/admin/sales': {
      title: 'Sales Management - JajiAutos',
      description: 'Track and manage vehicle sales and customer transactions.',
      keywords: 'sales management, car sales tracking, customer management'
    },
    '/admin/add-sale': {
      title: 'Record Sale - JajiAutos',
      description: 'Record new vehicle sales and transactions.',
      keywords: 'record sale, new sale, sales management'
    },
    '/admin/analytics': {
      title: 'Analytics - JajiAutos',
      description: 'Business analytics and performance metrics.',
      keywords: 'business analytics, sales analytics, performance metrics'
    },
    '/admin/users': {
      title: 'User Management - JajiAutos',
      description: 'Manage system users and permissions.',
      keywords: 'user management, system administration, user roles'
    },
    '/admin/reports': {
      title: 'Reports - JajiAutos',
      description: 'Generate and manage business reports.',
      keywords: 'business reports, analytics reports, sales reports'
    },
    '/admin': {
      title: 'Admin Login - JajiAutos',
      description: 'Administrative access to JajiAutos management system.',
      keywords: 'admin login, management access, administrative portal'
    }
  }
};

// Export default object for backwards compatibility
export default {
  publicRoutes,
  adminRoutes,
  authRoutes,
  getRoutesByRole,
  getNavRoutes,
  getNavigationRoutes,
  isRouteAccessible,
  getRouteMetadata,
  hasAdminAccess,
  getRoutesBySpecificRole,
  getQuickActionRoutes,
  routeMetadata
};