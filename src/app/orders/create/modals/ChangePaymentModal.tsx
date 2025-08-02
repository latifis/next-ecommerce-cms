import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useRef } from "react";

type Props = {
    isOpen: boolean;
    onAction: () => void;
    total: number;
    paid: number;
    change: number;
};

export default function ChangePaymentModal({ isOpen, onAction, total, paid, change }: Props) {
    const doneRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            const timeout = setTimeout(() => {
                doneRef.current?.focus();
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <ModalBox isOpen={isOpen} onClose={onAction}>
            <ModalBox.Header>
                <h2>Transaction Complete</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4 mx-auto">
                    <div className="flex justify-between text-base">
                        <span className="text-gray-500 font-medium">Total</span>
                        <span className="text-gray-900 font-semibold">{formatCurrency(total)}</span>
                    </div>

                    <div className="flex justify-between text-base">
                        <span className="text-gray-500 font-medium">Paid</span>
                        <span className="text-gray-900 font-semibold">{formatCurrency(paid)}</span>
                    </div>

                    <hr className="my-2 border-gray-200" />

                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-bold text-lg">Change</span>
                        <span className="text-blue-600 font-extrabold text-2xl">{formatCurrency(change)}</span>
                    </div>
                </div>
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={onAction}
                    variant="primary"
                >
                    Input Next Order
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    );
}