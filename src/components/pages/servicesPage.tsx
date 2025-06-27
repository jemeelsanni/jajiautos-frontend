import { ArrowRight, Car, CheckCircle, CreditCard, Mail, Phone, Shield, Wrench } from "lucide-react";
import Badge from "../common/badge";
import { Card } from "../common/card";
import { Button } from "../common/button";

export default function ServicesPage() {
    const services = [
        {
            title: "Vehicle Inspection",
            description: "Comprehensive 200-point inspection by certified technicians",
            icon: Shield,
            features: ["Engine Analysis", "Safety Check", "Interior/Exterior", "Test Drive"],
            price: "₦25,000"
        },
        {
            title: "Financing Solutions",
            description: "Flexible payment plans tailored to your budget",
            icon: CreditCard,
            features: ["Low Interest Rates", "Quick Approval", "Flexible Terms", "Expert Advice"],
            price: "From 2.5% APR"
        },
        {
            title: "Extended Warranty",
            description: "Extended protection for peace of mind",
            icon: Shield,
            features: ["Engine Coverage", "Transmission", "Electrical", "24/7 Support"],
            price: "₦150,000/year"
        },
        {
            title: "Vehicle Maintenance",
            description: "Professional maintenance by certified technicians",
            icon: Wrench,
            features: ["Oil Changes", "Brake Service", "Tire Rotation", "Diagnostics"],
            price: "₦15,000+"
        },
        {
            title: "Insurance Services",
            description: "Comprehensive auto insurance coverage",
            icon: Shield,
            features: ["Full Coverage", "Third Party", "Comprehensive", "Claims Support"],
            price: "₦100,000/year"
        },
        {
            title: "Trade-In Program",
            description: "Get the best value for your current vehicle",
            icon: Car,
            features: ["Free Appraisal", "Instant Quote", "Market Value", "Hassle-Free"],
            price: "Free Evaluation"
        }
    ];

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge variant="primary" size="lg" className="mb-6">
                        <Wrench className="w-4 h-4 mr-1" />
                        Our Services
                    </Badge>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Complete <span className="text-red-600">Automotive</span> Solutions
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From purchase to maintenance, we provide comprehensive services to keep you driving with confidence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="group" hover>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-600 transition-colors">
                                        <service.icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                        <p className="text-red-600 font-semibold">{service.price}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6">{service.description}</p>

                                <div className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-green-600" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full" icon={ArrowRight}>
                                    Learn More
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Need Custom Service?</h2>
                    <p className="text-xl mb-8 text-red-100">
                        Contact our experts for personalized automotive solutions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg" icon={Phone}>
                            Call Now: +234 xxx xxx xxxx
                        </Button>
                        <Button variant="outline" size="lg" icon={Mail}>
                            Email Us
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};