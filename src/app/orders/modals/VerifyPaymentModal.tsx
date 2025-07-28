"use client";

import ErrorComponent from "@/components/Error";
import { useOrderById, useVerifyPayment } from "@/satelite/services/orderService";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { PaymentStatus } from "@/enum/paymentStatus";
import { AxiosError } from "axios";
import { Payment } from "@/types/order/payment";
import { DEFAULT_IMAGE_URL } from "@/lib/constant";
import OrderFlow from "@/components/OrderFlow";
import AgreementCheckbox from "@/components/AgreementCheckbox";
import CloseButton from "@/components/ui/CloseButton";
import { createPortal } from "react-dom";
import StateIndicator from "@/components/StateIndicator";
import PopupImage from "@/components/ui/PopupImage";

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
    const [mounted, setMounted] = useState(false);

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [statusAgreement, setStatusAgreement] = useState(false);

    const handleClose = () => {
        onClose(false);
        setStatusAgreement(false);
    };

    const { mutate: updatePayment, isPending: isPendingVerify } = useVerifyPayment();

    const { data: order, isPending, isError } = useOrderById(paymentId);

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

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    if (isError) return <ErrorComponent />

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl shadow-2xl relative max-h-[calc(100vh-3rem)] flex flex-col">
                <CloseButton onClick={handleClose} className="absolute top-4 right-4" />

                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-100 tracking-wide mb-6">
                    Verify Payment
                </h2>

                {(isPendingVerify) && (
                    <StateIndicator isLoading={isPendingVerify} isOverlay />
                )}

                {/* Payment Information */}
                {isPending ? (
                    <StateIndicator
                        isLoading={isPending}
                        isError={isError}
                        className="my-12"
                    />
                ) : !order?.data.payment ? (
                    <>
                        <OrderFlow currentStep={0} />
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-600">No payment information found.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="overflow-y-auto">
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
                                                    src={order.data.payment.paymentProof || DEFAULT_IMAGE_URL}
                                                    alt="Payment Proof"
                                                    width={300}
                                                    height={300}
                                                    className="object-contain max-h-40"
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
                                                <PopupImage
                                                    visible={isPopupVisible}
                                                    onClose={() => setPopupVisible(false)}
                                                    imageUrl={order.data.payment.paymentProof || DEFAULT_IMAGE_URL}
                                                    alt="Payment Proof"
                                                    width={600}
                                                    height={600}
                                                />
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
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end items-center mt-8 space-x-4 mx-4">
                            <button
                                onClick={handleVerifyPayment}
                                className="w-full px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                                disabled={isPendingVerify || isPending}
                            >
                                {isPendingVerify ? (
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
        </div>,
        document.body
    );
}
