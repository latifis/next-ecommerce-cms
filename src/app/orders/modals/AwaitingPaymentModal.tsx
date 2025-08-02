"use client";

import { FaExclamationCircle } from "react-icons/fa";
import OrderFlow from "@/components/ui/layout/OrderFlow";
import ModalBox from "@/components/ui/modal/ModalBox";

type AwaitingPaymentModalProps = {
    orderId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AwaitingPaymentModal({
    orderId,
    isOpen,
    onClose,
}: AwaitingPaymentModalProps) {
    const handleClose = () => {
        onClose(false);
    };

    if (!isOpen) return null;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>No Payment Information</h2>
            </ModalBox.Header>
            <ModalBox.Body>
                <OrderFlow currentStep={0} />
                <div className="flex justify-center items-center">
                    <div className="w-full bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center justify-center border border-gray-200">
                        <FaExclamationCircle className="text-gray-400 mb-4 text-4xl" />
                        <p className="text-gray-600 text-lg font-semibold text-center">
                            No payment information found
                        </p>
                        <p className="text-gray-500 text-sm font-bold text-center mt-2 italic">
                            Order ID: <span className="font-medium text-gray-700">{orderId}</span>
                        </p>
                    </div>
                </div>
            </ModalBox.Body>
        </ModalBox>
    );
}
