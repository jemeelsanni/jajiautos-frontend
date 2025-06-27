import { Card } from '../common/card';
import { useState } from 'react';
import { Heart, Eye, Share2, Calendar, Star, Zap, Settings, Package, Phone } from 'lucide-react';
import Badge from '../common/badge';
import { Button } from '../common/button';

import type { Car } from "../../types/car";

interface CarCardProps {
    car: Car;
    onViewDetails: (car: Car) => void;
    onAddToFavorites: (car: Car) => void;
    isFavorite?: boolean;
}

export const CarCard = ({ car, onViewDetails, onAddToFavorites, isFavorite = false }: CarCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const savings = (car.originalPrice ?? 0) - car.price;
    const savingsPercent = Math.round((savings / (car.originalPrice ?? 1)) * 100);

    return (
        <Card className="group" hover>
            <div className="relative overflow-hidden">
                <div
                    className="relative h-64"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        src={car.images[currentImageIndex]}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Image Indicators */}
                    {car.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {car.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {car.isNew && <Badge variant="success">New</Badge>}
                        {car.dealType && <Badge variant="primary">{car.dealType}</Badge>}
                        {savings > 0 && <Badge variant="warning">Save ${savings.toLocaleString()}</Badge>}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={() => onAddToFavorites(car)}
                        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    {/* Quick Actions */}
                    <div className={`absolute inset-x-4 bottom-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => onViewDetails(car)}>
                                <Eye size={16} />
                                View
                            </Button>
                            <Button variant="outline" size="sm" icon={Share2}>
                                Share
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                            {car.name}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                            <Calendar size={16} />
                            {car.category} • {car.year}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-red-600">
                                    ₦{car.price.toLocaleString()}
                                </span>
                                {savings > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ₦{(car.originalPrice ?? 0).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {savingsPercent > 0 && (
                                <p className="text-sm text-green-600 font-medium">
                                    Save {savingsPercent}%
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={16} fill="currentColor" />
                                <span className="font-medium">{car.rating}</span>
                            </div>
                            <p className="text-sm text-gray-500">{car.reviews} reviews</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Zap className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                            <span className="font-medium">{car.horsepower}hp</span>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Settings className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                            <span className="font-medium">{car.transmission}</span>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Package className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                            <span className="font-medium">{car.inStock} left</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => onViewDetails(car)}>
                            View Details
                        </Button>
                        <Button variant="outline" icon={Phone}>
                            Call
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};