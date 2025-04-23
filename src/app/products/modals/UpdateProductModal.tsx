"use client";

import ErrorComponent from "@/components/Error";
import { useCategories } from "@/satelite/services/categoryService";
import { useProductById, useUpdateProduct } from "@/satelite/services/productService";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { decodeToken } from "@/utils/decodeToken";
import Cookies from 'js-cookie';
import { useBrands } from "@/satelite/services/brandService";

type UpdateProductModalProps = {
    productIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateProductModal({
    productIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateProductModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(2500);
    const [stock, setStock] = useState<number>(100);
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [brandId, setBrandId] = useState("");
    const [unit, setUnit] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [minQuantityForDiscount, setMinQuantityForDiscount] = useState<number>(10);
    const [bulkDiscountPrice, setBulkDiscountPrice] = useState<number>(2000);

    const decodedToken = decodeToken(Cookies.get("token"))
    const units = [
        'Piece',
        'Box',
        'Kilogram',
        'Gram',
        'Liter',
        'Milliliter',
        'Pack',
        'Bottle',
        'Can',
        'Bag',
        'Sachet',
        'Tube',
        'Jar',
        'Bar',
        'Roll',
        'Dozen',
        'Set',
        'Bundle',
        'Carton',
        'Pouch'
    ];

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
        setPrice(2500);
        setStock(100);
        setImageUrl("");
        setCategoryId("");
        setImageFile(null);
        setBrandId("");
        setUnit("");
        setDiscountPercentage(0);
        setMinQuantityForDiscount(10);
        setBulkDiscountPrice(2000);
    }

    const filters = {
        limit: 10000,
    };

    const { mutate: updateProduct, isPending } = useUpdateProduct(productIdToUpdate);

    const { data: product, isLoading, isError } = useProductById(productIdToUpdate);

    const { data: categoryData, isLoading: isLoadingGetCategories, isError: isErrorGetCategories } = useCategories(filters);

    const { data: brandData, isLoading: isLoadingBrand, isError: isErrorBrand } = useBrands(filters);

    useEffect(() => {
        if (isOpen && product) {
            setName(product.data.name || "");
            setDescription(product.data.description || "");
            setPrice(product.data.price || 0);
            setStock(product.data.stock || 0);
            setImageUrl(product.data.imageUrl || "");
            setCategoryId(product.data.categoryId || "");
            setBrandId(product.data.brandId || "");
            setImageFile(null);
            setUnit(product.data.unit || "");
            setDiscountPercentage(product.data.discountPercentage || 0);
            setMinQuantityForDiscount(product.data.minQuantityForDiscount || 0);
            setBulkDiscountPrice(product.data.bulkDiscountPrice || 0);
        }
    }, [isOpen, product]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a product name.");
            return;
        } else if (!categoryId) {
            toast.error("Please enter a product category.");
            return;
        } else if (!brandId) {
            toast.error("Please enter a product brand.");
            return;
        }

        if (!productIdToUpdate || !decodedToken?.email) return <ErrorComponent />

        const updatedProduct = new FormData();
        updatedProduct.append("name", name);
        updatedProduct.append("description", description);
        updatedProduct.append("price", price.toString());
        updatedProduct.append("stock", stock.toString());
        updatedProduct.append("categoryId", categoryId);
        updatedProduct.append("brandId", brandId);
        updatedProduct.append("updatedBy", decodedToken?.email);
        updatedProduct.append("unit", unit);
        updatedProduct.append("discountPercentage", discountPercentage.toString());
        updatedProduct.append("minQuantityForDiscount", minQuantityForDiscount.toString());
        updatedProduct.append("bulkDiscountPrice", bulkDiscountPrice.toString());

        if (imageFile) {
            updatedProduct.append("file", imageFile);
        }

        updateProduct(updatedProduct, {
            onSuccess: () => {
                toast.success("Product updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update product: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update product: Unknown error");
                }
            }
        });
    };

    if (!isOpen) return null;

    if (isError || isErrorGetCategories || isErrorBrand) return <ErrorComponent />

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 md:p-8">
            <div
                className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-xl shadow-xl relative overflow-y-auto min-h-[200px] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] md:max-h-[calc(100vh-4rem)]"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {/* Close Icon */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    <FaTimes className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200"> Update Product</h2>

                <div className="space-y-6 mt-8">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product name"
                            required
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        />
                    </div>

                    {/* Product Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                            Product Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product description"
                            rows={4}
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        ></textarea>
                    </div>

                    {/* Product Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product price"
                            required
                            min="0"
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        />
                    </div>

                    {/* Product Unit */}
                    <div>
                        <label htmlFor="unit" className="block text-sm font-bold text-gray-700">
                            Unit
                        </label>
                        <select
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        >
                            <option value="" disabled>Select unit</option>
                            {units.map((unitOption) => (
                                <option key={unitOption} value={unitOption}>
                                    {unitOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Discount Percentage */}
                    <div>
                        <label htmlFor="discountPercentage" className="block text-sm font-bold text-gray-700">
                            Discount Percentage
                        </label>
                        <input
                            type="number"
                            id="discountPercentage"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product discount percentage"
                            min="0"
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        />
                    </div>

                    {/* Product Minimum Quantity for Discount */}
                    <div>
                        <label htmlFor="minQuantityForDiscount" className="block text-sm font-bold text-gray-700">
                            Minimum Quantity for Discount
                        </label>
                        <input
                            type="number"
                            id="minQuantityForDiscount"
                            value={minQuantityForDiscount}
                            onChange={(e) => setMinQuantityForDiscount(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product minimum quantity for discount"
                            min="0"
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        />
                    </div>

                    {/* Product Bulk Discount Price */}
                    <div>
                        <label htmlFor="bulkDiscountPrice" className="block text-sm font-bold text-gray-700">
                            Bulk Discount Price
                        </label>
                        <input
                            type="number"
                            id="bulkDiscountPrice"
                            value={bulkDiscountPrice}
                            onChange={(e) => setBulkDiscountPrice(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product bulk discount price"
                            min="0"
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        />
                    </div>

                    {/* Product Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-bold text-gray-700">
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="stock"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product stock"
                            required
                            min="0"
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        />
                    </div>

                    <div>
                        <label htmlFor="imageFile" className="block text-sm font-bold text-gray-700">
                            Image File
                        </label>

                        <div className="relative mb-6 mt-3">
                            {/* Drag and Drop Area */}
                            <div
                                onDrop={(e) => {
                                    if (isLoading || isLoadingGetCategories || isLoadingBrand || isPending) return;
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                        if (file.size > 200000) {
                                            toast.error("File size must be less than 200KB.");
                                            return;
                                        }
                                        setImageFile(file);
                                        setImageUrl("");
                                    }
                                }}
                                onDragOver={(e) => {
                                    if (isLoading || isLoadingGetCategories || isLoadingBrand || isPending) return;
                                    e.preventDefault();
                                }}
                                onClick={() => {
                                    if (isLoading || isLoadingGetCategories || isLoadingBrand || isPending) return;
                                    document.getElementById('file-input')?.click();
                                }}
                                aria-disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                                className={`border-4 border-dashed border-gray-300 rounded-lg p-8 mb-4 flex items-center justify-center text-gray-500 transition-all duration-300 relative h-48
                        ${isLoading || isLoadingGetCategories || isLoadingBrand || isPending ? "cursor-not-allowed pointer-events-none bg-gray-200" : "hover:border-blue-400 hover:bg-blue-50 cursor-pointer"}`}
                            >
                                {/* If image is uploaded or imageUrl is provided */}
                                {(imageFile || imageUrl) ? (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <Image
                                            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                                            alt="Uploaded File"
                                            width={128}
                                            height={128}
                                            className="object-cover rounded-lg"
                                            unoptimized
                                            onLoad={() => {
                                                if (imageFile) URL.revokeObjectURL(URL.createObjectURL(imageFile));
                                            }}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (imageFile) {
                                                    setImageFile(null);
                                                    URL.revokeObjectURL(URL.createObjectURL(imageFile));
                                                } else if (imageUrl) {
                                                    setImageUrl("");
                                                }
                                            }}
                                            className="absolute top-2 right-2 bg-transparent text-red-500 hover:text-red-700 p-1 rounded-full z-10"
                                        >
                                            <FaTimes className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">
                                            Drag and drop an image file here, or click to select a file.
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            No image selected. A default image will be used if no file is uploaded.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Hidden File Input (only triggered by clicking the drop area) */}
                            <input
                                type="file"
                                id="file-input"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 200000) {
                                            toast.error("File size must be less than 200KB.");
                                            return;
                                        }
                                        setImageFile(file);
                                        setImageUrl("");
                                    }
                                }}
                                className="hidden"
                                disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                            />
                        </div>
                    </div>

                    {/* Product Category */}
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-bold text-gray-700">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="categoryName"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            required
                            disabled={isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                        >
                            <option value="" disabled>Select a category</option>
                            {categoryData?.data.data.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Brand */}
                    <div>
                        <label htmlFor="brandName" className="block text-sm font-bold text-gray-700">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="brandName"
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            required
                            disabled={isLoading || isLoadingBrand}
                        >
                            <option value="" disabled>Select a brand</option>
                            {brandData?.data.data.map((brand, index) => (
                                <option key={index} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center mt-10 space-x-4">
                    <button
                        onClick={handleSave}
                        className="px-5 py-3 rounded-lg text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                        disabled={isPending || isLoading || isLoadingGetCategories || isLoadingBrand || isPending}
                    >
                        {isPending ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            "Update"
                        )}
                    </button>

                    <button
                        onClick={handleClose}
                        className="px-5 py-3 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 flex items-center justify-center"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
