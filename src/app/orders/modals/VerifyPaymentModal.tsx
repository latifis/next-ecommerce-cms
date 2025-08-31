"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useOrderById, useRejectPayment, useVerifyPayment } from "@/satelite/services/orderService";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { PaymentStatus } from "@/enum/paymentStatus";
import { AxiosError } from "axios";
import { Payment } from "@/types/order/payment";
import { DEFAULT_IMAGE_URL } from "@/lib/constant";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import AgreementCheckbox from "@/components/ui/forms/AgreementCheckbox";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import PopupImage from "@/components/ui/modal/PopupImage";
import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";
import { FaSpinner } from "react-icons/fa";

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

    const { mutate: verifyPayment, isPending: isPendingVerify } = useVerifyPayment();
    const { mutate: rejectPayment, isPending: isPendingReject } = useRejectPayment();
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

        verifyPayment(updatedOrder, {
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

    const handleReject = async () => {
        if (!statusAgreement) {
            toast.error("Please check the agreement box to proceed.");
            return;
        }
        const updatedOrder: Payment = {
            id: order?.data.payment?.id,
            paymentStatus: PaymentStatus.CANCELLED
        };

        rejectPayment(updatedOrder, {
            onSuccess: () => {
                toast.success("Payment rejection initiated.");
                onDone();
                setStatusAgreement(false);
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to reject Payment: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to reject Payment: Unknown error");
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
                <h2>Verify Payment</h2>
            </ModalBox.Header>

            <ModalBox.Body>
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
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleReject}
                    loading={isPendingReject}
                    disabled={isPendingReject || isPendingVerify || isPending}
                    variant="danger"
                    icon={isPendingReject ? <FaSpinner className="animate-spin" /> : undefined}
                    className="w-full"
                >
                    {isPendingReject ? "Rejecting..." : "Reject"}
                </Button>

                <Button
                    onClick={handleVerifyPayment}
                    loading={isPendingVerify}
                    disabled={isPendingVerify || isPendingReject || isPending}
                    variant="primary"
                    icon={isPendingVerify ? <FaSpinner className="animate-spin" /> : undefined}
                    className="w-full"
                >
                    {isPendingVerify ? "Verifying..." : "Verify"}
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    )
}
