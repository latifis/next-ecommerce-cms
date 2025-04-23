"use client";

import ErrorComponent from "@/components/Error";
import { useOrderById } from "@/satelite/services/orderService";
import { FaTimes } from "react-icons/fa";
import { formatDateAndTime } from "@/utils/formatDateAndTime";
import OrderFlow from "@/components/OrderFlow";
import { PaymentStatus } from "@/enum/paymentStatus";
import { OrderStatus } from "@/enum/orderStatus";
import Image from "next/image";
import { DEFAULT_IMAGE_URL } from "@/lib/constant";

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
    const { data: order, isLoading, isError } = useOrderById(orderId);

    if (isError) return <ErrorComponent />;

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white shadow-xl z-50 border-l border-gray-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 w-full md:w-2/5`}
            onMouseLeave={() => onClose(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300">
                <h2 className="text-lg font-bold text-gray-700">Order Details</h2>
                <button
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    onClick={() => onClose(false)}
                    aria-label="Close Modal"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-72px)]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-t-4 rounded-full animate-spin"></div>
                    </div>
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
                                            ? parseInt(order?.data?.order?.totalPrice).toLocaleString("id-ID")
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
                                <>
                                    {order.data.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-1 px-4 border-b border-gray-200 bg-white rounded-lg hover:shadow transition-shadow"
                                        >
                                            {/* Image */}
                                            <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                                                <Image
                                                    src={item.product.imageUrl || DEFAULT_IMAGE_URL}
                                                    alt={item.product.name || "Product Image"}
                                                    width={56}
                                                    height={56}
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 ml-3">
                                                <h3 className="text-sm font-medium text-gray-800 truncate hover:text-blue-600 transition-colors">
                                                    {item.product?.name ?? "Unnamed Product"}
                                                </h3>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {item.quantity} x{" "}
                                                    <span className="text-gray-700 font-medium">
                                                        {item.product?.price.toLocaleString("id-ID") ?? "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {parseInt(item.subtotal).toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </>
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
                                            <a
                                                href={order.data.payment.paymentProof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                View Proof
                                            </a>
                                        ) : "N/A"}
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
        </div>
    );
}