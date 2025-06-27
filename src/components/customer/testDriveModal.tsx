import { useState } from 'react';
import { Modal } from '../common/modal';
import { Button } from '../common/button';
import { Calendar } from 'lucide-react';
import type { Car, TestDriveFormData } from '../../types/car';

interface TestDriveModalProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (formData: TestDriveFormData) => void;

}

export const TestDriveModal = ({ car, isOpen, onClose, onSchedule }: TestDriveModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
    });

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const handleSubmit = () => {
        onSchedule(formData);
        onClose();
    };

    if (!car) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Test Drive">
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img src={car.image} alt={car.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                        <h3 className="font-semibold text-gray-900">{car.name}</h3>
                        <p className="text-gray-600">{car.category} • {car.year}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="date"
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">Select Time</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <textarea
                    rows={3}
                    placeholder="Any special requirements or questions?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />

                <div className="flex gap-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1" icon={Calendar}>
                        Schedule Test Drive
                    </Button>
                </div>
            </div>
        </Modal>
    );
};