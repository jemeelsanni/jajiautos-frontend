// src/components/admin/reports.tsx
import { useState } from 'react';
import { Card } from '../common/card';
import { Button } from '../common/button';
import { Modal } from '../common/modal';
import Badge from '../common/badge';
import {
    FileText,
    Download,
    Calendar,
    BarChart3,
    DollarSign,
    Package,
    Users,
    TrendingUp,
    Eye,
    Plus,
    Filter,
    FileSpreadsheet,
    Clock
} from 'lucide-react';
import type { ReportData, ReportFilter, Sale, Car, User } from '../../types/car';

interface ReportsProps {
    sales?: Sale[];
    cars?: Car[];
    users?: User[];
}

const Reports = ({ sales = [], cars = [], users = [] }: ReportsProps) => {
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [reportFilter, setReportFilter] = useState<ReportFilter>({
        dateRange: '30',
        reportType: 'sales',
        format: 'pdf',
        includeCharts: true
    });
    const [generatedReports, setGeneratedReports] = useState<ReportData[]>([
        {
            type: 'sales',
            title: 'Monthly Sales Report - December 2024',
            dateRange: { start: '2024-12-01', end: '2024-12-31' },
            data: {},
            generatedAt: '2025-01-01T00:00:00Z',
            generatedBy: 'Admin User'
        },
        {
            type: 'inventory',
            title: 'Inventory Status Report',
            dateRange: { start: '2024-12-01', end: '2024-12-31' },
            data: {},
            generatedAt: '2024-12-30T00:00:00Z',
            generatedBy: 'Inventory Manager'
        }
    ]);

    const reportTypes = [
        {
            id: 'sales',
            name: 'Sales Report',
            description: 'Comprehensive sales performance and customer data',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 'inventory',
            name: 'Inventory Report',
            description: 'Vehicle stock levels and inventory metrics',
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            id: 'financial',
            name: 'Financial Report',
            description: 'Revenue, profit margins, and financial analytics',
            icon: BarChart3,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            id: 'customer',
            name: 'Customer Report',
            description: 'Customer behavior and satisfaction metrics',
            icon: Users,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    const generateReport = async () => {
        setLoading(true);
        try {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newReport: ReportData = {
                type: reportFilter.reportType as 'sales' | 'inventory' | 'financial' | 'customer',
                title: `${reportTypes.find(t => t.id === reportFilter.reportType)?.name} - ${new Date().toLocaleDateString()}`,
                dateRange: {
                    start: new Date(Date.now() - parseInt(reportFilter.dateRange) * 24 * 60 * 60 * 1000).toISOString(),
                    end: new Date().toISOString()
                },
                data: { sales: sales.length, cars: cars.length, users: users.length },
                generatedAt: new Date().toISOString(),
                generatedBy: 'Current User'
            };

            setGeneratedReports(prev => [newReport, ...prev]);
            setShowCreateModal(false);
            alert('Report generated successfully!');
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = (report: ReportData) => {
        // Simulate download
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getReportIcon = (type: string) => {
        const reportType = reportTypes.find(t => t.id === type);
        return reportType?.icon || FileText;
    };

    type BadgeVariant = 'success' | 'primary' | 'warning' | 'info' | 'default';

    const getReportBadgeVariant = (type: string): BadgeVariant => {
        switch (type) {
            case 'sales': return 'success';
            case 'inventory': return 'primary';
            case 'financial': return 'warning';
            case 'customer': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-600 mt-2">Generate and manage business reports</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} icon={Plus} size="lg">
                        Generate Report
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Sales', value: sales.length, icon: DollarSign, color: 'text-green-600' },
                        { label: 'Vehicles', value: cars.length, icon: Package, color: 'text-blue-600' },
                        { label: 'Users', value: users.length, icon: Users, color: 'text-purple-600' },
                        { label: 'Reports Generated', value: generatedReports.length, icon: FileText, color: 'text-orange-600' }
                    ].map((stat, index) => (
                        <Card key={index} className="p-6">
                            <div className="flex items-center">
                                <stat.icon className={`w-8 h-8 ${stat.color} mr-3`} />
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Report Types */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Available Report Types</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {reportTypes.map((type) => (
                            <div
                                key={type.id}
                                className="p-6 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer"
                                onClick={() => {
                                    setReportFilter(prev => ({ ...prev, reportType: type.id }));
                                    setShowCreateModal(true);
                                }}
                            >
                                <div className={`w-12 h-12 ${type.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                    <type.icon className={`w-6 h-6 ${type.color}`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                                <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Generated Reports */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Generated Reports</h2>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                                <option value="">All Types</option>
                                {reportTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {generatedReports.map((report, index) => {
                            const IconComponent = getReportIcon(report.type);
                            return (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-100 rounded-lg">
                                            <IconComponent className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Generated {new Date(report.generatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={getReportBadgeVariant(report.type)}>
                                            {reportTypes.find(t => t.id === report.type)?.name}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Preview report"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => downloadReport(report)}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Download report"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {generatedReports.length === 0 && (
                        <div className="text-center py-16">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports generated yet</h3>
                            <p className="text-gray-600 mb-4">Create your first report to get started</p>
                            <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
                                Generate First Report
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Create Report Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Generate New Report"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Report Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportTypes.map((type) => (
                                    <label
                                        key={type.id}
                                        className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${reportFilter.reportType === type.id
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={type.id}
                                            checked={reportFilter.reportType === type.id}
                                            onChange={(e) => setReportFilter(prev => ({ ...prev, reportType: e.target.value }))}
                                            className="sr-only"
                                        />
                                        <div className={`w-8 h-8 ${type.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                                            <type.icon className={`w-4 h-4 ${type.color}`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{type.name}</div>
                                            <div className="text-sm text-gray-600">{type.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <select
                                value={reportFilter.dateRange}
                                onChange={(e) => setReportFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="365">Last year</option>
                                <option value="all">All time</option>
                            </select>
                        </div>

                        {/* Format Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                            <div className="flex gap-4">
                                {[
                                    { id: 'pdf', label: 'PDF', icon: FileText },
                                    { id: 'csv', label: 'CSV', icon: FileSpreadsheet },
                                    { id: 'excel', label: 'Excel', icon: FileSpreadsheet }
                                ].map((format) => (
                                    <label
                                        key={format.id}
                                        className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${reportFilter.format === format.id
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={format.id}
                                            checked={reportFilter.format === format.id}
                                            onChange={(e) => setReportFilter(prev => ({ ...prev, format: e.target.value as 'pdf' | 'csv' | 'excel' }))}
                                            className="sr-only"
                                        />
                                        <format.icon className="w-5 h-5 mr-2 text-gray-600" />
                                        <span className="font-medium">{format.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Options */}
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={reportFilter.includeCharts}
                                    onChange={(e) => setReportFilter(prev => ({ ...prev, includeCharts: e.target.checked }))}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Include charts and visualizations</span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={generateReport}
                                className="flex-1"
                                icon={loading ? undefined : TrendingUp}
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Report'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Reports;