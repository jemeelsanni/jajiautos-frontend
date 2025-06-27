// src/components/pages/contactPage.tsx
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Car, CheckCircle } from "lucide-react";
import Badge from "../common/badge";
import { Card } from "../common/card";
import { Button } from "../common/button";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setShowSuccess(true);

        // Reset form after success
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                inquiryType: 'general'
            });
            setShowSuccess(false);
        }, 3000);
    };

    const inquiryTypes = [
        { id: 'general', label: 'General Inquiry' },
        { id: 'sales', label: 'Vehicle Purchase' },
        { id: 'service', label: 'Service & Maintenance' },
        { id: 'financing', label: 'Financing Options' },
        { id: 'trade', label: 'Trade-In Evaluation' }
    ];

    const contactInfo = [
        {
            icon: Phone,
            title: 'Phone',
            details: ['+234 xxx xxx xxxx', '+234 xxx xxx xxxx'],
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['info@jajiautos.ng', 'sales@jajiautos.ng'],
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            icon: MapPin,
            title: 'Location',
            details: ['Victoria Island, Lagos', 'Nigeria'],
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Mon-Sat: 9AM-7PM', 'Sunday: Closed'],
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ];

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge variant="primary" size="lg" className="mb-6">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact Us
                    </Badge>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Get in <span className="text-red-600">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Ready to find your perfect vehicle? Our team of automotive experts is here to help you every step of the way.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, index) => (
                        <Card key={index} className="p-6 text-center" hover>
                            <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                <info.icon className={`w-6 h-6 ${info.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                            {info.details.map((detail, idx) => (
                                <p key={idx} className="text-gray-600">{detail}</p>
                            ))}
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Send className="w-6 h-6 text-red-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                        </div>

                        {showSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Inquiry Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                                    <select
                                        value={formData.inquiryType}
                                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        {inquiryTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Name and Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name *"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address *"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Phone and Subject */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subject *"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <textarea
                                    rows={6}
                                    placeholder="Your Message *"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    icon={isSubmitting ? undefined : Send}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                                </Button>
                            </form>
                        )}
                    </Card>

                    {/* Map and Additional Info */}
                    <div className="space-y-8">
                        {/* Map Placeholder */}
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Showroom</h2>
                            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center mb-6">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500">Interactive Map</p>
                                    <p className="text-sm text-gray-400">Victoria Island, Lagos</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 mb-2">JajiAutos Showroom</h3>
                                <p className="text-gray-600 mb-4">Victoria Island, Lagos, Nigeria</p>
                                <Button variant="outline" icon={MapPin}>
                                    Get Directions
                                </Button>
                            </div>
                        </Card>

                        {/* Quick Contact */}
                        <Card className="p-8 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Car className="w-6 h-6 text-red-600" />
                                <h3 className="text-xl font-bold text-gray-900">Need Immediate Assistance?</h3>
                            </div>
                            <p className="text-gray-700 mb-6">
                                Our sales team is ready to help you find the perfect vehicle. Call us now for immediate assistance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button className="flex-1" icon={Phone}>
                                    Call Now
                                </Button>
                                <Button variant="outline" className="flex-1" icon={MessageCircle}>
                                    Live Chat
                                </Button>
                            </div>
                        </Card>

                        {/* FAQ Snippet */}
                        <Card className="p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">What are your financing options?</h4>
                                    <p className="text-sm text-gray-600">We offer flexible financing with competitive rates starting from 2.5% APR.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Do you accept trade-ins?</h4>
                                    <p className="text-sm text-gray-600">Yes, we provide free vehicle appraisals and competitive trade-in values.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">What warranty do you offer?</h4>
                                    <p className="text-sm text-gray-600">All vehicles come with comprehensive warranty coverage up to 4 years.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Drive Your Dream Car?</h2>
                    <p className="text-xl mb-8 text-red-100">
                        Visit our showroom today and experience the JajiAutos difference
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg" icon={Car}>
                            Schedule Test Drive
                        </Button>
                        <Button variant="outline" size="lg" icon={Phone}>
                            Call +234 xxx xxx xxxx
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;