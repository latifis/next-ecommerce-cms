"use client";

import Image from "next/image";
import ErrorComponent from "@/components/ui/feedback/Error";
import { useProductById } from "@/satelite/services/productService";
import { FaTimes } from "react-icons/fa";
import { formatDateAndTime } from "@/utils/formatDateAndTime";
import { DEFAULT_PRODUCT_URL } from "@/lib/constant";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type DetailProductModalProps = {
    productId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DetailProductModal({
    productId,
    isOpen,
    onClose,
}: DetailProductModalProps) {
    const [mounted, setMounted] = useState(false);

    const { data: product, isPending, isError } = useProductById(productId);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    if (isError) return <ErrorComponent />;

    return createPortal(
        <div
            className={`fixed inset-y-0 right-0 bg-white shadow-xl z-50 border-l border-gray-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 w-full md:w-2/5`}
            onMouseLeave={() => onClose(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300">
                <h2 className="text-lg font-medium text-gray-700">Product Details</h2>
                <button
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    onClick={() => onClose(false)}
                    aria-label="Close Modal"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-72px)]">
                {isPending ? (
                    <StateIndicator
                        isLoading={isPending}
                        isError={isError}
                        className="my-12"
                    />
                ) : (
                    <>
                        {product && (
                            <div className="flex flex-col items-center justify-center w-full">
                                {/* Product Title */}
                                <h1 className="text-xl font-semibold text-gray-800">
                                    {product.data.name}
                                </h1>
                                {/* Product Code */}
                                <p className="text-sm text-gray-500 italic">
                                    {product.data.code}
                                </p>
                            </div>
                        )}
                        {/* Image Section */}
                        <div className="w-full h-64 bg-gray-100 relative rounded-lg overflow-hidden">
                            <Image
                                src={product?.data.imageUrl || DEFAULT_PRODUCT_URL}
                                alt={product?.data.name || "Product Image"}
                                fill
                                style={{ objectFit: 'contain' }}
                                className="hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Product Information */}
                        {product && (
                            <div className="space-y-6">
                                {/* Stock, Category, and Brand */}
                                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="flex flex-col items-center">
                                        <span className="font-semibold text-gray-800">Stock</span>
                                        <span className="text-center">{product.data.stock + " " + product.data.unit?.toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-semibold text-gray-800">Category</span>
                                        <span className="text-center">{product.data.categoryName || "N/A"}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-semibold text-gray-800">Brand</span>
                                        <span className="text-center">{product.data.brandName || "N/A"}</span>
                                    </div>
                                </div>

                                {/* Product Description */}
                                <p className="text-gray-600 px-3">{product.data.description || "No description available."}</p>

                                {/* Product Price */}
                                <p className="text-center text-xl font-extrabold text-green-900 px-3">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(product.data.price)}
                                </p>

                                {/* discountPercentage, minQuantityForDiscount, bulkDiscountPrice */}
                                <div className="text-lg font-bold text-gray-700 px-3 space-y-6">
                                    <div className="grid gap-4 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">Discount Percentage:</span>
                                            <span>{product.data.discountPercentage ? `${product.data.discountPercentage}%` : "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">Min Quantity for Discount:</span>
                                            <span>{product.data.minQuantityForDiscount || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">Bulk Discount Price:</span>
                                            <span>{product.data.bulkDiscountPrice ? `${product.data.bulkDiscountPrice.toLocaleString()} IDR` : "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        {product && (
                            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                                <div className="grid gap-4">
                                    {/* Created Metadata */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-800">Created:</span>
                                        <div className="text-right">
                                            <p className="text-gray-700">{product.data.createdBy || "Unknown"}</p>
                                            <p className="text-gray-500">{formatDateAndTime(product.data.createdAt)}</p>
                                        </div>
                                    </div>
                                    {/* Updated Metadata */}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <span className="font-medium text-gray-800">Last Updated:</span>
                                        <div className="text-right">
                                            <p className="text-gray-700">
                                                {product.data.updatedBy || product.data.createdBy || "No updates made"}
                                            </p>
                                            {product.data.updatedAt && (
                                                <p className="text-gray-500">{formatDateAndTime(product.data.updatedAt)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}
