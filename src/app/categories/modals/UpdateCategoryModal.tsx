"use client";

import ErrorComponent from "@/components/Error";
import { useCategoryById, useUpdateCategory } from "@/satelite/services/categoryService";
import { Category } from "@/types/category/category";
import { decodeToken } from "@/utils/decodeToken";
import Cookies from 'js-cookie';
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import CloseButton from "@/components/ui/CloseButton";
import { createPortal } from "react-dom";

type UpdateCategoryModalProps = {
    categoryIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateCategoryModal({
    categoryIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateCategoryModalProps) {
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
    }

    const decodedToken = decodeToken(Cookies.get("token"))

    const { mutate: updateCategory, isPending } = useUpdateCategory();

    const { data: category, isLoading, isError } = useCategoryById(categoryIdToUpdate);

    useEffect(() => {
        if (isOpen && category) {
            setName(category.data.name || "");
            setDescription(category.data.description || "");
        }
    }, [isOpen, category]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a category name.");
            return;
        }

        const updatedCategory: Category = {
            id: categoryIdToUpdate,
            name: name,
            description: description,
            updatedBy: decodedToken?.email
        };

        updateCategory(updatedCategory, {
            onSuccess: () => {
                toast.success("Category updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update category: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update category: Unknown error");
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
                    Update Category
                </h2>

                <div className="space-y-5 mt-2 overflow-y-auto px-4">
                    {/* Category Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter category name"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Category Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">Category Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            placeholder="Enter category description"
                            rows={4}
                            disabled={isLoading}
                        ></textarea>
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
