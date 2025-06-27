import { Modal } from "../common/modal";
import { Car, CheckCircle, Download } from "lucide-react";
import { Button } from "../common/button";

interface Purchase {
    id: string;
    date: string;
    carName: string;
    amount: number;
}

export const ReceiptModal = ({ purchase, isOpen, onClose }: { purchase: Purchase; isOpen: boolean; onClose: () => void }) => {
    if (!purchase) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Purchase Receipt">
            <div className="max-w-md mx-auto bg-white">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Car className="w-8 h-8 text-red-600" />
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
                            JajiAutos
                        </h2>
                    </div>
                    <p className="text-gray-600">Premium Vehicle Sales</p>
                    <p className="text-sm text-gray-500">Lagos, Nigeria</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono font-bold">{purchase.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(purchase.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-medium">{purchase.carName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">Valued Customer</span>
                    </div>
                </div>

                {/* Amount Breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Vehicle Price:</span>
                            <span>₦{purchase.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Documentation:</span>
                            <span>₦50,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Insurance (1 year):</span>
                            <span>₦125,000</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-lg">
                        <span>Total Paid:</span>
                        <span className="text-red-600">₦{(purchase.amount + 175000).toLocaleString()}</span>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl mb-6">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-green-800">Payment Successful</span>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mb-6">
                    <p>Thank you for choosing JajiAutos!</p>
                    <p>For support, call: +234 xxx xxx xxxx</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.print()} className="flex-1" icon={Download}>
                        Print Receipt
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};