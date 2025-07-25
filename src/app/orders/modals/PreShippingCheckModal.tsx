"use client";

import ErrorComponent from "@/components/Error";
import { useItemsOrderById, usePreShippingCheckOrder } from "@/satelite/services/orderService";
import React, { useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { AxiosError } from "axios";
import { DEFAULT_IMAGE_URL } from "@/lib/constant";
import { Order } from "@/types/order/order";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFlow from "@/components/OrderFlow";
import AgreementCheckbox from "@/components/AgreementCheckbox";
import { formatCurrency } from "@/utils/formatCurrency";

type PreShippingCheckModalProps = {
    orderIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function PreShippingCheckModal({
    orderIdToUpdate,
    isOpen,
    onClose,
    onDone
}: PreShippingCheckModalProps) {

    const [statusAgreement, setStatusAgreement] = useState(false);

    const handleClose = () => {
        onClose(false);
        setStatusAgreement(false);
    };

    const { mutate: updateOrder, isPending: isPending } = usePreShippingCheckOrder();

    const { data: itemsOrder, isLoading, isError } = useItemsOrderById(orderIdToUpdate);

    const handleProcessToShipping = (e: React.FormEvent) => {
        e.preventDefault();

        if (!statusAgreement) {
            toast.error("Please check the agreement box to proceed.");
            return;
        }

        const updatedOrder: Order = {
            id: orderIdToUpdate,
            orderStatus: OrderStatus.SHIPPED
        };

        updateOrder(updatedOrder, {
            onSuccess: () => {
                toast.success("Process to shipping initiated.");
                onDone();
                setStatusAgreement(false);
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to process shipping: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to process shipping: Unknown error");
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
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                            Pre-Shipping Check
                        </h2>
                        <OrderFlow currentStep={2} />
                        {itemsOrder?.data.items && (
                            <div className="p-4 bg-gray-50">
                                <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg">
                                    {itemsOrder.data.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-4 px-6 border-b border-gray-200 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                        >
                                            {/* Image */}
                                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-300">
                                                <Image
                                                    src={item.product.imageUrl || DEFAULT_IMAGE_URL}
                                                    alt={item.product.name || "Product Image"}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 ml-4">
                                                <h3 className="text-sm font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors">
                                                    {item.product?.name ?? "Unnamed Product"}
                                                </h3>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {item.quantity} x{" "}
                                                    <span className="text-gray-700 font-medium">
                                                        {formatCurrency(item.product?.price) ?? "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="text-right">
                                                <span className="text-base font-semibold text-gray-900">
                                                    {formatCurrency(parseInt(item.subtotal))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
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
                                onClick={handleProcessToShipping}
                                className="w-full px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                                disabled={isPending || isLoading}
                            >
                                {isPending ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        verify to shipping...
                                    </>
                                ) : (
                                    "Verify to Shipping"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
