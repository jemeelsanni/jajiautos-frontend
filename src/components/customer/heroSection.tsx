import { Star, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "../common/button";
import Badge from "../common/badge";

const HeroSection = ({ onExplore }: { onExplore: () => void }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-red-900">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="space-y-8 animate-in slide-in-from-bottom duration-1000">
                    <Badge variant="primary" size="lg">
                        <Star className="w-4 h-4 mr-1" />
                        Nigeria's Premier Auto Dealer
                    </Badge>

                    <h1 className="text-6xl md:text-8xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-gray-100 to-red-300 bg-clip-text text-transparent">
                            Drive Your
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                            Dreams
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Discover the finest collection of luxury vehicles in Nigeria. From sports cars to SUVs,
                        experience excellence in every drive with our premium automotive selection.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                        <Button size="xl" onClick={onExplore} icon={ArrowRight}>
                            Explore Collection
                        </Button>
                        <Button variant="outline" size="xl" icon={PlayCircle}>
                            Virtual Showroom
                        </Button>
                    </div>

                    <div className="flex justify-center items-center gap-8 mt-16 text-gray-400">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">500+</div>
                            <div className="text-sm">Cars Sold</div>
                        </div>
                        <div className="w-px h-12 bg-gray-600"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">98%</div>
                            <div className="text-sm">Satisfaction</div>
                        </div>
                        <div className="w-px h-12 bg-gray-600"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">15+</div>
                            <div className="text-sm">Years Experience</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </div >
    );
};
export default HeroSection;