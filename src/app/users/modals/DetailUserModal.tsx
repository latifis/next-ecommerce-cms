"use client";

import ErrorComponent from "@/components/Error";
import { useUserById } from "@/satelite/services/userService";
import { FaTimes } from "react-icons/fa";
import { formatDateAndTime } from "@/utils/formatDateAndTime";
import Image from "next/image";
import { DEFAULT_USER_URL } from "@/lib/constant";

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
    const { data: user, isLoading, isError } = useUserById(userId);

    if (isError) return <ErrorComponent />;

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white shadow-xl z-50 border-l border-gray-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 w-full md:w-1/3`}
            onMouseLeave={() => onClose(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300">
                <h2 className="text-lg font-medium text-gray-700">User Details</h2>
                <button
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    onClick={() => onClose(false)}
                    aria-label="Close Modal"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-72px)]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-t-4 rounded-full animate-spin"></div>
                    </div>
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
    );
}
