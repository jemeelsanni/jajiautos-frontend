// src/components/layout/Footer.tsx
import React from 'react';
import { Car, Phone, Mail, MapPin, Clock, ArrowRight, Globe } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-black to-red-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <Car className="h-10 w-10 text-red-500" />
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">
                                    JajiAutos
                                </h3>
                                <p className="text-sm text-gray-400">Premium Collection</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Your premier destination for luxury vehicles in Nigeria. Experience excellence in every drive with our carefully curated collection of premium automobiles.
                        </p>
                        <div className="flex space-x-4">
                            <div className="p-3 bg-gray-800 rounded-xl hover:bg-red-600 transition-colors cursor-pointer">
                                <Globe size={20} />
                            </div>
                            <div className="p-3 bg-gray-800 rounded-xl hover:bg-red-600 transition-colors cursor-pointer">
                                <Phone size={20} />
                            </div>
                            <div className="p-3 bg-gray-800 rounded-xl hover:bg-red-600 transition-colors cursor-pointer">
                                <Mail size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><a href="#" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Inventory</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Financing</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Services</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> About Us</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Contact Info</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-red-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p>Victoria Island, Lagos</p>
                                    <p>Nigeria</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-red-400" />
                                <p>+234 xxx xxx xxxx</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-red-400" />
                                <p>info@jajiautos.ng</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock size={20} className="text-red-400" />
                                <p>Mon-Sat: 9AM-7PM</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            &copy; 2025 JajiAutos. All rights reserved. | Built with excellence for Nigerian car enthusiasts.
                        </p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm text-gray-400">
                            <a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-red-400 transition-colors">Warranty</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;