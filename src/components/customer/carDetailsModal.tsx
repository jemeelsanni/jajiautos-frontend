import { useState } from 'react';
import { Modal } from '../common/modal';
import { Button } from '../common/button';
import Badge from '../common/badge';
import type { Car } from "../../types/car";
import { Eye, Settings, Shield, Star, CheckCircle, CreditCard, Calendar, Phone, Package } from 'lucide-react';



interface CarDetailsModalProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (car: Car) => void;
    onTestDrive: (car: Car) => void;
}

export default function CarDetailsModal({ car, isOpen, onClose, onPurchase, onTestDrive }: CarDetailsModalProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!car) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'specs', label: 'Specifications', icon: Settings },
        { id: 'features', label: 'Features', icon: Shield },
        { id: 'reviews', label: 'Reviews', icon: Star }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={car.name} size="full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                        <img
                            src={car.images[currentImageIndex]}
                            alt={car.name}
                            className="w-full h-full object-cover"
                        />
                        {car.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : car.images.length - 1)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev < car.images.length - 1 ? prev + 1 : 0)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                                >
                                    →
                                </button>
                            </>
                        )}
                    </div>

                    {car.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {car.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                >
                                    <img src={image} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {car.isNew && <Badge variant="success">New</Badge>}
                            {car.dealType && <Badge variant="primary">{car.dealType}</Badge>}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-4xl font-bold text-red-600">₦{car.price.toLocaleString()}</span>
                                {car.originalPrice && car.originalPrice > car.price && (
                                    <span className="text-xl text-gray-500 line-through ml-3">
                                        ₦{car.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={20} fill="currentColor" />
                                <span className="text-lg font-medium">{car.rating}</span>
                                <span className="text-gray-500">({car.reviews})</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">{car.description}</p>
                    </div>

                    {/* Tabs */}
                    <div>
                        <div className="flex border-b border-gray-200">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === id
                                        ? 'text-red-600 border-b-2 border-red-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Year', value: car.year },
                                        { label: 'Mileage', value: `${car.mileage.toLocaleString()} km` },
                                        { label: 'Engine', value: car.engine },
                                        { label: 'Horsepower', value: `${car.horsepower} hp` },
                                        { label: 'Fuel Type', value: car.fuel },
                                        { label: 'Transmission', value: car.transmission },
                                        { label: 'Drivetrain', value: car.drivetrain },
                                        { label: 'Top Speed', value: car.topSpeed }
                                    ].map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-500 block">{item.label}</span>
                                            <span className="font-semibold text-gray-900">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900">Performance</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span>Acceleration (0-60mph):</span><span className="font-medium">{car.acceleration}</span></div>
                                                <div className="flex justify-between"><span>Top Speed:</span><span className="font-medium">{car.topSpeed}</span></div>
                                                <div className="flex justify-between"><span>Horsepower:</span><span className="font-medium">{car.horsepower} hp</span></div>
                                                <div className="flex justify-between"><span>Torque:</span><span className="font-medium">{car.torque}</span></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900">Efficiency</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span>Fuel Economy:</span><span className="font-medium">{car.fuelEconomy}</span></div>
                                                <div className="flex justify-between"><span>Engine:</span><span className="font-medium">{car.engine}</span></div>
                                                <div className="flex justify-between"><span>Transmission:</span><span className="font-medium">{car.transmission}</span></div>
                                                <div className="flex justify-between"><span>Drivetrain:</span><span className="font-medium">{car.drivetrain}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Standard Features</h4>
                                            <div className="space-y-2">
                                                {car.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-green-600" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Safety Features</h4>
                                            <div className="space-y-2">
                                                {(car.safetyFeatures ?? []).map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Shield size={16} className="text-blue-600" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-gray-900">{car.rating}</div>
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill={i < Math.floor(car.rating ?? 0) ? 'currentColor' : 'none'} />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium">Excellent</p>
                                            <p className="text-sm text-gray-600">{car.reviews} customer reviews</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">Customer reviews and detailed feedback would be displayed here.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <Button
                            className="flex-1"
                            onClick={() => onPurchase(car)}
                            icon={CreditCard}
                        >
                            Buy Now - ₦{car.price.toLocaleString()}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onTestDrive(car)}
                            icon={Calendar}
                        >
                            Test Drive
                        </Button>
                        <Button variant="ghost" icon={Phone}>
                            Call
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            <Shield size={16} />
                            <span>{car.warranty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Package size={16} />
                            <span>{car.inStock} in stock</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};