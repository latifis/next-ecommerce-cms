"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useUserById } from "@/satelite/services/userService";
import { formatDateAndTime } from "@/utils/formatDateAndTime";
import Image from "next/image";
import { DEFAULT_USER_URL } from "@/lib/constant";
import CloseButton from "@/components/ui/button/CloseButton";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import StateIndicator from "@/components/ui/feedback/StateIndicator";

type DetailUserModalProps = {
    userId: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DetailUserModal({
    userId,
    isOpen,
    onClose,
}: DetailUserModalProps) {
    const [mounted, setMounted] = useState(false);

    const { data: user, isPending, isError } = useUserById(userId);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleClose = () => {
        onClose(false);
    }

    if (!mounted || !isOpen) return null;

    if (isError) return <ErrorComponent />;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl shadow-2xl relative max-h-[calc(100vh-3rem)] flex flex-col">
                <CloseButton onClick={handleClose} className="absolute top-4 right-4" />

                <h2 className="text-2xl font-bold text-center text-gray-900 pb-4 border-b border-blue-100 tracking-wide mb-6">
                    User Details
                </h2>

                {/* Content */}
                <div className="space-y-5 mt-6 overflow-y-auto px-4">
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
                                    src={user?.data.profileImageUrl || DEFAULT_USER_URL}
                                    alt={user?.data.name || "User Image"}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {user && (
                                <>
                                    <section className="space-y-6">
                                        <header>
                                            <h1 className="text-xl font-semibold text-gray-800 text-center">{user.data.name}</h1>
                                        </header>
                                        <div className="grid gap-4 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Email:</span>
                                                <span>{user.data.email || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Role:</span>
                                                <span>{user.data.role || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Phone:</span>
                                                <span>{user.data.phone || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Address:</span>
                                                <span>{user.data.address || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Phone:</span>
                                                <span>{user.data.phone || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Birth Date:</span>
                                                <span>{formatDateAndTime(user.data.birthDate) || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Gender:</span>
                                                <span>{user.data.gender || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Language Preference:</span>
                                                <span>{user.data.languagePreference || "Unknown"}</span>
                                            </div>
                                        </div>
                                    </section>
                                </>
                            )}

                            {/* Metadata */}
                            {user && (
                                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                                    <div className="grid gap-4">
                                        {/* Created Metadata */}
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-800">Created:</span>
                                            <div className="text-right">
                                                <p className="text-gray-700">Unknown</p>
                                                <p className="text-gray-500">{formatDateAndTime(user.data.createdAt)}</p>
                                            </div>
                                        </div>
                                        {/* Updated Metadata */}
                                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                            <span className="font-medium text-gray-800">Last Updated:</span>
                                            <div className="text-right">
                                                <p className="text-gray-700">
                                                    Unknown
                                                </p>
                                                {user.data.updatedAt && (
                                                    <p className="text-gray-500">{formatDateAndTime(user.data.updatedAt)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
