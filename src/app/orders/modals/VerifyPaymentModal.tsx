"use client";

import ErrorComponent from "@/components/Error";
import { useOrderById, useVerifyPayment } from "@/satelite/services/orderService";
import React, { useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { PaymentStatus } from "@/enum/paymentStatus";
import { AxiosError } from "axios";
import { Payment } from "@/types/order/payment";
import { DEFAULT_IMAGE_URL } from "@/lib/constant";
import OrderFlow from "@/components/OrderFlow";
import AgreementCheckbox from "@/components/AgreementCheckbox";

type VerifyPaymentModalProps = {
    paymentId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function VerifyPaymentModal({
    paymentId,
    isOpen,
    onClose,
    onDone
}: VerifyPaymentModalProps) {

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [statusAgreement, setStatusAgreement] = useState(false);

    const handleClose = () => {
        onClose(false);
        setStatusAgreement(false);
    };

    const { mutate: updatePayment, isPending } = useVerifyPayment();

    const { data: order, isLoading, isError } = useOrderById(paymentId);

    const handleVerifyPayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!statusAgreement) {
            toast.error("Please check the agreement box to proceed.");
            return;
        }

        const updatedOrder: Payment = {
            id: order?.data.payment?.id,
            paymentStatus: PaymentStatus.CONFIRMED
        };

        updatePayment(updatedOrder, {
            onSuccess: () => {
                toast.success("Payment verification initiated.");
                onDone();
                setStatusAgreement(false);
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to verify Payment: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to verify Payment: Unknown error");
                }
                setStatusAgreement(false);
            }
        });
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />

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

                {/* Payment Information */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                    </div>
                ) : !order?.data.payment ? (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                            No Payment Information
                        </h2>
                        <OrderFlow currentStep={0} />
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-600">No payment information found.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                            Verify Payment
                        </h2>
                        <OrderFlow currentStep={1} />
                        {order?.data.payment && (
                            <div className="mt-8 space-y-6 mx-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
                                </header>
                                <div className="grid gap-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Payment Method:</span>
                                        <span>{order.data.order.paymentMethod || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Total Price:</span>
                                        <span>
                                            {order.data.order.totalPrice
                                                ? parseInt(order.data.order.totalPrice).toLocaleString('id-ID')
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Payment Status:</span>
                                        <span>{order.data.payment.paymentStatus || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium text-gray-800">Payment Proof:</span>
                                        </div>
                                        <div className="relative">
                                            {/* Small Image */}
                                            <Image
                                                src={DEFAULT_IMAGE_URL || order.data.payment.paymentProof}
                                                alt="Payment Proof"
                                                width={300}
                                                height={300}
                                                className="object-contain"
                                            />
                                            {/* View Larger Image Button */}
                                            <button
                                                className="absolute top-2 right-2 text-sm px-3 py-1 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                                                onClick={() => setPopupVisible(true)}
                                            >
                                                Full Image
                                            </button>
                                        </div>
                                        {/* Pop-up for Larger Image */}
                                        {isPopupVisible && (
                                            <div
                                                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
                                                onClick={() => setPopupVisible(false)}
                                            >
                                                <div
                                                    className="relative w-[600px] h-[600px] bg-white p-2 border border-gray-300 shadow-lg"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Image
                                                        src={DEFAULT_IMAGE_URL || order.data.payment.paymentProof}
                                                        alt="Payment Proof"
                                                        layout="fill"
                                                        objectFit="contain"
                                                    />
                                                    <button
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors"
                                                        onClick={() => setPopupVisible(false)}
                                                    >
                                                        <FaTimes className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agreement Checkbox */}
                        <AgreementCheckbox
                            status={statusAgreement}
                            onStatusChange={setStatusAgreement}
                        />

                        {/* Actions */}
                        <div className="flex justify-end items-center mt-8 space-x-4 mx-4">
                            <button
                                onClick={handleVerifyPayment}
                                className="w-full px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                                disabled={isPending || isLoading}
                            >
                                {isPending ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
