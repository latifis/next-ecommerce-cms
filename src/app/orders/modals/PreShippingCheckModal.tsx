"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useItemsOrderById, usePreShippingCheckOrder } from "@/satelite/services/orderService";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Order } from "@/types/order/order";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import AgreementCheckbox from "@/components/ui/forms/AgreementCheckbox";
import CloseButton from "@/components/ui/button/CloseButton";
import { createPortal } from "react-dom";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import ItemOrderView from "@/components/card/ItemOrderView";

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
    const [mounted, setMounted] = useState(false);

    const [statusAgreement, setStatusAgreement] = useState(false);

    const handleClose = () => {
        onClose(false);
        setStatusAgreement(false);
    };

    const { mutate: updateOrder, isPending: isPendingUpdate } = usePreShippingCheckOrder();

    const { data: itemsOrder, isPending, isError } = useItemsOrderById(orderIdToUpdate);

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
                    Pre-Shipping Check
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
                        <OrderFlow currentStep={2} />
                        <div className="overflow-y-auto mx-4">
                            {itemsOrder?.data.items && (
                                <ItemOrderView
                                    itemsOrder={itemsOrder.data.items}
                                    showLess={true}
                                />
                            )}
                        </div>

                        {/* Agreement Checkbox */}
                        <AgreementCheckbox
                            status={statusAgreement}
                            onStatusChange={setStatusAgreement}
                        />

                        {/* Actions */}
                        <div className="flex justify-end items-center space-x-4 mx-4">
                            <button
                                onClick={handleProcessToShipping}
                                className="w-full px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                                disabled={isPendingUpdate || isPending}
                            >
                                {isPendingUpdate ? (
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
        </div >,
        document.body
    );
}
