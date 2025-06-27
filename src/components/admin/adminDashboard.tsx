// src/components/admin/adminDashboard.tsx - Corrected with proper types
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, BarChart3, TrendingUp, ArrowRight, AlertCircle, Package, Plus, Users, FileText, Car as CarIcon, Download } from "lucide-react";
import Badge from "../common/badge";
import { Button } from "../common/button";
import { Card } from "../common/card";
import { ComponentLoading } from "../common/spinner";
import ApiService from '../../services/api';
import type { DashboardStats, LowStockCar, RecentSale, TopPerformingCar } from '../../types/car';

interface AdminDashboardProps {
    onNavigate?: (view: string) => void; // Keep for backward compatibility
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('30');
    const [stats, setStats] = useState<DashboardStats>({
        totalCars: 0,
        totalSales: 0,
        totalRevenue: 0,
        averageSaleValue: 0
    });
    const [lowStockCars, setLowStockCars] = useState<LowStockCar[]>([]);
    const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
    const [topPerformingCars, setTopPerformingCars] = useState<TopPerformingCar[]>([]);
    const [loading, setLoading] = useState(true);

    // Move TopPerformingCarFromApi interface outside the function to avoid redefining it on every call
    interface TopPerformingCarFromApi {
        id: string;
        name: string;
        brand: string;
        model: string;
        make: string;
        price: number;
        images: string[];
        category: string;
        year: number;
        mileage: number;
        fuel: string;
        transmission: string;
        description: string;
        features: string[];
        inStock: number;
        rating?: number;
        reviews?: number;
        salesCount?: number;
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getDashboardOverview(timeRange);

                setStats(response.summary);
                setLowStockCars(response.lowStockCars || []);
                setRecentSales(
                    (response.recentSales || [])
                        .filter(sale => sale.car)
                        .map(sale => ({
                            ...sale,
                            car: sale.car
                                ? {
                                    id: sale.car.id,
                                    name: sale.car.name,
                                    images: sale.car.images
                                }
                                : { id: '', name: '', images: [] }
                        }))
                );
                setTopPerformingCars(
                    (response.topPerformingCars || []).map((car: TopPerformingCarFromApi): TopPerformingCar => ({
                        ...car,
                        rating: car.rating ?? 0,
                        reviews: car.reviews ?? 0,
                        salesCount: car.salesCount ?? 0
                    }))
                );
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Set mock data for demonstration
                setStats({
                    totalCars: 125,
                    totalSales: 48,
                    totalRevenue: 2450000000,
                    averageSaleValue: 51041667
                });
                setLowStockCars([
                    {
                        id: '1',
                        name: 'BMW X5 2023',
                        category: 'Luxury SUV',
                        inStock: 2,
                        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&q=80']
                    }
                ]);
                setRecentSales([
                    {
                        id: '1',
                        customerName: 'John Doe',
                        amount: 45000000,
                        createdAt: new Date().toISOString(),
                        car: {
                            id: '1',
                            name: 'Mercedes-Benz C-Class',
                            images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80']
                        }
                    }
                ]);
                setTopPerformingCars([
                    {
                        // All Car properties
                        id: '1',
                        name: 'Toyota Camry 2024',
                        brand: 'Toyota',
                        model: 'Camry',
                        make: 'Toyota',
                        price: 35000000,
                        images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&q=80'],
                        category: 'Sedan',
                        year: 2024,
                        mileage: 0,
                        fuel: 'Gasoline',
                        transmission: 'Automatic',
                        description: 'Premium sedan',
                        features: ['Navigation', 'Premium Sound'],
                        inStock: 8,
                        // TopPerformingCar specific properties
                        rating: 4.8,
                        reviews: 124,
                        salesCount: 15
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [timeRange]);

    const exportSalesData = async () => {
        try {
            const blob = await ApiService.exportSales();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sales-export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting sales data:', error);
        }
    };

    // Navigation handlers
    const handleNavigate = (path: string) => {
        if (onNavigate) {
            onNavigate(path); // For backward compatibility
        } else {
            navigate(`/admin/${path}`);
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ComponentLoading text="Loading dashboard data..." />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-gray-600 mt-2">Welcome back, Admin. Here's what's happening at JajiAutos.</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        <Button variant="outline" onClick={exportSalesData} icon={Download}>
                            Export Sales
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: "Total Revenue",
                            value: `₦${stats.totalRevenue.toLocaleString()}`,
                            change: "+12.5%",
                            icon: DollarSign,
                            color: "text-green-600",
                            bgColor: "bg-green-100"
                        },
                        {
                            title: "Cars in Stock",
                            value: stats.totalCars.toString(),
                            change: "+3 this week",
                            icon: CarIcon,
                            color: "text-blue-600",
                            bgColor: "bg-blue-100"
                        },
                        {
                            title: "Total Sales",
                            value: stats.totalSales.toString(),
                            change: "+8.2%",
                            icon: BarChart3,
                            color: "text-red-600",
                            bgColor: "bg-red-100"
                        },
                        {
                            title: "Average Sale",
                            value: `₦${Math.round(stats.averageSaleValue).toLocaleString()}`,
                            change: "+5.1%",
                            icon: TrendingUp,
                            color: "text-purple-600",
                            bgColor: "bg-purple-100"
                        }
                    ].map((stat, index) => (
                        <Card key={index} className="p-6" hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Recent Sales */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
                            <Button variant="ghost" size="sm" onClick={() => handleNavigate('sales')} icon={ArrowRight}>
                                View All
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {recentSales.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={sale.car.images[0]}
                                            alt={sale.car.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{sale.car.name}</p>
                                            <p className="text-sm text-gray-600">{sale.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">₦{sale.amount.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {recentSales.length === 0 && (
                                <div className="text-center py-8">
                                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                    <p className="text-gray-600">No recent sales</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Low Stock Alert */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Inventory Alerts</h2>
                            <Badge variant="warning">{lowStockCars.length} alerts</Badge>
                        </div>
                        <div className="space-y-4">
                            {lowStockCars.length > 0 ? (
                                lowStockCars.map((car) => (
                                    <div key={car.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                            <img
                                                src={car.images[0]}
                                                alt={car.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">{car.name}</p>
                                                <p className="text-sm text-gray-600">{car.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-yellow-600">{car.inStock} left</p>
                                            <p className="text-sm text-yellow-600">Low Stock</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                    <p className="text-gray-600">All vehicles are well stocked</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Top Performing Cars */}
                <Card className="p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Top Performing Vehicles</h2>
                        <Button variant="ghost" size="sm" onClick={() => handleNavigate('analytics')} icon={ArrowRight}>
                            View Analytics
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {topPerformingCars.map((car, index) => (
                            <div key={car.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <img src={car.images[0]} alt={car.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{car.name}</p>
                                        <p className="text-sm text-gray-600">{car.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{car.salesCount} sales</p>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <span className="text-sm">★</span>
                                                <span className="text-sm font-medium">{car.rating}</span>
                                                <span className="text-xs text-gray-500">({car.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {topPerformingCars.length === 0 && (
                            <div className="text-center py-8">
                                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600">No performance data available</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" onClick={() => handleNavigate('add-car')} icon={Plus}>
                            Add New Car
                        </Button>
                        <Button variant="outline" onClick={() => handleNavigate('add-sale')} icon={Plus}>
                            New Sale
                        </Button>
                        <Button variant="outline" onClick={() => handleNavigate('users')} icon={Users}>
                            Manage Users
                        </Button>
                        <Button variant="outline" onClick={() => handleNavigate('reports')} icon={FileText}>
                            Generate Report
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}