// src/components/admin/addSaleRoute.tsx - Fixed version without modal wrapper
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Search, Plus, User, Mail, Phone, CreditCard } from 'lucide-react';
import { Button } from '../common/button';
import { Card } from '../common/card';
import ApiService from '../../services/api';
import type { Car } from '../../types/car';

interface AddSaleRouteProps {
    onSaleAdded?: () => void;
}

const AddSaleRoute = ({ onSaleAdded }: AddSaleRouteProps) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [cars, setCars] = useState<Car[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        paymentMethod: 'card',
        notes: ''
    });

    const paymentMethods = [
        { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
        { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
        { value: 'cash', label: 'Cash', icon: CreditCard },
        { value: 'financing', label: 'Financing', icon: CreditCard }
    ];

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getCars({ limit: '100' });
            setCars((response.cars || []).filter((car: Car) => car.inStock > 0));
        } catch (error) {
            console.error('Error fetching cars:', error);
            // Mock data fallback
            setCars([
                {
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
                    inStock: 5
                },
                {
                    id: '2',
                    name: 'BMW X5 2023',
                    brand: 'BMW',
                    model: 'X5',
                    make: 'BMW',
                    price: 45000000,
                    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&q=80'],
                    category: 'Luxury SUV',
                    year: 2023,
                    mileage: 0,
                    fuel: 'Gasoline',
                    transmission: 'Automatic',
                    description: 'Luxury SUV',
                    features: ['Premium Sound', 'Navigation', 'Leather Seats'],
                    inStock: 3
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCarSelect = (car: Car) => {
        setSelectedCar(car);
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!selectedCar) return;

        if (!formData.customerName || !formData.customerEmail) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await ApiService.createSale({
                carId: selectedCar.id,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                amount: selectedCar.price,
                paymentMethod: formData.paymentMethod,
                notes: formData.notes
            });

            setShowSuccess(true);
            onSaleAdded?.();

            // Auto redirect after success
            setTimeout(() => {
                navigate('/admin/sales');
            }, 2000);
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Failed to record sale. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setSelectedCar(null);
        setSearchTerm('');
        setFormData({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            paymentMethod: 'card',
            notes: ''
        });
        setShowSuccess(false);
    };

    if (showSuccess) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center min-h-96">
                        <Card className="p-8 text-center max-w-md">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Recorded Successfully!</h2>
                            <p className="text-gray-600 mb-6">The sale has been added to your records.</p>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => navigate('/admin/sales')} className="flex-1">
                                    View Sales
                                </Button>
                                <Button onClick={resetForm} className="flex-1">
                                    Add Another Sale
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} icon={ArrowLeft}>
                        Back to Dashboard
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Record New Sale</h1>
                        <p className="text-gray-600 mt-2">Add a new vehicle sale to your records</p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            1
                        </div>
                        <div className={`w-16 h-1 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            2
                        </div>
                    </div>
                </div>

                {/* Step 1: Vehicle Selection */}
                {step === 1 && (
                    <Card className="p-8 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Vehicle</h2>

                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Vehicle List */}
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading vehicles...</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto space-y-3">
                                {filteredCars.map((car) => (
                                    <div
                                        key={car.id}
                                        onClick={() => handleCarSelect(car)}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={car.images[0]}
                                                alt={car.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{car.name}</h4>
                                                <p className="text-gray-600">{car.category}</p>
                                                <p className="text-sm text-gray-500">{car.inStock} in stock</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-red-600">₦{car.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {filteredCars.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">No vehicles found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                )}

                {/* Step 2: Customer Information */}
                {step === 2 && selectedCar && (
                    <Card className="p-8 max-w-4xl mx-auto">
                        {/* Selected Car Summary */}
                        <div className="bg-gray-50 p-4 rounded-xl mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Vehicle</h3>
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedCar.images[0]}
                                    alt={selectedCar.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedCar.name}</h4>
                                    <p className="text-gray-600">{selectedCar.category}</p>
                                    <p className="text-xl font-bold text-red-600">₦{selectedCar.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Customer Name *"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address *"
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === method.value
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={method.value}
                                                checked={formData.paymentMethod === method.value}
                                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                className="sr-only"
                                            />
                                            <method.icon size={20} className="text-gray-600" />
                                            <span className="font-medium text-gray-900">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Any additional notes about this sale..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setStep(1)}
                                    className="flex-1"
                                    disabled={submitting}
                                >
                                    Back to Selection
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!formData.customerName || !formData.customerEmail || submitting}
                                    loading={submitting}
                                    className="flex-1"
                                    icon={submitting ? undefined : Plus}
                                >
                                    {submitting ? 'Recording Sale...' : 'Record Sale'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AddSaleRoute;