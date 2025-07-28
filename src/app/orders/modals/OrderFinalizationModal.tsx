"use client";

import ErrorComponent from "@/components/Error";
import { useOrderById, useMarkAsDoneOrder } from "@/satelite/services/orderService";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Order } from "@/types/order/order";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFlow from "@/components/OrderFlow";
import AgreementCheckbox from "@/components/AgreementCheckbox";
import CloseButton from "@/components/ui/CloseButton";
import { createPortal } from "react-dom";
import StateIndicator from "@/components/StateIndicator";
import OrderItemView from "@/components/card/OrderItemView";
import { formatCurrency } from "@/utils/formatCurrency";

type OrderFinalizationModalProps = {
    orderIdToUpdate: string | undefined
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function OrderFinalizationModal({
    orderIdToUpdate,
    isOpen,
    onClose,
    onDone
}: OrderFinalizationModalProps) {
    const [mounted, setMounted] = useState(false);

    const [statusAgreement, setStatusAgreement] = useState(false);

    const handleClose = () => {
        onClose(false);
        setStatusAgreement(false);
    };

    const { mutate: updateOrder, isPending: isPendingUpdate } = useMarkAsDoneOrder();

    const { data: order, isPending, isError } = useOrderById(orderIdToUpdate);

    const handleProcessMarkAsDone = (e: React.FormEvent) => {
        e.preventDefault();

        if (!statusAgreement) {
            toast.error("Please check the agreement box to proceed.");
            return;
        }

        const updatedOrder: Order = {
            id: orderIdToUpdate,
            orderStatus: OrderStatus.COMPLETED
        };

        updateOrder(updatedOrder, {
            onSuccess: () => {
                toast.success("Order Marked as Completed.");
                onDone();
                setStatusAgreement(false);
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to marking order as completed: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to marking order as completed: Unknown error");
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

    if (isError) return <ErrorComponent />;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl shadow-2xl relative max-h-[calc(100vh-3rem)] flex flex-col">
                <CloseButton onClick={handleClose} className="absolute top-4 right-4" />

                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-100 tracking-wide mb-6">
                    Order Finalization
                </h2>

                {(isPendingUpdate) && (
                    <StateIndicator isLoading={isPendingUpdate} isOverlay />
                )}

                {/* Payment Information */}
                {isPending ? (
                    <StateIndicator
                        isLoading={isPending}
                        isError={isError}
                        className="my-12"
                    />
                ) : (
                    <>
                        <div className="overflow-y-auto">
                            <OrderFlow currentStep={3} />
                            {order?.data.payment && (
                                <div className="mt-8 space-y-6 mx-6">
                                    <header>
                                        <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
                                    </header>
                                    <div className="grid gap-4 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">Payment Method:</span>
                                            <span className="font-bold">{order.data.order.paymentMethod || "Unknown"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">Total Price:</span>
                                            <span className="font-bold">
                                                {order.data.order.totalPrice
                                                    ? formatCurrency(parseInt(order.data.order.totalPrice))
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">Payment Status:</span>
                                            <span className="font-bold">{order.data.payment.paymentStatus || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 space-y-6 mx-6">
                                <header>
                                    <h2 className="text-xl font-semibold text-gray-800">Items Order</h2>
                                </header>
                                {order?.data.items && (
                                    <OrderItemView
                                        orderItems={order.data.items}
                                        showLess={true}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <AgreementCheckbox
                            status={statusAgreement}
                            onStatusChange={setStatusAgreement}
                        />

                        {/* Actions */}
                        <div className="flex justify-end items-center space-x-4">
                            <button
                                onClick={handleProcessMarkAsDone}
                                className="w-full px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                                disabled={isPendingUpdate || isPending}
                            >
                                {isPendingUpdate ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        marking as done...
                                    </>
                                ) : (
                                    "Mark as Done"
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
