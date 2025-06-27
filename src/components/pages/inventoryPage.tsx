import { useState, useEffect } from "react";
import Badge from "../common/badge";
import { Filter, Package, Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { Card } from "../common/card";
import { Button } from "../common/button";
import { CarCard } from "../customer/carCard";
import { SkeletonCard, ComponentLoading } from "../common/spinner";
import ApiService from "../../services/api";
import type { Car } from "../../types/car";

interface InventoryPageProps {
    cars?: Car[];
    onViewDetails: (car: Car) => void;
    loading?: boolean;
}

const InventoryPage = ({ cars: propCars = [], onViewDetails, loading: propLoading = false }: InventoryPageProps) => {
    // State management
    const [cars, setCars] = useState<Car[]>(propCars);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
    const [yearRange, setYearRange] = useState({ min: 2000, max: new Date().getFullYear() });
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<(string | number)[]>([]);
    const [loading, setLoading] = useState(propLoading);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(12);

    // Derived data
    const categories = [...new Set(cars.map(car => car.category))].sort();
    const brands = [...new Set(cars.map(car => car.brand))].sort();
    const minPrice = Math.min(...cars.map(car => car.price), 0);
    const maxPrice = Math.max(...cars.map(car => car.price), 100000000);
    const minYear = Math.min(...cars.map(car => car.year), 2000);
    const maxYear = Math.max(...cars.map(car => car.year), new Date().getFullYear());

    // Initialize price and year ranges from actual data
    useEffect(() => {
        if (cars.length > 0) {
            setPriceRange({ min: minPrice, max: maxPrice });
            setYearRange({ min: minYear, max: maxYear });
        }
    }, [cars, minPrice, maxPrice, minYear, maxYear]);

    // Fetch cars from API if not provided as props
    useEffect(() => {
        if (propCars.length === 0) {
            fetchCars();
        } else {
            setCars(propCars);
        }
    }, [propCars]);

    // Filter cars whenever filters change
    useEffect(() => {
        filterCars();
    }, [cars, searchTerm, selectedCategory, selectedBrand, priceRange, yearRange, sortBy]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getCars({ limit: '100' });
            const mappedCars = (response.cars || []).map(car => ({
                ...car,
                name: car.name || '',
                brand: car.brand || '',
                originalPrice: car.originalPrice || 0,
                images: car.images || [],
                // Add other required properties with default values
            }));
            setCars(mappedCars);
        } catch (error) {
            console.error('Failed to fetch cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const filterCars = () => {
        let filtered = [...cars];

        // Text search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(car =>
                car.name.toLowerCase().includes(term) ||
                car.brand.toLowerCase().includes(term) ||
                car.category.toLowerCase().includes(term) ||
                car.model.toLowerCase().includes(term)
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(car => car.category === selectedCategory);
        }

        // Brand filter
        if (selectedBrand) {
            filtered = filtered.filter(car => car.brand === selectedBrand);
        }

        // Price range filter
        filtered = filtered.filter(car =>
            car.price >= priceRange.min && car.price <= priceRange.max
        );

        // Year range filter
        filtered = filtered.filter(car =>
            car.year >= yearRange.min && car.year <= yearRange.max
        );

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'year-new':
                    return b.year - a.year;
                case 'year-old':
                    return a.year - b.year;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'mileage':
                    return a.mileage - b.mileage;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredCars(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleAddToFavorites = (car: Car) => {
        setFavorites(prev =>
            prev.includes(car.id) ? prev.filter(id => id !== car.id) : [...prev, car.id]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedBrand('');
        setPriceRange({ min: minPrice, max: maxPrice });
        setYearRange({ min: minYear, max: maxYear });
        setSortBy('name');
    };

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCars = filteredCars.slice(startIndex, endIndex);

    // Loading state
    if (loading && cars.length === 0) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge variant="primary" size="lg" className="mb-6">
                            <Package className="w-4 h-4 mr-1" />
                            Complete Inventory
                        </Badge>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Browse Our <span className="text-red-600">Collection</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover your perfect vehicle from our extensive collection of premium automobiles
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="primary" size="lg" className="mb-6">
                        <Package className="w-4 h-4 mr-1" />
                        Complete Inventory
                    </Badge>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Browse Our <span className="text-red-600">Collection</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover your perfect vehicle from our extensive collection of premium automobiles
                    </p>
                </div>

                {/* Search and Quick Filters */}
                <Card className="p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, brand, or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Quick filters */}
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-40"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-40"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="year-new">Year: Newest First</option>
                                <option value="year-old">Year: Oldest First</option>
                                <option value="rating">Highest Rated</option>
                                <option value="mileage">Lowest Mileage</option>
                            </select>

                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                icon={SlidersHorizontal}
                            >
                                Filters
                            </Button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results count and clear filters */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Filter size={16} />
                            <span>
                                {loading ? 'Loading...' : `${filteredCars.length} of ${cars.length} vehicles`}
                            </span>
                        </div>

                        {(searchTerm || selectedCategory || selectedBrand ||
                            priceRange.min !== minPrice || priceRange.max !== maxPrice ||
                            yearRange.min !== minYear || yearRange.max !== maxYear) && (
                                <Button variant="ghost" onClick={clearFilters} size="sm">
                                    Clear Filters
                                </Button>
                            )}
                    </div>
                </Card>

                {/* Advanced Filters */}
                {showFilters && (
                    <Card className="p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Brand Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">All Brands</option>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range: ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Year Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year Range: {yearRange.min} - {yearRange.max}
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min={minYear}
                                        max={maxYear}
                                        value={yearRange.min}
                                        onChange={(e) => setYearRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min={minYear}
                                        max={maxYear}
                                        value={yearRange.max}
                                        onChange={(e) => setYearRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSortBy('price-low')}
                                        className="w-full"
                                    >
                                        Show Cheapest
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSortBy('year-new')}
                                        className="w-full"
                                    >
                                        Show Newest
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Cars Display */}
                {loading ? (
                    <ComponentLoading text="Loading vehicles..." />
                ) : currentCars.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                        <p className="text-gray-600 mb-4">
                            {filteredCars.length === 0
                                ? "Try adjusting your search criteria or browse all categories"
                                : "No vehicles match your current filters"
                            }
                        </p>
                        {(searchTerm || selectedCategory || selectedBrand) && (
                            <Button onClick={clearFilters} variant="outline">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Cars Grid */}
                        <div className={`
              ${viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                                : 'space-y-6'
                            }
            `}>
                            {currentCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onViewDetails={onViewDetails}
                                    onAddToFavorites={handleAddToFavorites}
                                    isFavorite={favorites.includes(car.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    size="sm"
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`
                          w-10 h-10 rounded-lg font-medium transition-colors
                          ${currentPage === pageNum
                                                        ? 'bg-red-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }
                        `}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {totalPages > 5 && (
                                        <>
                                            <span className="text-gray-400">...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className={`
                          w-10 h-10 rounded-lg font-medium transition-colors
                          ${currentPage === totalPages
                                                        ? 'bg-red-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }
                        `}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {/* Results Summary */}
                        <div className="text-center mt-8 text-sm text-gray-600">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} vehicles
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InventoryPage;