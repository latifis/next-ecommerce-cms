"use client";

import React, { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import CloseButton from "@/components/ui/button/CloseButton";
import { createPortal } from "react-dom";

type AwaitingPaymentModalProps = {
    orderId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AwaitingPaymentModal({
    orderId,
    isOpen,
    onClose,
}: AwaitingPaymentModalProps) {
    const [mounted, setMounted] = useState(false);

    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl shadow-2xl relative max-h-[calc(100vh-3rem)] overflow-y-auto flex flex-col">
                <CloseButton onClick={handleClose} className="absolute top-4 right-4" />

                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-100 tracking-wide mb-6">
                    No Payment Information
                </h2>
                <OrderFlow currentStep={0} />

                <div className="flex justify-center items-center">
                    <div className="w-full bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center justify-center border border-gray-200">
                        <FaExclamationCircle className="text-gray-400 mb-4 text-4xl" />
                        <p className="text-gray-600 text-lg font-semibold text-center">
                            No payment information found
                        </p>
                        <p className="text-gray-500 text-sm font-bold text-center mt-2 italic">
                            Order ID: <span className="font-medium text-gray-700">{orderId}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
