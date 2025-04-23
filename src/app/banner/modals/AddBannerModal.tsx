"use client"

import React, { useState } from "react";
import { useAddBanner } from "@/satelite/services/bannerService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FaCloudUploadAlt, FaSpinner, FaTimes } from "react-icons/fa";
import Image from "next/image";

type AddBannerModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
}

export default function AddBannerModal({
    isOpen,
    onClose,
    onDone,
}: AddBannerModalProps) {
    const [name, setName] = useState("");
    const [mediaType, setMediaType] = useState("");
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
        setSequence(0);
    }

    const { mutate: addBanner, isPending } = useAddBanner();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !mediaType || !imageFile || !description || !sequence) {
            toast.error("Please fill all fields");
            return;
        }

        const newBanner = new FormData();
        newBanner.append("name", name);
        newBanner.append("description", description);
        newBanner.append("sequence", sequence.toString());
        newBanner.append("mediaType", mediaType);
        if (imageFile) {
            newBanner.append("file", imageFile);
        }

        addBanner(newBanner, {
            onSuccess: () => {
                toast.success("Banner added successfully");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add banner: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add banner: Unknown error");
                }
            }
        })
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 md:p-8">
            <div
                className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-xl shadow-xl relative overflow-y-auto min-h-[200px] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] md:max-h-[calc(100vh-4rem)]"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    <FaTimes className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Add Banner</h2>

                <div className="space-y-5 mt-6">
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
                                    e.preventDefault();
                                }}
                                onClick={() => {
                                    document.getElementById('file-input')?.click();
                                }}
                                className={`border-4 border-dashed border-gray-300 rounded-lg p-8 mb-4 flex items-center justify-center text-gray-500 transition-all duration-300 relative h-48 hover:border-blue-400 hover:bg-blue-50 cursor-pointer`}
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
                            />
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
        </div >
    )
}