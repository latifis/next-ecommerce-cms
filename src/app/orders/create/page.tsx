"use client";

import AddProductModal from "@/app/products/modals/AddProductModal";
import OrderItemCard from "@/components/card/OrderItemCard";
import { fetchProductByCode } from "@/satelite/hook/product/useProductByCode";
import { useAddOrder } from "@/satelite/services/orderService";
import { CartItem } from "@/types/cart/cartItem";
import { calculateTotalPrice } from "@/utils/productPricing";
import { AxiosError } from "axios";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CreateOrderPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [code, setCode] = useState("");
    const [isLoadingScan, setIsLoadingScan] = useState(false);

    const { mutate: createOrder, isPending } = useAddOrder();

    const initialTotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const actualTotal = calculateTotalPrice(
        cartItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            discountPercentage: item.discountPercentage,
            minQuantityForDiscount: item.minQuantityForDiscount,
            bulkDiscountPrice: item.bulkDiscountPrice,
        }))
    );

    const handleSubmitPOS = () => {
        if (isPending) return;

        const orderData = {
            items: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };

        createOrder(orderData, {
            onSuccess: () => {
                setCartItems([]);
                toast.success("Checkout success!");
            },
            onError: () => {
                toast.error("Failed to checkout.");
            },
        });
    };

    const handleScanProduct = async (code: string) => {
        setIsLoadingScan(true);
        try {
            const res = await fetchProductByCode(code);
            const product = res?.data;

            if (!product) {
                toast.error("Product not found or missing ID.");
                return;
            }

            const newItem: CartItem = {
                ...product,
                quantity: 1,
            };

            setCartItems((prevItems) => {
                const exist = prevItems.find((item) => item.id === newItem.id);
                if (exist) {
                    return prevItems.map((item) =>
                        item.id === newItem.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, newItem];
                }
            });

            toast.success(`${product.name} added to cart`);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setCode(code);
                setIsModalAddOpen(true);
                toast.error(err.response?.data?.message || err.message);
            } else {
                toast.error("Unexpected error occurred.");
            }
        } finally {
            setIsLoadingScan(false);
        }
    };

    const onDecrease = (itemId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const onIncrease = (itemId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const onDelete = (itemId: string) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
        );
    };

    return (
        <>
            {isLoadingScan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="flex flex-col items-center space-y-2">
                        <FaSpinner className="animate-spin text-4xl text-blue-500" />
                        <p className="text-sm text-gray-600">Scanning product...</p>
                    </div>
                </div>
            )}
            <div className="p-8 min-h-screen space-y-8">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Create Order</h1>
                    <p className="text-gray-600 text-sm">
                        Scan or select product to add to order.
                    </p>
                </div>

                {/* Product Selector */}
                <div className="flex space-x-4 mb-6">
                    {DUMMY_INPUT_PRODUCTS.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleScanProduct(product.id)}
                            className="border border-blue-200 rounded-xl px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow"
                        >
                            {product.id}
                        </button>
                    ))}
                </div>

                {/* Wrapper Layout */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left: Cart Items */}
                    <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4 min-h-[500px]">
                        <h2 className="text-lg font-bold text-blue-700">Cart Items</h2>
                        <hr className="border-gray-200" />
                        <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-md border border-dashed border-gray-300 text-center p-4 italic">
                                    <p className="text-gray-500 text-sm mb-2">No items in your cart yet.</p>
                                    <p className="text-gray-500 text-sm">Scan a product or use the search to add items.</p>
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

                    {/* Right: Summary */}
                    <div className="w-full md:max-w-[440px] bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between min-h-[500px]">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-blue-700">Summary</h2>
                            <hr className="border-gray-200" />

                            <div className="text-sm text-gray-700 space-y-2 font-bold">
                                <div className="flex justify-between">
                                    <span className="font-medium">Subtotal</span>
                                    <div>
                                        <span>Rp {initialTotal.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Delivery Fee</span>
                                    <span>Rp 0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Discount</span>
                                    <span className={initialTotal && initialTotal > actualTotal && initialTotal != 0 ? "text-red-500" : ""}>{initialTotal && initialTotal > actualTotal && initialTotal != 0 ? `- Rp ${(initialTotal - actualTotal).toLocaleString("id-ID")}` : 'Rp 0'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Tax</span>
                                    <span>Rp 0</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-base text-gray-800 font-bold border-t border-gray-200 pt-3">
                                <span>Total</span>
                                <span>Rp {actualTotal.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                className="w-full py-3 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                                onClick={handleSubmitPOS}
                            >
                                Submit Order (POS)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddProductModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDirectAdd={handleScanProduct}
                initialCode={code}
            />
        </>
    );
}

const DUMMY_INPUT_PRODUCTS = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
    { id: "10" },
];