"use client";

import ErrorComponent from "@/components/Error";
import { useBrandById, useUpdateBrand } from "@/satelite/services/brandService";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import CloseButton from "@/components/ui/CloseButton";
import { createPortal } from "react-dom";

type UpdateBrandModalProps = {
    brandIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateBrandModal({
    brandIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateBrandModalProps) {
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
        setLogoUrl("");
        setImageFile(null);
    }

    const { mutate: updateBrand, isPending } = useUpdateBrand(brandIdToUpdate);

    const { data: brand, isLoading, isError } = useBrandById(brandIdToUpdate);

    useEffect(() => {
        if (isOpen && brand) {
            setName(brand.data.name || "");
            setDescription(brand.data.description || "");
            setLogoUrl(brand.data.logoUrl || "");
        }
    }, [isOpen, brand]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a brand name.");
            return;
        }

        const updatedBrand = new FormData();
        updatedBrand.append("name", name);
        updatedBrand.append("description", description);
        if (imageFile) {
            updatedBrand.append("file", imageFile);
        }

        updateBrand(updatedBrand, {
            onSuccess: () => {
                toast.success("Brand updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update brand: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update brand: Unknown error");
                }
            }
        });
    };

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    if (isError) return <ErrorComponent />;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl shadow-2xl relative max-h-[calc(100vh-3rem)] flex flex-col">
                <CloseButton onClick={handleClose} className="absolute top-4 right-4" />

                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-100 tracking-wide mb-6">
                    Update Brand
                </h2>

                <div className="space-y-5 mt-2 overflow-y-auto px-4">
                    {/* Brand Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter brand name"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Brand Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">Brand Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter brand description"
                            rows={4}
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    {/* Brand Logo URL */}
                    <div>
                        <label htmlFor="imageFile" className="block text-sm font-bold text-gray-700">
                            Brand Logo
                        </label>

                        <div className="relative mb-6 mt-3">
                            {/* Drag and Drop Area */}
                            <div
                                onDrop={(e) => {
                                    if (isLoading || isPending) return;
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                        if (file.size > 200000) {
                                            toast.error("File size must be less than 200KB.");
                                            return;
                                        }
                                        setImageFile(file);
                                        setLogoUrl("");
                                    }
                                }}
                                onDragOver={(e) => {
                                    if (isLoading || isPending) return;
                                    e.preventDefault();
                                }}
                                onClick={() => {
                                    if (isLoading || isPending) return;
                                    document.getElementById('file-input')?.click();
                                }}
                                aria-disabled={isLoading || isPending}
                                className={`border-4 border-dashed border-gray-300 rounded-lg p-8 mb-4 flex items-center justify-center text-gray-500 transition-all duration-300 relative h-48
                                            ${isLoading || isPending ? "cursor-not-allowed pointer-events-none bg-gray-200" : "hover:border-blue-400 hover:bg-blue-50 cursor-pointer"}`}
                            >
                                {/* If image is uploaded or imageUrl is provided */}
                                {(imageFile || logoUrl) ? (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <Image
                                            src={imageFile ? URL.createObjectURL(imageFile) : logoUrl}
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
                                                } else if (logoUrl) {
                                                    setLogoUrl("");
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
                                        setLogoUrl("");
                                    }
                                }}
                                className="hidden"
                                disabled={isLoading || isPending}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center mt-8 space-x-4">
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-lg text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center"
                        disabled={isPending || isLoading}
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
        </div>,
        document.body
    );
}
