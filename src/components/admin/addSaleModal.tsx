import { useState, useEffect } from 'react';
import { Modal } from '../common/modal';
import { Button } from '../common/button';
import { Search, Plus, User, Mail, Phone, CreditCard } from 'lucide-react';

interface Car {
    id: string;
    name: string;
    brand: string;
    model: string;
    price: number;
    category: string;
    images: string[];
    inStock: number;
}

interface AddSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaleAdded: () => void;
}

export default function AddSaleModal({ isOpen, onClose, onSaleAdded }: AddSaleModalProps) {
    const [step, setStep] = useState(1);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [cars, setCars] = useState<Car[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
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
        if (isOpen) {
            fetchCars();
        }
    }, [isOpen]);

    const fetchCars = async () => {
        try {
            const response = await fetch('/api/cars?limit=100', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCars(data.cars.filter((car: Car) => car.inStock > 0));
        } catch (error) {
            console.error('Error fetching cars:', error);
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

        setLoading(true);
        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    carId: selectedCar.id,
                    customerName: formData.customerName,
                    customerEmail: formData.customerEmail,
                    customerPhone: formData.customerPhone,
                    amount: selectedCar.price,
                    paymentMethod: formData.paymentMethod,
                    notes: formData.notes
                })
            });

            if (response.ok) {
                onSaleAdded();
                handleClose();
                alert('Sale recorded successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Failed to record sale');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
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
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Record New Sale" size="lg">
            {step === 1 && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Vehicle</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

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
                </div>
            )}

            {step === 2 && selectedCar && (
                <div className="space-y-6">
                    {/* Selected Car Summary */}
                    <div className="bg-gray-50 p-4 rounded-xl">
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
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Customer Name"
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
                                    placeholder="Email Address"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
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
                        </div>
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
                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => setStep(1)}
                            className="flex-1"
                        >
                            Back to Selection
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.customerName || !formData.customerEmail || loading}
                            loading={loading}
                            className="flex-1"
                            icon={Plus}
                        >
                            Record Sale
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}