"use client";

import UserListSkeleton from "@/components/skeletons/UserListSkeleton";
import { UserRole } from "@/enum/userRole";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { User } from "@/types/user/user";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

type UserListProps = {
    onUpdate: (userId: string) => void;
    onClickDetail: (productId: string | undefined) => void;
    onLoading: boolean;
    users: User[];
    search: string;
    sortField: keyof User;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
};

export default function UserList({
    onUpdate,
    onClickDetail,
    onLoading,
    users,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
}: UserListProps) {
    const filteredUsers = users.filter((user) =>
        (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.address?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        const valueA = a[sortField] || "";
        const valueB = b[sortField] || "";

        if (valueA === valueB) return 0;
        if (sortOrder === SORT_ORDER_ASC) return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
    });

    const validCurrentPage = currentPage > 0 ? currentPage : 1;
    const validPageSize = pageSize > 0 ? pageSize : 10;

    const maxPage = Math.ceil(sortedUsers.length / validPageSize);
    const finalPage = Math.min(validCurrentPage, maxPage);

    const startIndex = (finalPage - 1) * validPageSize;
    const endIndex = finalPage * validPageSize;

    const paginatedUsers = sortedUsers.slice(
        Math.max(0, startIndex),
        Math.min(sortedUsers.length, endIndex)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">#</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            User Name
                            <span className="block text-xs text-gray-400">Name of the User</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Email
                            <span className="block text-xs text-gray-400">Email of the User</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Phone
                            <span className="block text-xs text-gray-400">Phone number of the User</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Role
                            <span className="block text-xs text-gray-400">Role of the User</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Latest Update
                            <span className="block text-xs text-gray-400">Date of Latest Update</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Details
                            <span className="block text-xs text-gray-400">More Info</span>
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                            Actions
                            <span className="block text-xs text-gray-400">Manage User</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {onLoading ? (
                        <UserListSkeleton />
                    ) : paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`
                                    hover:bg-blue-50 
                                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                                    border-t
                                    ${!user.isActive ? "italic" : ""}
                                `}
                            >
                                <td className={`px-6 py-4 text-sm ${user.isActive ? "text-gray-800" : "text-gray-400"}`}>
                                    {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium ${user.isActive ? "text-gray-900" : "text-gray-400"}`}>
                                    {user.name || "N/A"}
                                </td>
                                <td className={`px-6 py-4 text-sm ${user.isActive ? "text-gray-700" : "text-gray-400"}`}>
                                    {user.email || "N/A"}
                                </td>
                                <td className={`px-6 py-4 text-sm ${user.isActive ? "text-gray-700" : "text-gray-400"}`}>
                                    {user.phone || "N/A"}
                                </td><td className="px-6 py-4 text-sm text-gray-700">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${!user.isActive
                                                ? "bg-gray-200 text-gray-500"
                                                : user.role === UserRole.ADMIN
                                                    ? "bg-red-100 text-red-800"
                                                    : user.role === UserRole.USER
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {!user.isActive ? "Inactive" : user.role || "N/A"}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-sm ${user.isActive ? "text-gray-700" : "text-gray-400"}`}>
                                    <div className="flex flex-col text-left">
                                        <span>
                                            {user.updatedAt
                                                ? formatDate(user.updatedAt)
                                                : formatDate(user.createdAt)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {user.birthDate
                                                ? formatTime(user.birthDate)
                                                : formatTime(user.birthDate)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <button
                                        onClick={() => onClickDetail(user.id)}
                                        className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaInfoCircle />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onUpdate(user.id)}
                                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
