"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useBrandById } from "@/satelite/services/brandService";
import { FaTimes } from "react-icons/fa";
import { formatDateAndTime } from "@/utils/formatDateAndTime";
import Image from "next/image";
import { DEFAULT_BRAND_URL } from "@/lib/constant";
import StateIndicator from "@/components/ui/feedback/StateIndicator";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type DetailBrandModalProps = {
    brandId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DetailBrandModal({
    brandId,
    isOpen,
    onClose,
}: DetailBrandModalProps) {
    const [mounted, setMounted] = useState(false);

    const { data: brand, isPending, isError } = useBrandById(brandId);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    if (isError) return <ErrorComponent />;

    return createPortal(
        <div
            className={`fixed inset-y-0 right-0 bg-white shadow-xl z-50 border-l border-gray-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 w-full md:w-1/3`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300">
                <h2 className="text-lg font-medium text-gray-700">Brand Details</h2>
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
                        {/* Image Section */}
                        <div className="w-32 h-32 bg-gray-100 relative rounded-full overflow-hidden mx-auto">
                            <Image
                                src={brand?.data.logoUrl || DEFAULT_BRAND_URL}
                                alt={brand?.data.name || "Product Image"}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Brand Information */}
                        {brand && (
                            <div className="space-y-4">
                                {/* Brand Title */}
                                <h1 className="text-xl font-semibold text-gray-800">{brand.data.name}</h1>

                                {/* Brand Description */}
                                <p className="text-gray-600">{brand.data.description || "No description available."}</p>

                            </div>
                        )}

                        {/* Metadata */}
                        {brand && (
                            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                                <div className="grid gap-4">
                                    {/* Created Metadata */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-800">Created:</span>
                                        <div className="text-right">
                                            <p className="text-gray-700">{brand.data.createdBy || "Unknown"}</p>
                                            <p className="text-gray-500">{formatDateAndTime(brand.data.createdAt)}</p>
                                        </div>
                                    </div>
                                    {/* Updated Metadata */}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <span className="font-medium text-gray-800">Last Updated:</span>
                                        <div className="text-right">
                                            <p className="text-gray-700">
                                                {brand.data.updatedBy || brand.data.createdBy || "No updates made"}
                                            </p>
                                            {brand.data.updatedAt && (
                                                <p className="text-gray-500">{formatDateAndTime(brand.data.updatedAt)}</p>
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
