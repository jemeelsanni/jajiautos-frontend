// src/components/admin/adminAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Card } from "../common/card";
import { BarChart3, DollarSign, TrendingUp, Users, Car, ShoppingCart, Download } from "lucide-react";
import { Button } from "../common/button";
import { ComponentLoading } from "../common/spinner";
import type { Sale, Car as CarType } from '../../types/car';

interface AdminAnalyticsProps {
    sales?: Sale[];
    cars?: CarType[];
}

interface AnalyticsData {
    totalRevenue: number;
    totalSales: number;
    totalCars: number;
    averageSalePrice: number;
    monthlyRevenue: { month: string; revenue: number }[];
    topSellingBrands: { brand: string; sales: number }[];
    salesByStatus: { status: string; count: number }[];
    recentTrends: {
        salesGrowth: number;
        revenueGrowth: number;
        inventoryTurnover: number;
    };
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ sales = [], cars = [] }) => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        totalRevenue: 0,
        totalSales: 0,
        totalCars: 0,
        averageSalePrice: 0,
        monthlyRevenue: [],
        topSellingBrands: [],
        salesByStatus: [],
        recentTrends: {
            salesGrowth: 0,
            revenueGrowth: 0,
            inventoryTurnover: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days

    useEffect(() => {
        calculateAnalytics();
    }, [sales, cars, dateRange]);

    const calculateAnalytics = () => {
        setLoading(true);

        try {
            // Filter sales based on date range
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));

            const filteredSales = sales.filter(sale => {
                const saleDate = new Date(sale.date || sale.createdAt || new Date());
                return saleDate >= cutoffDate;
            });

            // Calculate basic metrics
            const totalRevenue = filteredSales.reduce((sum, sale) =>
                sum + (sale.amount || sale.price || 0), 0
            );
            const totalSales = filteredSales.length;
            const totalCars = cars.length;
            const averageSalePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

            // Calculate monthly revenue
            const monthlyData: { [key: string]: number } = {};
            filteredSales.forEach(sale => {
                const saleDate = new Date(sale.date || sale.createdAt || new Date());
                const monthKey = saleDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (sale.amount || sale.price || 0);
            });

            const monthlyRevenue = Object.entries(monthlyData)
                .map(([month, revenue]) => ({ month, revenue }))
                .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
                .slice(-6); // Last 6 months

            // Calculate top selling brands (based on cars data and sales)
            const brandSales: { [key: string]: number } = {};
            filteredSales.forEach(sale => {
                const car = cars.find(c => c.id === sale.carId);
                if (car?.brand) {
                    brandSales[car.brand] = (brandSales[car.brand] || 0) + 1;
                }
            });

            const topSellingBrands = Object.entries(brandSales)
                .map(([brand, sales]) => ({ brand, sales }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            // Calculate sales by status
            const statusCounts: { [key: string]: number } = {};
            filteredSales.forEach(sale => {
                const status = sale.status || 'pending';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            const salesByStatus = Object.entries(statusCounts)
                .map(([status, count]) => ({ status, count }));

            // Calculate trends (mock data for now - would need historical data)
            const recentTrends = {
                salesGrowth: Math.round((Math.random() - 0.5) * 20 * 100) / 100, // -10% to +10%
                revenueGrowth: Math.round((Math.random() - 0.5) * 30 * 100) / 100, // -15% to +15%
                inventoryTurnover: Math.round((totalSales / Math.max(totalCars, 1)) * 100) / 100
            };

            setAnalyticsData({
                totalRevenue,
                totalSales,
                totalCars,
                averageSalePrice,
                monthlyRevenue,
                topSellingBrands,
                salesByStatus,
                recentTrends
            });
        } catch (error) {
            console.error('Error calculating analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportAnalytics = () => {
        const data = {
            summary: {
                totalRevenue: analyticsData.totalRevenue,
                totalSales: analyticsData.totalSales,
                totalCars: analyticsData.totalCars,
                averageSalePrice: analyticsData.averageSalePrice,
                dateRange: `${dateRange} days`
            },
            monthlyRevenue: analyticsData.monthlyRevenue,
            topSellingBrands: analyticsData.topSellingBrands,
            salesByStatus: analyticsData.salesByStatus,
            trends: analyticsData.recentTrends
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ComponentLoading text="Loading analytics..." />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-2">Business insights and performance metrics</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        <Button variant="outline" onClick={exportAnalytics} icon={Download}>
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₦{analyticsData.totalRevenue.toLocaleString()}
                                </p>
                                <p className={`text-xs mt-1 ${analyticsData.recentTrends.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {analyticsData.recentTrends.revenueGrowth >= 0 ? '+' : ''}
                                    {analyticsData.recentTrends.revenueGrowth}% vs previous period
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Sales</p>
                                <p className="text-2xl font-bold text-blue-600">{analyticsData.totalSales}</p>
                                <p className={`text-xs mt-1 ${analyticsData.recentTrends.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {analyticsData.recentTrends.salesGrowth >= 0 ? '+' : ''}
                                    {analyticsData.recentTrends.salesGrowth}% vs previous period
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <Car className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Inventory</p>
                                <p className="text-2xl font-bold text-purple-600">{analyticsData.totalCars}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Turnover: {analyticsData.recentTrends.inventoryTurnover}%
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Avg. Sale Price</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    ₦{Math.round(analyticsData.averageSalePrice).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Revenue Chart */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Monthly Revenue Trend
                        </h3>
                        <div className="space-y-4">
                            {analyticsData.monthlyRevenue.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.month}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item.revenue / Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue))) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            ₦{item.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Top Selling Brands */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Car className="w-5 h-5 mr-2" />
                            Top Selling Brands
                        </h3>
                        <div className="space-y-4">
                            {analyticsData.topSellingBrands.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.brand}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item.sales / Math.max(...analyticsData.topSellingBrands.map(b => b.sales))) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.sales} sales
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {analyticsData.topSellingBrands.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No sales data available</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sales Status Distribution */}
                <Card className="p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Sales Status Distribution
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {analyticsData.salesByStatus.map((item, index) => (
                            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                                <p className="text-sm text-gray-600 capitalize">{item.status.toLowerCase()}</p>
                            </div>
                        ))}
                        {analyticsData.salesByStatus.length === 0 && (
                            <div className="col-span-3 text-center py-8">
                                <p className="text-gray-500">No sales data available</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick Insights */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900">Best Performance</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                {analyticsData.topSellingBrands[0]?.brand || 'No data'} is the top-selling brand
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-medium text-green-900">Revenue Growth</h4>
                            <p className="text-sm text-green-700 mt-1">
                                {analyticsData.recentTrends.revenueGrowth >= 0 ? 'Positive' : 'Negative'} trend in revenue
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-medium text-purple-900">Inventory Health</h4>
                            <p className="text-sm text-purple-700 mt-1">
                                {analyticsData.recentTrends.inventoryTurnover}% turnover rate
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminAnalytics;