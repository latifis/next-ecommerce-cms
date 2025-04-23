"use client";

import React from "react";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";
import OrderFlow from "@/components/OrderFlow";

type AwaitingPaymentModalProps = {
    paymentId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AwaitingPaymentModal({
    paymentId,
    isOpen,
    onClose,
}: AwaitingPaymentModalProps) {

    const handleClose = () => {
        onClose(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl relative hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >

                {/* Close Icon */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    <FaTimes className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                    No Payment Information
                </h2>
                <OrderFlow currentStep={0} />

                <div className="flex justify-center items-center h-64">
                    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center justify-center border border-gray-200">
                        <FaExclamationCircle className="text-gray-400 mb-4 text-4xl" />
                        <p className="text-gray-600 text-lg font-semibold text-center">
                            No payment information found
                        </p>
                        <p className="text-gray-500 text-sm text-center mt-2">
                            Payment ID: <span className="font-medium text-gray-700">{paymentId}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
