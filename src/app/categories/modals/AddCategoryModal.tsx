"use client";

import { useAddCategory } from "@/satelite/services/categoryService";
import { Category } from "@/types/category/category";
import { decodeToken } from "@/utils/decodeToken";
import Cookies from 'js-cookie';
import { AxiosError } from "axios";
import React, { useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

type AddCategoryModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function AddCategoryModal({
    isOpen,
    onClose,
    onDone,
}: AddCategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const decodedToken = decodeToken(Cookies.get("token"))

    const handleClose = () => {
        resetValue()
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
    }

    const { mutate: addCategory, isPending } = useAddCategory();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a category name.");
            return;
        }

        const newCategory: Category = {
            name: name,
            description: description,
            createdBy: decodedToken?.email
        };

        addCategory(newCategory, {
            onSuccess: () => {
                toast.success("Category added successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add category: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add category: Unknown error");
                }
            }
        });;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">

                {/* Close Icon */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    <FaTimes className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Add Category</h2>

                <div className="space-y-5 mt-6">

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
                        ></textarea>
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
    );
}
