"use client"

import ErrorComponent from "@/components/Error";
import { useBannerById, useUpdateBanner } from "@/satelite/services/bannerService";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaCloudUploadAlt, FaSpinner, FaTimes } from "react-icons/fa";
import CloseButton from "@/components/ui/CloseButton";
import { createPortal } from "react-dom";

type UpdateBannerModalProps = {
    bannerIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateBannerModal({
    bannerIdToUpdate,
    isOpen,
    onClose,
    onDone
}: UpdateBannerModalProps) {
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState("");
    const [mediaType, setMediaType] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [sequence, setSequence] = useState(0);

    const handleClose = () => {
        resetValue();
        onClose(false);
    }

    const resetValue = () => {
        setName("");
        setMediaType("");
        setImageFile(null);
        setDescription("");
        setBannerUrl("");
        setSequence(0);
    }

    const { mutate: updateBanner, isPending } = useUpdateBanner(bannerIdToUpdate);

    const { data: banner, isLoading, isError } = useBannerById(bannerIdToUpdate);

    useEffect(() => {
        if (isOpen && banner) {
            setName(banner.data.name || "");
            setMediaType(banner.data.mediaType || "");
            setDescription(banner.data.description || "");
            setSequence(banner.data.sequence || 0);
            setBannerUrl(banner.data.url || "");
        }
    }, [isOpen, banner]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedBanner = new FormData();
        updatedBanner.append("name", name);
        updatedBanner.append("description", description);
        updatedBanner.append("sequence", sequence.toString());
        updatedBanner.append("mediaType", mediaType);
        if (imageFile) {
            updatedBanner.append("file", imageFile);
        }

        updateBanner(updatedBanner, {
            onSuccess: () => {
                toast.success("Banner updated successfully");
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
        })
    }

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
                    Update Banner
                </h2>

                <div className="space-y-5 mt-2 overflow-y-auto px-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Banner Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter banner name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">Banner Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter banner description"
                            rows={4}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="sequence" className="block text-sm font-medium text-gray-700">
                            Sequence <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="sequence"
                            value={sequence}
                            onChange={(e) => setSequence(Number(e.target.value))}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter banner sequence"
                            onWheel={(e) => e.currentTarget.blur()}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mediatype" className="block text-sm font-medium text-gray-700">
                            Media Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="mediatype"
                            value={mediaType}
                            onChange={(e) => setMediaType(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter media type"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="imageFile" className="block text-sm font-bold text-gray-700">
                            Banner <span className="text-red-500">*</span>
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
                                        setBannerUrl("");
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
                                {/* If image is uploaded, show the preview */}
                                {(imageFile || bannerUrl) ? (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <div className="absolute inset-0 flex justify-center items-center">
                                            <Image
                                                src={imageFile ? URL.createObjectURL(imageFile) : bannerUrl}
                                                alt="Uploaded"
                                                width={128}
                                                height={128}
                                                className="object-cover rounded-lg"
                                                unoptimized
                                                onLoad={() => {
                                                    if (imageFile) URL.revokeObjectURL(URL.createObjectURL(imageFile));
                                                }}
                                            />
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (imageFile) {
                                                    setImageFile(null);
                                                    URL.revokeObjectURL(URL.createObjectURL(imageFile));
                                                } else if (bannerUrl) {
                                                    setBannerUrl("");
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
                                        setBannerUrl("");
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
                        disabled={isPending}
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
    )
} 