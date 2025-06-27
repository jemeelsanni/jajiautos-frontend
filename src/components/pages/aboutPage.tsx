import { Award, Car, CheckCircle, Info, Phone, Shield, Star } from "lucide-react";
import Badge from "../common/badge";
import { Card } from "../common/card";
import { Button } from "../common/button";

const AboutPage = () => {
    return (
        <div className="pt-24 pb-16 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <Badge variant="primary" size="lg" className="mb-6">
                        <Info className="w-4 h-4 mr-1" />
                        About JajiAutos
                    </Badge>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Driving Excellence Since <span className="text-red-600">2010</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        We are Nigeria's premier automotive destination, dedicated to providing the finest luxury vehicles
                        with exceptional service and unmatched quality. Every car tells a story of excellence.
                    </p>
                </div>

                {/* Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
                        <div className="space-y-6 text-gray-600 text-lg">
                            <p>
                                Founded in 2010 in the heart of Lagos, JajiAutos began as a vision to revolutionize
                                the automotive industry in Nigeria. We started with a simple belief: every Nigerian
                                deserves access to world-class luxury vehicles.
                            </p>
                            <p>
                                Over the years, we've built lasting relationships with prestigious manufacturers
                                worldwide, ensuring our customers have access to the latest models and most
                                sought-after vehicles in the market.
                            </p>
                            <p>
                                Today, we stand as Nigeria's most trusted name in luxury automotive sales,
                                with a commitment that extends far beyond the initial purchase to comprehensive
                                service, financing options, and ongoing support.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-12">
                            {[
                                { number: '500+', label: 'Cars Sold', icon: Car },
                                { number: '15+', label: 'Years Experience', icon: Award },
                                { number: '98%', label: 'Satisfaction Rate', icon: Star }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-red-600" />
                                    <div className="text-3xl font-bold text-red-600 mb-1">{stat.number}</div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1549927681-0bb23986d8d6?w=600&q=80"
                            alt="Luxury car showroom"
                            className="rounded-2xl shadow-2xl"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold text-red-600">Award Winning</div>
                            <div className="text-gray-600">Dealership 2023</div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
                        <p className="text-xl text-gray-600">The principles that drive everything we do</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Quality Assurance",
                                description: "Every vehicle undergoes rigorous 200-point inspection and certification processes to ensure exceptional quality.",
                                icon: Shield,
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                title: "Customer Excellence",
                                description: "We prioritize customer satisfaction above all else, providing personalized service and ongoing support.",
                                icon: Award,
                                color: "bg-green-100 text-green-600"
                            },
                            {
                                title: "Transparency",
                                description: "Honest pricing, clear communication, and transparent processes in every transaction we handle.",
                                icon: CheckCircle,
                                color: "bg-red-100 text-red-600"
                            }
                        ].map((value, index) => (
                            <Card key={index} className="text-center p-8" hover>
                                <div className={`w-16 h-16 rounded-full ${value.color} mx-auto mb-6 flex items-center justify-center`}>
                                    <value.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                        <p className="text-xl text-gray-600">Dedicated professionals committed to your automotive journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Adebayo Johnson", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
                            { name: "Fatima Okafor", role: "Sales Director", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&q=80" },
                            { name: "Chike Nwankwo", role: "Service Manager", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" }
                        ].map((member, index) => (
                            <Card key={index} className="text-center p-6" hover>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                <p className="text-red-600 font-medium">{member.role}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
                    <p className="text-xl mb-8 text-red-100">
                        Join thousands of satisfied customers who trust JajiAutos for their automotive needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg" icon={Car}>
                            Browse Inventory
                        </Button>
                        <Button variant="outline" size="lg" icon={Phone}>
                            Contact Us Today
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;