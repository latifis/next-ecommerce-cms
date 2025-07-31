"use client";

import AddProductModal from "@/app/products/modals/AddProductModal";
import { fetchProductByCode } from "@/satelite/hook/product/useProductByCode";
import { useAddOrder } from "@/satelite/services/orderService";
import { CartItem } from "@/types/cart/cartItem";
import { Product } from "@/types/product/product";
import { calculateTotalPrice } from "@/utils/productPricing";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SearchProductModal from "./modals/SearchProductModal";
import Header from "./Header";
import CartItems from "./CartItems";
import Summary from "./Summary";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import InputPaymentModal from "./modals/InputPaymentModal";
import ChangePaymentModal from "./modals/ChangePaymentModal";

export default function CreateOrderPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [code, setCode] = useState("");
    const [codeAddProduct, setCodeAddProduct] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalSearchOpen, setIsModalSearchOpen] = useState(false);
    const [isModalInputPaymentOpen, setIsModalInputPaymentOpen] = useState(false);
    const [isModalChangePaymentOpen, setIsModalChangePaymentOpen] = useState(false);

    const { mutate: createOrder, isPending } = useAddOrder();

    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmitPOS = (amount: number) => {
        if (amount < actualTotal) {
            toast.error("Insufficient payment amount.");
            return;
        }

        setIsModalInputPaymentOpen(false);
        setIsLoading(true);

        const orderData = {
            items: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            amountPaid: amount,
        };

        createOrder(orderData, {
            onSuccess: () => {
                toast.success("Checkout success!");
                setAmountPaid(amount);
                setIsModalChangePaymentOpen(true);
            },
            onError: () => {
                toast.error("Failed to checkout.");
                inputRef.current?.focus();
            },
            onSettled: () => {
                setIsLoading(false);
            },
        });
    };

    const handleScanProduct = async (code: string) => {
        setIsLoading(true);
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
            if (err instanceof Error) {
                if (err.message.includes("404")) {
                    toast.error("Product Not Found");
                    setCodeAddProduct(code);
                    setIsModalAddOpen(true);
                }
            }
            console.log("Error scanning product:", err);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
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

    const handleSelectProductFromModal = async (item: Product) => {
        await handleScanProduct(item.code);
        setIsModalSearchOpen(false);
    };

    const handleNextOrder = () => {
        setCartItems([]);
        setAmountPaid(0);
        setIsModalChangePaymentOpen(false);
        setIsModalInputPaymentOpen(false);
        setCode("");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleOnCloseInputPaymentModal = () => {
        setIsModalInputPaymentOpen(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (isModalSearchOpen === false && inputRef.current) {
            inputRef.current.focus();
        }
    }, [code, isModalSearchOpen]);

    useEffect(() => {
        if (!isModalAddOpen && !isModalSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalAddOpen, isModalSearchOpen]);

    return (
        <>
            <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && code.trim()) {
                        handleScanProduct(code.trim());
                        setCode("");
                    }
                }}
                className="sr-only"
                tabIndex={0}
            />
            {(isLoading || isPending) && (
                <StateIndicator isLoading={isLoading} isOverlay />
            )}
            <div className="p-8 min-h-screen space-y-8">
                {/* Header */}
                <Header onClick={() => setIsModalSearchOpen(true)} />

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left: Cart Items */}
                    <CartItems
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        onDecrease={onDecrease}
                        onIncrease={onIncrease}
                        onDelete={onDelete}
                    />

                    {/* Right: Summary */}
                    <Summary
                        initialTotal={initialTotal}
                        actualTotal={actualTotal}
                        isPending={isPending}
                        cartItems={cartItems}
                        handleSubmitPOS={() => {
                            setIsModalInputPaymentOpen(true);
                        }}
                    />
                </div>
            </div>

            <AddProductModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDirectAdd={handleScanProduct}
                initialCode={codeAddProduct}
            />

            <SearchProductModal
                isOpen={isModalSearchOpen}
                onClose={() => setIsModalSearchOpen(false)}
                onSelectProduct={handleSelectProductFromModal}
            />

            <InputPaymentModal
                isOpen={isModalInputPaymentOpen}
                onClose={handleOnCloseInputPaymentModal}
                actualTotal={actualTotal}
                onSubmit={handleSubmitPOS}
            />

            <ChangePaymentModal
                isOpen={isModalChangePaymentOpen}
                onAction={handleNextOrder}
                total={actualTotal}
                paid={amountPaid}
                change={amountPaid - actualTotal}
            />
        </>
    );
}