"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useOrderById, useMarkAsDoneOrder } from "@/satelite/services/orderService";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Order } from "@/types/order/order";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import AgreementCheckbox from "@/components/ui/forms/AgreementCheckbox";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import OrderItemView from "@/components/card/OrderItemView";
import { formatCurrency } from "@/utils/formatCurrency";
import ModalBox from "@/components/ui/modal/ModalBox";
import Button from "@/components/ui/button/Button";

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

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Order Finalization</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <StateIndicator
                        isLoading={isPending}
                        isError={isError}
                        className="my-12"
                    />
                ) : (
                    <>
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

                        <AgreementCheckbox
                            status={statusAgreement}
                            onStatusChange={setStatusAgreement}
                        />
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleProcessMarkAsDone}
                    loading={isPendingUpdate}
                    disabled={isPendingUpdate || isPending}
                    variant="primary"
                    icon={isPendingUpdate ? <FaSpinner className="animate-spin" /> : undefined}
                >
                    {isPendingUpdate ? "Marking as Done..." : "Mark as Done"}
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    );
}
