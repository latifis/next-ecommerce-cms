import { CartItem } from "@/types/cart/cartItem";
import { formatCurrency } from "@/utils/formatCurrency";

type Props = {
    initialTotal: number;
    actualTotal: number;
    isPending: boolean;
    cartItems: CartItem[];
    handleSubmitPOS: () => void;
};

export default function Summary({
    initialTotal,
    actualTotal,
    isPending,
    cartItems,
    handleSubmitPOS
}: Props) {
    return (
        <div className="w-full md:max-w-[440px] bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-blue-700">Summary</h2>
                <hr className="border-gray-200" />

                <div className="text-sm text-gray-700 space-y-2 font-bold">
                    <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <div>
                            <span>{formatCurrency(initialTotal)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Delivery Fee</span>
                        <span>{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Discount</span>
                        <span className={initialTotal && initialTotal > actualTotal && initialTotal != 0 ? "text-red-500" : ""}>{initialTotal && initialTotal > actualTotal && initialTotal != 0 ? `- ${formatCurrency(initialTotal - actualTotal)}` : formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Tax</span>
                        <span>{formatCurrency(0)}</span>
                    </div>
                </div>

                <div className="flex justify-between text-base text-gray-800 font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>{formatCurrency(actualTotal)}</span>
                </div>
            </div>

            <div className="mt-6">
                <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${isPending || cartItems.length === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                    onClick={handleSubmitPOS}
                    disabled={isPending || cartItems.length === 0}
                >
                    Submit Order (POS)
                </button>
            </div>
        </div>
    );
}