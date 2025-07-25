"use client";

import ErrorComponent from "@/components/Error";
import { useUserById, useUpdateUser } from "@/satelite/services/userService";
import { User } from "@/types/user/user";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserRole } from "@/enum/userRole";

type UpdateUserModalProps = {
    userIdToUpdate: string;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateUserModal({
    userIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateUserModalProps) {
    const [role, setRole] = useState<UserRole>(UserRole.USER);
    const [isActive, setIsActive] = useState<boolean>(true);

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setRole(UserRole.USER);
        setIsActive(true);
    }

    const { mutate: updateUser, isPending } = useUpdateUser();

    const { data: user, isLoading, isError } = useUserById(userIdToUpdate);

    useEffect(() => {
        if (isOpen && user) {
            setRole(user.data.role || UserRole.USER);
            setIsActive(user.data.isActive);
        }
    }, [isOpen, user]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedUser: Partial<User> = {
            id: userIdToUpdate,
            role: role,
            isActive: isActive,
        };

        updateUser(updatedUser, {
            onSuccess: () => {
                toast.success("User updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update user: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update user: Unknown error");
                }
            }
        });
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">

                {/* Close Icon */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-gray-300">
                    <FaTimes className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                    Update User
                </h2>

                <div className="space-y-5 mt-6">

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-bold text-gray-700">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            disabled={isLoading}
                            required
                        >
                            <option value="" disabled>
                                Select role
                            </option>
                            {Object.values(UserRole).map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Status */}
                    <div className="mt-4">
                        <label htmlFor="isActive" className="block text-sm font-bold text-gray-700">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="isActive"
                            value={isActive ? "active" : "inactive"}
                            onChange={(e) => setIsActive(e.target.value === "active")}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                            disabled={isLoading}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
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
        </div>
    );
}
