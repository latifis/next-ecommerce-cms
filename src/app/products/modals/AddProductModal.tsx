"use client";

import ErrorComponent from "@/components/Error";
import { useCategories } from "@/satelite/services/categoryService";
import { useAddProduct } from "@/satelite/services/productService";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { FaCloudUploadAlt, FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useBrands } from "@/satelite/services/brandService";

type AddProductModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function AddProductModal({
    isOpen,
    onClose,
    onDone,
}: AddProductModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(2500);
    const [stock, setStock] = useState<number>(100);
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [brandId, setBrandId] = useState("");
    const [unit, setUnit] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [minQuantityForDiscount, setMinQuantityForDiscount] = useState<number>(10);
    const [bulkDiscountPrice, setBulkDiscountPrice] = useState<number>(2000);

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
        resetValue()
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
        setPrice(2500);
        setStock(100);
        setCategoryId("")
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

    const { mutate: addProduct, isPending } = useAddProduct();

    const { data: categoryData, isLoading, isError } = useCategories(filters);

    const { data: brandData, isLoading: isLoadingBrand, isError: isErrorBrand } = useBrands(filters);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a product name.");
            return;
        } else if (!price) {
            toast.error("Please enter a product price.");
            return;
        } else if (!unit) {
            toast.error("Please enter a product unit.");
            return;
        } else if (!discountPercentage && discountPercentage !== 0) {
            toast.error("Please enter a discount percentage.");
            return;
        } else if (!minQuantityForDiscount) {
            toast.error("Please enter a min quantity for discount.");
            return;
        } else if (!bulkDiscountPrice) {
            toast.error("Please enter a bulk discount price.");
            return;
        } else if (!stock) {
            toast.error("Please enter a product stock.");
            return;
        } else if (!categoryId) {
            toast.error("Please enter a product category.");
            return;
        } else if (!brandId) {
            toast.error("Please enter a product brand.");
            return;
        }

        const newProduct = new FormData();
        newProduct.append("name", name);
        newProduct.append("description", description);
        newProduct.append("price", price.toString());
        newProduct.append("stock", stock.toString());
        newProduct.append("categoryId", categoryId);
        newProduct.append("brandId", brandId);
        newProduct.append("unit", unit);
        newProduct.append("discountPercentage", discountPercentage.toString());
        newProduct.append("minQuantityForDiscount", minQuantityForDiscount.toString());
        newProduct.append("bulkDiscountPrice", bulkDiscountPrice.toString());
        if (imageFile) {
            newProduct.append("file", imageFile);
        }

        addProduct(newProduct, {
            onSuccess: () => {
                toast.success("Product added successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add product: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add product: Unknown error");
                }
            }
        });;
    };

    if (!isOpen) return null;

    if (isError || isErrorBrand) return <ErrorComponent />

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

                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Add Product</h2>

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
                            disabled={isLoading || isLoadingBrand}
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
                            disabled={isLoading || isLoadingBrand}
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
                            disabled={isLoading || isLoadingBrand}
                        />
                    </div>

                    {/* Product Unit */}
                    <div>
                        <label htmlFor="unit" className="block text-sm font-bold text-gray-700">
                            Unit <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            disabled={isLoading || isLoadingBrand}
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
                            Discount Percentage <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="discountPercentage"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product discount percentage"
                            min="0"
                            disabled={isLoading || isLoadingBrand}
                        />
                    </div>

                    {/* Product Min Quantity For Discount */}
                    <div>
                        <label htmlFor="minQuantityForDiscount" className="block text-sm font-bold text-gray-700">
                            Min Quantity For Discount <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="minQuantityForDiscount"
                            value={minQuantityForDiscount}
                            onChange={(e) => setMinQuantityForDiscount(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product min quantity for discount"
                            min="0"
                            disabled={isLoading || isLoadingBrand}
                        />
                    </div>

                    {/* Product Bulk Discount Price */}
                    <div>
                        <label htmlFor="bulkDiscountPrice" className="block text-sm font-bold text-gray-700">
                            Bulk Discount Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="bulkDiscountPrice"
                            value={bulkDiscountPrice}
                            onChange={(e) => setBulkDiscountPrice(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter product bulk discount price"
                            min="0"
                            disabled={isLoading || isLoadingBrand}
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
                            disabled={isLoading || isLoadingBrand}
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
                                    if (isLoading || isLoadingBrand) return;
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                        if (file.size > 200000) {
                                            toast.error("File size must be less than 200KB.");
                                            return;
                                        }
                                        setImageFile(file);
                                    }
                                }}
                                onDragOver={(e) => {
                                    if (isLoading || isLoadingBrand) return;
                                    e.preventDefault();
                                }}
                                onClick={() => {
                                    if (isLoading || isLoadingBrand) return;
                                    document.getElementById('file-input')?.click();
                                }}
                                aria-disabled={isLoading || isLoadingBrand}
                                className={`border-4 border-dashed border-gray-300 rounded-lg p-8 mb-4 flex items-center justify-center text-gray-500 transition-all duration-300 relative h-48
                                    ${isLoading || isLoadingBrand ? "cursor-not-allowed pointer-events-none bg-gray-200" : "hover:border-blue-400 hover:bg-blue-50 cursor-pointer"}`}
                            >
                                {/* If image is uploaded, show the preview */}
                                {imageFile ? (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <div className="absolute inset-0 flex justify-center items-center">
                                            <Image
                                                src={URL.createObjectURL(imageFile)}
                                                alt="Uploaded"
                                                width={128}
                                                height={128}
                                                className="object-cover rounded-lg"
                                                unoptimized
                                                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(imageFile))}
                                            />
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-transparent text-red-500 hover:text-red-700 p-1 rounded-full z-10"
                                        >
                                            <FaTimes className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                                        {/* Cloud upload icon */}
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
                                    }
                                }}
                                className="hidden"
                                disabled={isLoading || isLoadingBrand}
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
                            disabled={isLoading || isLoadingBrand}
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
                        disabled={isPending || isLoading || isLoadingBrand}
                    >
                        {isPending ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Adding...
                            </>
                        ) : (
                            "Add"
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
