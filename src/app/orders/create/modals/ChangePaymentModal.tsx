import CloseButton from "@/components/ui/CloseButton";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    isOpen: boolean;
    onAction: () => void;
    total: number;
    paid: number;
    change: number;
};

export default function ChangePaymentModal({ isOpen, onAction, total, paid, change }: Props) {

    const [mounted, setMounted] = useState(false);
    const doneRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const timeout = setTimeout(() => {
                doneRef.current?.focus();
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-md mx-auto my-8 p-6 rounded-2xl shadow-2xl relative max-h-[calc(100vh-4rem)] overflow-y-auto">
                <CloseButton onClick={onAction} className="absolute top-4 right-4" />

                {/* Modal Header */}
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b pb-4 border-gray-200">
                    Transaction Complete
                </h2>

                {/* Payment Info */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-md mx-auto">
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

                {/* CTA Button */}
                <button
                    type="button"
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 focus:bg-blue-200 rounded-lg py-3 font-semibold text-lg mt-4 transition"
                    onClick={onAction}
                >
                    Input Next Order
                </button>
            </div>
        </div>,
        document.body
    );
}