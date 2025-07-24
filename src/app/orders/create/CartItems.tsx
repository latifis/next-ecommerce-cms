import OrderItemCard from "@/components/card/OrderItemCard";
import { CartItem } from "@/types/cart/cartItem";
import { BsTrash2 } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";

type Props = {
    cartItems: CartItem[];
    setCartItems: (items: CartItem[]) => void;
    onDecrease: (id: string) => void;
    onIncrease: (id: string) => void;
    onDelete: (id: string) => void;
};

export default function CartItems({ cartItems, setCartItems, onDecrease, onIncrease, onDelete }: Props) {
    return (
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4 min-h-[600px]">
            <h2 className="text-lg font-bold text-blue-700 flex items-center justify-between mx-2">
                Cart Items
                {cartItems.length > 0 && (
                    <button
                        onClick={() => setCartItems([])}
                        className="flex items-center gap-1 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded transition"
                    >
                        <BsTrash2 className="w-4 h-4" />
                        Delete All
                    </button>
                )}
            </h2>
            <hr className="border-gray-200" />
            <div className="space-y-4 h-[480px] overflow-y-auto pr-2">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-md border border-dashed border-gray-300 text-center p-4 italic">
                        <FaShoppingCart className="text-3xl text-gray-400 mb-2" />
                        <p className="text-gray-400 text-base mb-3 font-medium">
                            <span className="font-bold text-gray-700">No items in your cart yet.</span>
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                            <span className="font-bold text-blue-600">Scan a product barcode</span> with your scanner
                            <span className="text-gray-400"> — the item will appear here automatically.</span>
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                            Or, <span className="font-bold text-blue-600">click the <span className="underline">Search</span> button above</span>
                            <span className="text-gray-400"> to find and add products manually.</span>
                        </p>
                        <p className="text-gray-400 text-xs mt-2">Tip: You can remove items from the cart after adding.</p>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <OrderItemCard
                            key={item.id}
                            item={item}
                            onDecrease={onDecrease}
                            onIncrease={onIncrease}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}