import { useState } from 'react';
import { Modal } from '../common/modal';
import { CheckCircle, CreditCard, DollarSign, FileText, Shield } from 'lucide-react';
import { Button } from '../common/button';

import { Car } from '../../types/car';

interface PaymentModalProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: (car: Car) => void;
}


export const PaymentModal = ({ car, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        email: '',
        phone: ''
    });

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess(car);
            onClose();
        }, 3000);
    };

    if (!car) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Secure Payment" size="lg">
            <div className="space-y-8">
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <img src={car.image} alt={car.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                            <h4 className="font-medium text-gray-900">{car.name}</h4>
                            <p className="text-gray-600">{car.category} • {car.year}</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Vehicle Price:</span>
                            <span>₦{car.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Documentation Fee:</span>
                            <span>₦50,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Insurance (1 year):</span>
                            <span>₦125,000</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg text-red-600">
                            <span>Total:</span>
                            <span>₦{(car.price + 175000).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard' },
                            { id: 'bank', label: 'Bank Transfer', icon: DollarSign, desc: 'Direct transfer' },
                            { id: 'financing', label: 'Financing', icon: FileText, desc: 'Monthly payments' }
                        ].map((method) => (
                            <label
                                key={method.id}
                                className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="sr-only"
                                />
                                <method.icon className="w-8 h-8 mb-2 text-gray-600" />
                                <span className="font-medium text-gray-900">{method.label}</span>
                                <span className="text-sm text-gray-500">{method.desc}</span>
                                {paymentMethod === method.id && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Payment Form */}
                {paymentMethod === 'card' && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Card Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Cardholder Name"
                            value={formData.cardName}
                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />
                        <input
                            type="text"
                            placeholder="Card Number (1234 5678 9012 3456)"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={formData.cvv}
                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                )}

                {paymentMethod === 'bank' && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Bank Transfer Details</h3>
                        <div className="space-y-2 text-sm">
                            <div><strong>Bank:</strong> First Bank Nigeria</div>
                            <div><strong>Account Name:</strong> JajiAutos Limited</div>
                            <div><strong>Account Number:</strong> 1234567890</div>
                            <div><strong>Reference:</strong> {car.name.replace(/\s+/g, '').toUpperCase()}-{Date.now()}</div>
                        </div>
                    </div>
                )}

                {paymentMethod === 'financing' && (
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Financing Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg border">
                                <div className="font-medium">12 Months</div>
                                <div className="text-2xl font-bold text-green-600">₦{Math.round((car.price + 175000) / 12).toLocaleString()}/month</div>
                                <div className="text-sm text-gray-600">0% Interest</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border">
                                <div className="font-medium">24 Months</div>
                                <div className="text-2xl font-bold text-green-600">₦{Math.round((car.price + 175000) / 24).toLocaleString()}/month</div>
                                <div className="text-sm text-gray-600">2.5% Interest</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Notice */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-medium text-gray-900">Secure Payment</p>
                        <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handlePayment}
                        disabled={isProcessing}
                        loading={isProcessing}
                        icon={!isProcessing ? CreditCard : undefined}
                    >
                        {isProcessing ? 'Processing Payment...' : `Pay ₦${(car.price + 175000).toLocaleString()}`}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};