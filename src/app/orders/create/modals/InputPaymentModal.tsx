import CloseButton from "@/components/ui/button/CloseButton";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    actualTotal: number;
    onSubmit: (amount: number) => void;
};

const NOMINALS = [10000, 20000, 30000, 50000, 100000];

export default function InputPaymentModal({ isOpen, onClose, actualTotal, onSubmit }: Props) {
    const [mounted, setMounted] = useState(false);
    const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
    const [manualInput, setManualInput] = useState(actualTotal.toString());
    const submitRef = useRef<HTMLButtonElement>(null);

    const paymentAmount: number = selectedNominal !== null ? selectedNominal : Number(manualInput);
    const canSubmit = paymentAmount >= actualTotal;

    useEffect(() => {
        if (isOpen) {
            setManualInput(actualTotal.toString());
            setSelectedNominal(null);
        }
    }, [isOpen, actualTotal]);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const timeout = setTimeout(() => {
                submitRef.current?.focus();
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    const handleNominalClick = (amount: number) => {
        setSelectedNominal(amount);
        setManualInput("");
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setManualInput(e.target.value);
        setSelectedNominal(null);
    };

    const handleSubmit = () => {
        if (canSubmit) {
            onSubmit(paymentAmount);
            setSelectedNominal(null);
            setManualInput("");
        }
    };

    const handleManualFocus = () => {
        if (selectedNominal !== null) {
            setManualInput(actualTotal.toString());
            setSelectedNominal(null);
        }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl shadow-2xl relative max-h-[calc(100vh-3rem)] overflow-y-auto flex flex-col">
                <CloseButton onClick={onClose} className="absolute top-4 right-4" />

                {/* Modal Header */}
                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-100 tracking-wide mb-6">
                    Enter Payment Amount
                </h2>

                {/* Amount Due */}
                <div className="text-center mb-6">
                    <span className="block text-sm text-gray-500 tracking-wide">Amount to Pay</span>
                    <span className="text-3xl font-bold text-blue-700">
                        {formatCurrency(actualTotal)}
                    </span>
                </div>

                {/* Nominal Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2 mb-6">
                    {NOMINALS.map((nominal) => (
                        <button
                            key={nominal}
                            type="button"
                            onClick={() => handleNominalClick(nominal)}
                            className={`w-full text-center px-4 py-3 rounded-xl border transition-colors
                                ${selectedNominal === nominal
                                    ? "bg-blue-100 border-blue-600 text-blue-700 font-bold shadow"
                                    : actualTotal > nominal
                                        ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50"
                                }
                            `}
                            disabled={actualTotal > nominal}
                        >
                            {formatCurrency(nominal)}
                        </button>
                    ))}
                </div>

                {/* Manual Input */}
                <div className="mt-2 mb-8">
                    <label
                        htmlFor="manualPayment"
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Or enter another amount
                    </label>
                    <input
                        id="manualPayment"
                        type="number"
                        min={actualTotal}
                        value={manualInput}
                        onChange={handleManualChange}
                        onFocus={handleManualFocus}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring focus:ring-blue-200 focus:outline-none text-gray-900 bg-gray-50 text-lg"
                        placeholder="Enter payment amount"
                    />
                </div>

                {/* Submit Button */}
                <button
                    ref={submitRef}
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`w-full py-3 rounded-xl font-semibold text-lg transition
                        ${canSubmit
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:bg-blue-200"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
                    `}
                >
                    Confirm Payment
                </button>
            </div>
        </div>,
        document.body
    );
}