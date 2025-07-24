"use client";

import { FaSearch, FaSpinner } from "react-icons/fa";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { Product } from "@/types/product/product";
import { useDebounce } from "@/satelite/hook/useDebounce";
import { useAllProducts } from "@/satelite/services/productService";
import CloseButton from "@/components/ui/CloseButton";
import { DataNotFound } from "@/components/DataNotFound";
import StateIndicator from "@/components/StateIndicator";
import ProductItemCard from "@/components/card/ProductItemCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelectProduct: (product: Product) => void;
};

export default function SearchProductModal({
    isOpen,
    onClose,
    onSelectProduct,
}: Props) {
    const [search, setSearch] = useState("");
    
    const debouncedSearch = useDebounce(search, 500);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const {
        data: pages,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useAllProducts({
        limit: 10,
        search: debouncedSearch,
        sortOrder: "asc",
        sortField: "name"
    });

    const products: Product[] =
        debouncedSearch === ""
            ? []
            : pages?.pages?.flatMap((page) => page.data.data) ?? [];

    const loader = useRef<HTMLDivElement | null>(null);
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    useEffect(() => {
        const option = { root: null, rootMargin: "20px", threshold: 0 };
        const observer = new IntersectionObserver(handleObserver, option);
        const currentLoader = loader.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [handleObserver]);

    useEffect(() => {
        refetch();
    }, [debouncedSearch, refetch]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.value = search;
            searchInputRef.current.focus();
        }
    }, [isOpen, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-3xl mx-auto my-8 p-6 rounded-2xl shadow-2xl relative max-h-[calc(100vh-4rem)] overflow-y-auto">

                <CloseButton onClick={onClose} className="absolute top-4 right-4" />

                {/* Modal Header */}
                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-200 tracking-wide">
                    Search Product
                </h2>

                <div className="flex items-center gap-2 my-4">
                    <div className="relative w-full">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product by name or code..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-600"
                        />
                    </div>
                </div>

                {/* Product List with overflow; max-h dinamis */}
                <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                    {isPending ? (
                        <StateIndicator
                            isLoading={isPending}
                            isError={isError}
                            className="my-12"
                        />
                    ) : products.length === 0 ? (
                        <DataNotFound
                            title="Your cart is still empty"
                            description="Let’s explore some awesome products and add them to your cart!"
                            className="max-w-md w-full mx-auto flex flex-col items-center justify-center text-center gap-4 p-6 overflow-hidden"
                        />
                    ) : (
                        <>
                            <div className="flex flex-col gap-1 mb-2">
                                {products.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onSelectProduct(item);
                                            onClose();
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                                    >
                                        <ProductItemCard item={item} />
                                    </button>
                                ))}
                            </div>
                            {/* Infinite scroll loader */}
                            {hasNextPage && (
                                <div ref={loader} className="flex justify-center py-2">
                                    <FaSpinner className="animate-spin text-blue-400" />
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Error message */}
                {isError && (
                    <p className="text-sm text-red-500 mt-4 text-center">Failed to load products.</p>
                )}
            </div>
        </div>
    );
}