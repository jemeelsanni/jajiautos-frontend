// src/components/admin/salesManagement.tsx - Fixed component with proper props
import { useState, useEffect } from 'react';
import { Card } from "../common/card";
import { BarChart3, DollarSign, Download, Eye, Search, TrendingUp, Plus, Printer, Mail } from "lucide-react";
import { Button } from "../common/button";
import { Modal } from "../common/modal";
import Badge from "../common/badge";
import { ComponentLoading } from "../common/spinner";
import AddSaleModal from './addSaleModal';
import ApiService from '../../services/api';
import type { Sale } from '../../types/car';

interface SaleInterface {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    amount: number;
    status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
    paymentMethod: string;
    notes?: string;
    createdAt: string;
    car: {
        id: string;
        name: string;
        brand: string;
        model: string;
        images: string[];
        category: string;
    };
    salesperson: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
    };
}

interface SalesStats {
    totalSales: number;
    totalRevenue: number;
    completedSales: number;
    pendingSales: number;
    averageSaleValue: number;
}

interface SalesManagementProps {
    sales?: Sale[]; // Accept sales as optional prop
    onSaleAdded: () => void;
}

const SalesManagement: React.FC<SalesManagementProps> = ({ sales: propSales, onSaleAdded }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState('30');
    const [sales, setSales] = useState<SaleInterface[]>([]);
    const [stats, setStats] = useState<SalesStats>({
        totalSales: 0,
        totalRevenue: 0,
        completedSales: 0,
        pendingSales: 0,
        averageSaleValue: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState<SaleInterface | null>(null);
    const [showSaleDetails, setShowSaleDetails] = useState(false);
    const [showAddSale, setShowAddSale] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchSales();
    }, [statusFilter, dateRange, currentPage]);

    // Use prop sales if provided, otherwise fetch from API
    useEffect(() => {
        if (propSales && propSales.length > 0) {
            // Convert prop sales to component format
            const convertedSales = propSales.map(sale => ({
                id: sale.id,
                customerName: sale.customerName || 'Walk-in Customer',
                customerEmail: sale.customerEmail || 'customer@example.com',
                customerPhone: undefined,
                amount: sale.amount || sale.price || 0,
                status: (sale.status?.toUpperCase() || 'PENDING') as 'COMPLETED' | 'PENDING' | 'CANCELLED',
                paymentMethod: sale.paymentMethod || 'Cash',
                notes: sale.notes,
                createdAt: sale.createdAt || sale.date || new Date().toISOString(),
                car: {
                    id: sale.carId,
                    name: `Car ${sale.carId}`,
                    brand: 'Unknown',
                    model: 'Unknown',
                    images: ['/placeholder-car.jpg'],
                    category: 'Unknown'
                },
                salesperson: {
                    id: sale.userId || 'unknown',
                    firstName: 'Sales',
                    lastName: 'Person',
                    username: 'salesperson'
                }
            }));
            setSales(convertedSales);
            calculateStats(convertedSales);
            setLoading(false);
        }
    }, [propSales]);

    const fetchSales = async () => {
        // Skip API call if we have prop sales
        if (propSales && propSales.length > 0) return;

        try {
            setLoading(true);
            const response = await ApiService.getSales({
                page: currentPage.toString(),
                limit: '20',
                ...(statusFilter && { status: statusFilter }),
                ...(dateRange !== 'all' && {
                    startDate: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString()
                })
            });

            // Convert API response to component format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const convertedSales = (response.sales || []).map((sale: any) => ({
                id: sale.id,
                customerName: sale.customerName || 'Walk-in Customer',
                customerEmail: sale.customerEmail || 'customer@example.com',
                customerPhone: sale.customerPhone,
                amount: sale.amount || sale.price || 0,
                status: (sale.status?.toUpperCase() || 'PENDING') as 'COMPLETED' | 'PENDING' | 'CANCELLED',
                paymentMethod: sale.paymentMethod || 'Cash',
                notes: sale.notes,
                createdAt: sale.createdAt || sale.date || new Date().toISOString(),
                car: sale.car || {
                    id: sale.carId || 'unknown',
                    name: `Car ${sale.carId}`,
                    brand: 'Unknown',
                    model: 'Unknown',
                    images: ['/placeholder-car.jpg'],
                    category: 'Unknown'
                },
                salesperson: sale.salesperson || {
                    id: sale.userId || 'unknown',
                    firstName: 'Sales',
                    lastName: 'Person',
                    username: 'salesperson'
                }
            }));

            setSales(convertedSales);
            setTotalPages(response.pagination?.totalPages || 1);
            calculateStats(convertedSales);
        } catch (error) {
            console.error('Error fetching sales:', error);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (salesData: SaleInterface[]) => {
        const completedSales = salesData.filter((sale: SaleInterface) => sale.status === 'COMPLETED');
        const pendingSales = salesData.filter((sale: SaleInterface) => sale.status === 'PENDING');
        const totalRevenue = completedSales.reduce((sum: number, sale: SaleInterface) => sum + sale.amount, 0);

        setStats({
            totalSales: salesData.length,
            totalRevenue,
            completedSales: completedSales.length,
            pendingSales: pendingSales.length,
            averageSaleValue: completedSales.length > 0 ? totalRevenue / completedSales.length : 0
        });
    };

    const filteredSales = sales.filter(sale =>
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportSalesData = async () => {
        try {
            const blob = await ApiService.exportSales();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sales-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting sales data:', error);
            alert('Failed to export sales data. Please try again.');
        }
    };

    const printReceipt = (sale: SaleInterface) => {
        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
            receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${sale.id}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              .total { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; }
              .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>JajiAutos</h2>
              <p>Premium Vehicle Sales</p>
              <p>Receipt #${sale.id}</p>
            </div>
            <div class="details">
              <div class="row"><span>Date:</span><span>${new Date(sale.createdAt).toLocaleDateString()}</span></div>
              <div class="row"><span>Customer:</span><span>${sale.customerName}</span></div>
              <div class="row"><span>Email:</span><span>${sale.customerEmail}</span></div>
              <div class="row"><span>Vehicle:</span><span>${sale.car.name}</span></div>
              <div class="row"><span>Payment:</span><span>${sale.paymentMethod}</span></div>
              <div class="row"><span>Salesperson:</span><span>${sale.salesperson.firstName} ${sale.salesperson.lastName}</span></div>
            </div>
            <div class="total">
              <div class="row"><span>Amount Paid:</span><span>₦${sale.amount.toLocaleString()}</span></div>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
              <p>Thank you for choosing JajiAutos!</p>
              <p>For support: info@jajiautos.ng</p>
            </div>
          </body>
        </html>
      `);
            receiptWindow.document.close();
            receiptWindow.print();
        }
    };

    const updateSaleStatus = async (saleId: string, newStatus: 'COMPLETED' | 'PENDING' | 'CANCELLED') => {
        try {
            await ApiService.updateSaleStatus(saleId, newStatus.toLowerCase());
            await fetchSales();
            alert('Sale status updated successfully!');
        } catch (error) {
            console.error('Error updating sale status:', error);
            alert('Failed to update sale status. Please try again.');
        }
    };

    const handleSaleAdded = () => {
        fetchSales();
        onSaleAdded();
        setShowAddSale(false);
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ComponentLoading text="Loading sales data..." />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Sales Management</h1>
                        <p className="text-gray-600 mt-2">Track and manage all vehicle sales transactions</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={exportSalesData} icon={Download}>
                            Export CSV
                        </Button>
                        <Button onClick={() => setShowAddSale(true)} icon={Plus}>
                            New Sale
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">₦{stats.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Sales</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalSales}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Average Sale</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    ₦{Math.round(stats.averageSaleValue).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center">
                            <Eye className="w-8 h-8 text-orange-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.pendingSales}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search sales..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                            <option value="all">All time</option>
                        </select>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BarChart3 size={16} />
                            {filteredSales.length} sales found
                        </div>
                    </div>
                </Card>

                {/* Sales Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-gray-900">#{sale.id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={sale.car.images[0]}
                                                    alt={sale.car.name}
                                                    className="w-12 h-12 rounded-lg object-cover mr-3"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                                                    }}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{sale.car.name}</div>
                                                    <div className="text-sm text-gray-500">{sale.car.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{sale.customerName}</div>
                                                <div className="text-sm text-gray-500">{sale.customerEmail}</div>
                                                {sale.customerPhone && (
                                                    <div className="text-xs text-gray-400">{sale.customerPhone}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-green-600">₦{sale.amount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="default" size="sm">{sale.paymentMethod}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{new Date(sale.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={sale.status}
                                                onChange={(e) => updateSaleStatus(sale.id, e.target.value as 'COMPLETED' | 'PENDING' | 'CANCELLED')}
                                                className={`text-sm border-none bg-transparent font-medium rounded-full px-2 py-1 ${sale.status === 'COMPLETED' ? 'text-green-600 bg-green-100' :
                                                        sale.status === 'PENDING' ? 'text-yellow-600 bg-yellow-100' :
                                                            'text-red-600 bg-red-100'
                                                    }`}
                                            >
                                                <option value="COMPLETED">Completed</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSale(sale);
                                                        setShowSaleDetails(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => printReceipt(sale)}
                                                    className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Print receipt"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        window.open(`mailto:${sale.customerEmail}?subject=Your Purchase from JajiAutos&body=Dear ${sale.customerName}, thank you for your purchase of ${sale.car.name}.`);
                                                    }}
                                                    className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Send email"
                                                >
                                                    <Mail size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {filteredSales.length === 0 && (
                    <div className="text-center py-16">
                        <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No sales found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or add a new sale</p>
                    </div>
                )}

                {/* Pagination - only show if not using prop sales */}
                {!propSales && totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Sale Details Modal */}
                {selectedSale && (
                    <Modal
                        isOpen={showSaleDetails}
                        onClose={() => {
                            setShowSaleDetails(false);
                            setSelectedSale(null);
                        }}
                        title="Sale Details"
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Sale Summary */}
                            <div className="bg-gradient-to-r from-gray-50 to-red-50 p-6 rounded-xl border border-red-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Sale #{selectedSale.id.slice(-8).toUpperCase()}</h3>
                                        <p className="text-gray-600">{new Date(selectedSale.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <Badge variant={
                                        selectedSale.status === 'COMPLETED' ? 'success' :
                                            selectedSale.status === 'PENDING' ? 'warning' : 'danger'
                                    }>
                                        {selectedSale.status}
                                    </Badge>
                                </div>
                                <div className="text-3xl font-bold text-red-600">₦{selectedSale.amount.toLocaleString()}</div>
                            </div>

                            {/* Vehicle Information */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Vehicle</h4>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <img
                                        src={selectedSale.car.images[0]}
                                        alt={selectedSale.car.name}
                                        className="w-20 h-20 rounded-lg object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                                        }}
                                    />
                                    <div>
                                        <h5 className="font-semibold text-gray-900">{selectedSale.car.name}</h5>
                                        <p className="text-gray-600">{selectedSale.car.category}</p>
                                        <p className="text-sm text-gray-500">{selectedSale.car.brand} {selectedSale.car.model}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Customer</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-gray-900">{selectedSale.customerName}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-gray-900">{selectedSale.customerEmail}</p>
                                    </div>
                                    {selectedSale.customerPhone && (
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-semibold text-gray-900">{selectedSale.customerPhone}</p>
                                        </div>
                                    )}
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-semibold text-gray-900">{selectedSale.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Salesperson Information */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Salesperson</h4>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="font-semibold text-gray-900">
                                        {selectedSale.salesperson.firstName} {selectedSale.salesperson.lastName}
                                    </p>
                                    <p className="text-gray-600">@{selectedSale.salesperson.username}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedSale.notes && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-gray-700">{selectedSale.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => printReceipt(selectedSale)}
                                    className="flex-1"
                                    icon={Printer}
                                >
                                    Print Receipt
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        window.open(`mailto:${selectedSale.customerEmail}?subject=Your Purchase from JajiAutos&body=Dear ${selectedSale.customerName}, thank you for your purchase of ${selectedSale.car.name}.`);
                                    }}
                                    className="flex-1"
                                    icon={Mail}
                                >
                                    Email Customer
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Add Sale Modal */}
                <AddSaleModal
                    isOpen={showAddSale}
                    onClose={() => setShowAddSale(false)}
                    onSaleAdded={handleSaleAdded}
                />
            </div>
        </div>
    );
};

export default SalesManagement;