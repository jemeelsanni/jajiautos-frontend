// src/components/admin/addCarRoute.tsx - Updated with image upload functionality
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../common/button';
import { Card } from '../common/card';
import ApiService from '../../services/api';
import type { CarFormData, Car } from '../../types/car';

interface AddCarRouteProps {
    onCarAdded?: () => void;
}

interface ImageFile {
    file: File;
    preview: string;
    id: string;
}

const AddCarRoute = ({ onCarAdded }: AddCarRouteProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [formData, setFormData] = useState<CarFormData>({
        name: '',
        price: '',
        originalPrice: '',
        images: '', // This will be populated with uploaded image URLs
        category: '',
        year: '',
        mileage: '',
        fuel: 'Gasoline',
        transmission: 'Automatic',
        engine: '',
        horsepower: '',
        description: '',
        features: '',
        inStock: '',
        warranty: '4 years / 50,000 miles',
        brand: '',
        model: '',
        torque: '',
        acceleration: '',
        topSpeed: '',
        fuelEconomy: '',
        drivetrain: 'FWD',
        exteriorColor: '',
        interiorColor: '',
        vin: '',
        safetyFeatures: '',
        featured: false
    });

    // Handle file selection
    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newImageFiles: ImageFile[] = [];
        const maxFiles = 6; // Limit to 6 images
        const maxSize = 5 * 1024 * 1024; // 5MB per file

        for (let i = 0; i < Math.min(files.length, maxFiles - imageFiles.length); i++) {
            const file = files[i];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file`);
                continue;
            }

            // Validate file size
            if (file.size > maxSize) {
                alert(`${file.name} is too large. Maximum size is 5MB`);
                continue;
            }

            // Create preview
            const preview = URL.createObjectURL(file);
            const id = `${Date.now()}-${Math.random()}`;

            newImageFiles.push({ file, preview, id });
        }

        setImageFiles(prev => [...prev, ...newImageFiles]);
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Remove image
    const removeImage = (id: string) => {
        setImageFiles(prev => {
            const updated = prev.filter(img => img.id !== id);
            // Clean up preview URL
            const removed = prev.find(img => img.id === id);
            if (removed) {
                URL.revokeObjectURL(removed.preview);
            }
            return updated;
        });
    };

    // Upload images to server
    const uploadImages = async (): Promise<string[]> => {
        if (imageFiles.length === 0) {
            throw new Error('Please select at least one image');
        }

        setUploadingImages(true);
        try {
            const uploadedUrls: string[] = [];

            for (const imageFile of imageFiles) {
                const formData = new FormData();
                formData.append('image', imageFile.file);
                formData.append('folder', 'cars'); // Organize uploads in folders

                try {
                    // Use your API service to upload each image
                    const response = await ApiService.uploadImage(formData);
                    uploadedUrls.push(response.url);
                } catch (error) {
                    console.error(`Failed to upload ${imageFile.file.name}:`, error);
                    throw new Error(`Failed to upload ${imageFile.file.name}`);
                }
            }

            return uploadedUrls;
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category ||
            !formData.year || !formData.description || !formData.features || !formData.inStock ||
            !formData.brand || !formData.model) {
            alert('Please fill in all required fields');
            return;
        }

        if (imageFiles.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        setLoading(true);
        try {
            // Upload images first
            const uploadedImageUrls = await uploadImages();

            const carData: Partial<Car> = {
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                make: formData.brand,
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
                images: uploadedImageUrls, // Use uploaded URLs
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

            await ApiService.createCar(carData);
            setShowSuccessMessage(true);
            onCarAdded?.();

            // Clean up image previews
            imageFiles.forEach(img => URL.revokeObjectURL(img.preview));

            // Auto redirect after success
            setTimeout(() => {
                navigate('/admin/inventory');
            }, 2000);
        } catch (error) {
            console.error('Error creating car:', error);
            alert(error instanceof Error ? error.message : 'Failed to add vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', price: '', originalPrice: '', images: '', category: '', year: '', mileage: '',
            fuel: 'Gasoline', transmission: 'Automatic', engine: '', horsepower: '', description: '',
            features: '', inStock: '', warranty: '4 years / 50,000 miles', brand: '', model: '',
            torque: '', acceleration: '', topSpeed: '', fuelEconomy: '', drivetrain: 'FWD',
            exteriorColor: '', interiorColor: '', vin: '', safetyFeatures: '', featured: false
        });

        // Clean up image previews
        imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
        setImageFiles([]);
    };

    if (showSuccessMessage) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center min-h-96">
                        <Card className="p-8 text-center max-w-md">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Added Successfully!</h2>
                            <p className="text-gray-600 mb-6">The vehicle has been added to your inventory.</p>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => navigate('/admin/inventory')} className="flex-1">
                                    View Inventory
                                </Button>
                                <Button onClick={() => {
                                    setShowSuccessMessage(false);
                                    resetForm();
                                }} className="flex-1">
                                    Add Another Vehicle
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
                    <Button variant="ghost" onClick={() => navigate('/admin/inventory')} icon={ArrowLeft}>
                        Back to Inventory
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Add New Vehicle</h1>
                        <p className="text-gray-600 mt-2">Add a new vehicle to your inventory</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                            <div className="space-y-4">
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
                        </Card>

                        {/* Technical Specifications */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                            <div className="space-y-4">
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
                        </Card>
                    </div>

                    {/* Image Upload Section */}
                    <Card className="p-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Images *</h3>

                        {/* Upload Area */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">
                                Drag and drop images here, or click to select
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Upload up to 6 images (JPG, PNG, WebP - Max 5MB each)
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e.target.files)}
                                className="hidden"
                                id="image-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('image-upload')?.click()}
                                icon={Upload}
                            >
                                Select Images
                            </Button>
                        </div>

                        {/* Image Previews */}
                        {imageFiles.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">
                                    Selected Images ({imageFiles.length}/6)
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {imageFiles.map((imageFile) => (
                                        <div key={imageFile.id} className="relative group">
                                            <img
                                                src={imageFile.preview}
                                                alt={imageFile.file.name}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(imageFile.id)}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                {imageFile.file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Description and Features */}
                    <Card className="p-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description & Features</h3>
                        <div className="space-y-4">
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
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/admin/inventory')}
                            className="flex-1"
                            disabled={loading || uploadingImages}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            icon={loading || uploadingImages ? undefined : Plus}
                            loading={loading || uploadingImages}
                            disabled={loading || uploadingImages}
                        >
                            {uploadingImages ? 'Uploading Images...' : loading ? 'Adding Vehicle...' : 'Add Vehicle'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCarRoute;