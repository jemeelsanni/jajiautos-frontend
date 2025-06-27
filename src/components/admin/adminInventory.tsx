// src/components/admin/adminInventory.tsx
import { useState, useEffect } from "react";
import type { Car, CarFormData } from "../../types/car";
import { Button } from "../common/button";
import { Edit, Package, Plus, Search, Trash2 } from "lucide-react";
import Badge from "../common/badge";
import { Card } from "../common/card";
import { Modal } from "../common/modal";
import ApiService from "../../services/api";

interface AdminInventoryProps {
    onCarAdded?: () => void;
    onCarUpdated?: () => void;
    onCarDeleted?: () => void;
}

const AdminInventory = ({ onCarAdded, onCarUpdated, onCarDeleted }: AdminInventoryProps) => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<CarFormData>({
        name: '', price: '', originalPrice: '', images: '', category: '', year: '', mileage: '',
        fuel: 'Gasoline', transmission: 'Automatic', engine: '', horsepower: '', description: '',
        features: '', inStock: '', warranty: '4 years / 50,000 miles', brand: '', model: '',
        torque: '', acceleration: '', topSpeed: '', fuelEconomy: '', drivetrain: 'FWD',
        exteriorColor: '', interiorColor: '', vin: '', safetyFeatures: '', featured: false
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getCars({ limit: '100' });
            setCars(response.cars || []);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            name: '', price: '', originalPrice: '', images: '', category: '', year: '', mileage: '',
            fuel: 'Gasoline', transmission: 'Automatic', engine: '', horsepower: '', description: '',
            features: '', inStock: '', warranty: '4 years / 50,000 miles', brand: '', model: '',
            torque: '', acceleration: '', topSpeed: '', fuelEconomy: '', drivetrain: 'FWD',
            exteriorColor: '', interiorColor: '', vin: '', safetyFeatures: '', featured: false
        });
        setEditingCar(null);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.images || !formData.category ||
            !formData.year || !formData.description || !formData.features || !formData.inStock ||
            !formData.brand || !formData.model) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            const carData: Partial<Car> = {
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                make: formData.brand, // Add make property equal to brand
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
                images: formData.images.split(',').map(url => url.trim()),
                category: formData.category,
                year: parseInt(formData.year),
                mileage: parseInt(formData.mileage) || 0,
                fuel: formData.fuel,
                transmission: formData.transmission,
                engine: formData.engine || undefined,
                horsepower: parseInt(formData.horsepower) || undefined,
                torque: formData.torque || undefined,
                acceleration: formData.acceleration || undefined,
                topSpeed: formData.topSpeed || undefined,
                fuelEconomy: formData.fuelEconomy || undefined,
                drivetrain: formData.drivetrain || undefined,
                exteriorColor: formData.exteriorColor || undefined,
                interiorColor: formData.interiorColor || undefined,
                vin: formData.vin || undefined,
                description: formData.description,
                features: formData.features.split(',').map(f => f.trim()),
                safetyFeatures: formData.safetyFeatures ? formData.safetyFeatures.split(',').map(f => f.trim()) : undefined,
                inStock: parseInt(formData.inStock),
                warranty: formData.warranty || undefined,
                featured: formData.featured,
                status: Number(formData.inStock) > 0 ? 'available' as const : 'reserved' as const,
                isNew: true
            };

            if (editingCar) {
                await ApiService.updateCar(editingCar.id, carData);
                alert('Vehicle updated successfully!');
                onCarUpdated?.();
            } else {
                await ApiService.createCar(carData);
                alert('Vehicle added successfully!');
                onCarAdded?.();
            }

            await fetchCars();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving car:', error);
            alert('Failed to save vehicle. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (car: Car): void => {
        setEditingCar(car);
        setFormData({
            name: car.name,
            brand: car.brand,
            model: car.model,
            price: car.price.toString(),
            originalPrice: car.originalPrice?.toString() || car.price.toString(),
            images: car.images.join(', '),
            category: car.category,
            year: car.year.toString(),
            mileage: car.mileage.toString(),
            fuel: car.fuel,
            transmission: car.transmission,
            engine: car.engine || '',
            horsepower: car.horsepower?.toString() || '',
            torque: car.torque || '',
            acceleration: car.acceleration || '',
            topSpeed: car.topSpeed || '',
            fuelEconomy: car.fuelEconomy || '',
            drivetrain: car.drivetrain || 'FWD',
            exteriorColor: car.exteriorColor || '',
            interiorColor: car.interiorColor || '',
            vin: car.vin || '',
            description: car.description,
            features: car.features.join(', '),
            safetyFeatures: car.safetyFeatures?.join(', ') || '',
            inStock: car.inStock.toString(),
            warranty: car.warranty || '4 years / 50,000 miles',
            featured: car.featured || false
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (carId: string) => {
        if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
            return;
        }

        try {
            await ApiService.deleteCar(carId);
            alert('Vehicle deleted successfully!');
            await fetchCars();
            onCarDeleted?.();
        } catch (error) {
            console.error('Error deleting car:', error);
            alert('Failed to delete vehicle. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading inventory...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Inventory Management</h1>
                        <p className="text-gray-600 mt-2">Manage your vehicle inventory with ease</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} icon={Plus} size="lg">
                        Add New Vehicle
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card className="p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package size={16} />
                            {filteredCars.length} vehicles found
                        </div>
                    </div>
                </Card>

                {/* Inventory Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCars.map((car) => (
                                    <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-20 w-20 rounded-xl object-cover mr-4" src={car.images[0]} alt={car.name} />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{car.name}</div>
                                                    <div className="text-sm text-gray-500">{car.year} • {car.engine || 'N/A'}</div>
                                                    {car.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="default">{car.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">₦{car.price.toLocaleString()}</div>
                                            {car.originalPrice && car.originalPrice > car.price && (
                                                <div className="text-xs text-gray-500 line-through">₦{car.originalPrice.toLocaleString()}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={Number(car.inStock) > 2 ? 'success' : 'warning'}>
                                                {car.inStock} units
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={Number(car.inStock) > 0 ? 'success' : 'danger'}>
                                                {Number(car.inStock) > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(car)}
                                                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit vehicle"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(car.id)}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete vehicle"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCars.length === 0 && (
                        <div className="text-center py-16">
                            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or add a new vehicle</p>
                        </div>
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
                    size="xl"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                            <input
                                type="text"
                                placeholder="Vehicle Name *"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Brand *"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Model *"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Price *"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Original Price"
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Image URLs (comma separated) *"
                                value={formData.images}
                                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Category *"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Year *"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Featured Vehicle
                                </label>
                            </div>
                        </div>

                        {/* Technical Specifications */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Mileage (km)"
                                    value={formData.mileage}
                                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    placeholder="Horsepower"
                                    value={formData.horsepower}
                                    onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Engine (e.g., 3.0L V6 Turbo)"
                                value={formData.engine}
                                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Torque"
                                    value={formData.torque}
                                    onChange={(e) => setFormData({ ...formData, torque: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Top Speed"
                                    value={formData.topSpeed}
                                    onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Acceleration (0-60)"
                                    value={formData.acceleration}
                                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Fuel Economy"
                                    value={formData.fuelEconomy}
                                    onChange={(e) => setFormData({ ...formData, fuelEconomy: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={formData.fuel}
                                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                <select
                                    value={formData.transmission}
                                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                    <option value="CVT">CVT</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={formData.drivetrain}
                                    onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="FWD">Front-Wheel Drive</option>
                                    <option value="RWD">Rear-Wheel Drive</option>
                                    <option value="AWD">All-Wheel Drive</option>
                                    <option value="4WD">4-Wheel Drive</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Stock Quantity *"
                                    value={formData.inStock}
                                    onChange={(e) => setFormData({ ...formData, inStock: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Exterior Color"
                                    value={formData.exteriorColor}
                                    onChange={(e) => setFormData({ ...formData, exteriorColor: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Interior Color"
                                    value={formData.interiorColor}
                                    onChange={(e) => setFormData({ ...formData, interiorColor: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="VIN Number"
                                value={formData.vin}
                                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Description and Features */}
                    <div className="mt-6 space-y-4">
                        <textarea
                            placeholder="Vehicle Description *"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={3}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Features (comma separated) *"
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Safety Features (comma separated)"
                            value={formData.safetyFeatures}
                            onChange={(e) => setFormData({ ...formData, safetyFeatures: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="Warranty"
                            value={formData.warranty}
                            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="flex-1"
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1"
                            icon={editingCar ? Edit : Plus}
                            loading={submitting}
                            disabled={submitting}
                        >
                            {editingCar ? 'Update Vehicle' : 'Add Vehicle'}
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default AdminInventory;