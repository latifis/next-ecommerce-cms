"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useOrderById } from "@/satelite/services/orderService";
import { FaTimes } from "react-icons/fa";
import { formatDateAndTime } from "@/utils/formatDateAndTime";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import { PaymentStatus } from "@/enum/paymentStatus";
import { OrderStatus } from "@/enum/orderStatus";
import { DEFAULT_IMAGE_URL } from "@/lib/constant";
import { formatCurrency } from "@/utils/formatCurrency";
import PopupImage from "@/components/ui/modal/PopupImage";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import OrderItemView from "@/components/card/OrderItemView";

type DetailOrderModalProps = {
    orderId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DetailOrderModal({
    orderId,
    isOpen,
    onClose,
}: DetailOrderModalProps) {
    const [mounted, setMounted] = useState(false);

    const [isPopupVisible, setPopupVisible] = useState(false);

    const { data: order, isPending, isError } = useOrderById(orderId);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleClose = () => {
        onClose(false);
        setPopupVisible(false);
    }

    if (!mounted || !isOpen) return null;

    if (isError) return <ErrorComponent />

    return createPortal(
        <div
            className={`fixed inset-y-0 right-0 bg-white shadow-xl z-50 border-l border-gray-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 w-full md:w-2/5`}
            onMouseLeave={handleClose}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300">
                <h2 className="text-lg font-bold text-gray-700">Order Details</h2>
                <button
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    onClick={handleClose}
                    aria-label="Close Modal"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-72px)]">
                {isPending ? (
                    <StateIndicator
                        isLoading={isPending}
                        isError={isError}
                    />
                ) : (
                    <>
                        <OrderFlow
                            currentStep={
                                order?.data?.order?.paymentStatus === PaymentStatus.PENDING
                                    ? 0
                                    : order?.data?.order?.orderStatus === OrderStatus.PAID
                                        ? 1
                                        : order?.data?.order?.orderStatus === OrderStatus.SHIPPED
                                            ? 2
                                            : order?.data?.order?.orderStatus === OrderStatus.COMPLETED
                                                ? 3
                                                : 0
                            }
                        />
                        {/* Order Information */}
                        <section className="space-y-6">
                            <header>
                                <h1 className="text-xl font-semibold text-gray-800">Order Information</h1>
                                <p className="text-gray-600">Overview of the order details.</p>
                            </header>
                            <div className="grid gap-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Order Status:</span>
                                    <span>{order?.data?.order?.orderStatus || "Unknown"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Payment Status:</span>
                                    <span>{order?.data?.order?.paymentStatus || "Unknown"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Payment Method:</span>
                                    <span>{order?.data?.order?.paymentMethod || "Unknown"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Total Price:</span>
                                    <span className="text-gray-700 font-semibold">
                                        {order?.data?.order?.totalPrice
                                            ? formatCurrency(parseInt(order?.data?.order?.totalPrice))
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* User Information */}
                        {order?.data?.user ? (
                            <section className="mt-8 space-y-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
                                </header>
                                <div className="grid gap-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Name:</span>
                                        <span>{order.data.user.name || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Email:</span>
                                        <span>{order.data.user.email || "Unknown"}</span>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section className="mt-8 space-y-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
                                </header>
                                <p className="text-gray-600">No user data available.</p>
                            </section>
                        )}

                        {/* Items Information */}
                        <section className="mt-8 space-y-6">
                            <header className="w-full max-w-4xl mx-auto">
                                <h2 className="text-xl font-semibold text-gray-800">Items</h2>
                            </header>
                            {order?.data.items ? (
                                <OrderItemView
                                    orderItems={order.data.items}
                                    showLess={true}
                                />
                            ) : (
                                <p className="text-gray-600 w-full max-w-4xl mx-auto">No items found for this order.</p>
                            )}
                        </section>

                        {/* Payment Information */}
                        {order?.data?.payment ? (
                            <section className="mt-8 space-y-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
                                </header>
                                <div className="grid gap-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Payment Status:</span>
                                        <span>{order.data.payment.paymentStatus || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Payment Proof:</span>
                                        {order.data.payment.paymentProof ? (
                                            <button
                                                onClick={() => setPopupVisible(true)}
                                                className="ml-2 text-blue-600 underline hover:text-blue-800 hover:underline cursor-pointer font-semibold transition-colors"
                                                type="button"
                                            >
                                                View Proof
                                            </button>
                                        ) : "N/A"}
                                        <PopupImage
                                            visible={isPopupVisible}
                                            onClose={() => setPopupVisible(false)}
                                            imageUrl={order.data.payment.paymentProof || DEFAULT_IMAGE_URL}
                                            alt="Payment Proof"
                                            width={600}
                                            height={600}
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Transaction ID:</span>
                                        <span>{order.data.payment.transactionId || "N/A"}</span>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section className="mt-8 space-y-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
                                </header>
                                <p className="text-gray-600">No payment information available.</p>
                            </section>
                        )}

                        {/* Histories */}
                        {order?.data?.histories?.length ?? 0 > 0 ? (
                            <section className="mt-8 space-y-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">Histories</h2>
                                </header>
                                <div className="w-full max-w-4xl mx-auto p-1">
                                    <div className="relative">
                                        {order?.data.histories.map((history, index) => (
                                            <div key={history.id} className="flex items-start relative">
                                                {/* Timeline Connector */}
                                                <div className="flex flex-col items-center">
                                                    {/* Titik Bulat */}
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${index === order.data.histories.length - 1
                                                            ? "bg-blue-500"
                                                            : "bg-gray-300"
                                                            }`}
                                                    ></div>
                                                    {/* Garis Penghubung */}
                                                    {index !== order.data.histories.length - 1 && (
                                                        <div className="w-px bg-gray-300" style={{ height: '2rem' }}></div>
                                                    )}
                                                </div>

                                                {/* Konten */}
                                                <div className="ml-4 flex-1 flex justify-between text-sm pb-6 last:pb-0">
                                                    <span className="font-medium text-gray-800">{history.status}</span>
                                                    <span className="text-gray-600">{formatDateAndTime(history.changedAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section className="mt-8 space-y-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">Histories</h2>
                                </header>
                                <p className="text-gray-600">No history found for this order.</p>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}