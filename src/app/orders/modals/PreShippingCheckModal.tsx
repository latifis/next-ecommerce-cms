"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useItemsOrderById, usePreShippingCheckOrder } from "@/satelite/services/orderService";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Order } from "@/types/order/order";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import AgreementCheckbox from "@/components/ui/forms/AgreementCheckbox";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import ItemOrderView from "@/components/card/ItemOrderView";
import ModalBox from "@/components/ui/modal/ModalBox";
import Button from "@/components/ui/button/Button";

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

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Pre-Shipping Check</h2>
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
                        <OrderFlow currentStep={2} />
                        {itemsOrder?.data.items && (
                            <ItemOrderView
                                itemsOrder={itemsOrder.data.items}
                                showLess={true}
                            />
                        )}

                        {/* Agreement Checkbox */}
                        <AgreementCheckbox
                            status={statusAgreement}
                            onStatusChange={setStatusAgreement}
                        />
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleProcessToShipping}
                    loading={isPendingUpdate}
                    disabled={isPendingUpdate || isPending}
                    variant="primary"
                    icon={isPendingUpdate ? <FaSpinner className="animate-spin" /> : undefined}
                >
                    {isPendingUpdate ? "Verifying to Shipping..." : "Verify to Shipping"}
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    );
}
