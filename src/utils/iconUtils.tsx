// src/utils/iconUtils.tsx
import {
  Car,
  Package,
  Wrench,
  Info,
  Phone,
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  FileText,
  Shield,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Check,
  AlertCircle,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Share2,
  Home,
  Menu,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap = {
  // Navigation Icons
  Car,
  Package,
  Wrench,
  Info,
  Phone,
  Home,
  Menu,
  User,
  LogOut,

  // Admin Icons
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  FileText,
  Shield,

  // Action Icons
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Check,

  // Status Icons
  AlertCircle,
  Star,
  Heart,
  Share2,

  // Content Icons
  Mail,
  Calendar,
  Clock,
  MapPin,

  // Navigation Arrows
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown
};

export type IconName = keyof typeof iconMap;

// Function to get icon component by name
export const getIconComponent = (iconName: string) => {
  return iconMap[iconName as IconName] || Car; // Default to Car icon if not found
};

// Function to render icon with props
export const renderIcon = (iconName: string, props?: React.ComponentProps<'svg'>) => {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent {...props} />;
};

// Helper function to get all available icon names
export const getAvailableIcons = (): IconName[] => {
  return Object.keys(iconMap) as IconName[];
};

// Icon size presets
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48
};

// Icon color presets
export const iconColors = {
  primary: 'text-red-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-blue-600',
  white: 'text-white',
  black: 'text-black'
};

export default {
  iconMap,
  getIconComponent,
  renderIcon,
  getAvailableIcons,
  iconSizes,
  iconColors
};