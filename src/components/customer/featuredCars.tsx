import Badge from "../common/badge";
import { Button } from "../common/button";
import { Star, ArrowRight, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { CarCard } from "./carCard";
import { SkeletonCard } from "../common/spinner";
import ApiService from "../../services/api";
import type { Car } from "../../types/car";

interface FeaturedCarsProps {
    cars?: Car[]; // Made optional since we can fetch our own
    onViewDetails: (car: Car) => void;
    onViewAllVehicles?: () => void;
    loading?: boolean;
}

const FeaturedCars = ({ cars: propCars, onViewDetails, onViewAllVehicles, loading: propLoading = false }: FeaturedCarsProps) => {
    const [favorites, setFavorites] = useState<Array<string | number>>([]);
    const [cars, setCars] = useState<Car[]>(propCars || []);
    const [loading, setLoading] = useState(propLoading);

    // Fetch cars if not provided as props
    useEffect(() => {
        if (!propCars || propCars.length === 0) {
            fetchCars();
        } else {
            setCars(propCars);
            setLoading(propLoading);
        }
    }, [propCars, propLoading]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            console.log('FeaturedCars: Fetching cars from API...');

            const response = await ApiService.getCars({ limit: '3' }); // Only fetch 3 cars for featured
            console.log('FeaturedCars: API response:', response);

            const mappedCars = (response.cars || []).map(car => ({
                ...car,
                name: car.name || '',
                brand: car.brand || '',
                originalPrice: car.originalPrice || 0,
                images: car.images || [],
                // Add other required properties with default values
            }));

            console.log('FeaturedCars: Mapped cars:', mappedCars);
            setCars(mappedCars);
        } catch (error) {
            console.error('FeaturedCars: Failed to fetch cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    // Get only the first 3 cars for featured display
    const featuredCars = cars.slice(0, 3);

    const handleAddToFavorites = (car: Car): void => {
        setFavorites((prev: Array<string | number>) =>
            prev.includes(car.id)
                ? prev.filter(id => id !== car.id)
                : [...prev, car.id]
        );
    };

    const handleViewAllClick = () => {
        if (onViewAllVehicles) {
            onViewAllVehicles();
        } else {
            console.log('Navigate to inventory page');
        }
    };

    // Debug logging
    console.log('FeaturedCars Render:', {
        propCars: propCars?.length,
        cars: cars.length,
        featuredCars: featuredCars.length,
        loading
    });

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge variant="primary" size="lg" className="mb-4">
                        <Star className="w-4 h-4 mr-1" />
                        Featured Collection
                    </Badge>
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        Premium <span className="text-red-600">Vehicles</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Hand-picked luxury cars from our exclusive collection. Each vehicle represents the pinnacle of automotive excellence.
                    </p>
                </div>

                {loading ? (
                    <div>
                        <div className="text-center mb-8">
                            <p className="text-gray-600">Loading featured vehicles...</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    </div>
                ) : !cars || cars.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured vehicles available</h3>
                        <p className="text-gray-600">Check back soon for our latest premium collection.</p>
                        <Button
                            variant="outline"
                            onClick={fetchCars}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onViewDetails={onViewDetails}
                                    onAddToFavorites={handleAddToFavorites}
                                    isFavorite={favorites.includes(car.id)}
                                />
                            ))}
                        </div>

                        <div className="text-center flex items-center justify-center mt-12">
                            <Button
                                size="lg"
                                variant="outline"
                                icon={ArrowRight}
                                onClick={handleViewAllClick}
                            >
                                View All Vehicles
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedCars;