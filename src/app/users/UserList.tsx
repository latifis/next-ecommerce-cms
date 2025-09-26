"use client";

import UserListSkeleton from "@/components/skeletons/list/UserListSkeleton";
import { UserRole } from "@/enum/userRole";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { filterSortPaginate } from "@/utils/dataUtils";
import { User } from "@/types/user/user";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import { MdVerified } from "react-icons/md";

type UserListProps = {
    onUpdate: (userId: string) => void;
    onClickDetail: (userId: string | undefined) => void;
    onLoading: boolean;
    users: User[];
    search: string;
    sortField: keyof User;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
    filterUserRole?: UserRole | null;
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
    filterUserRole,
}: UserListProps) {
    const filteredUsers = filterUserRole
        ? users.filter((user) => user.role === filterUserRole)
        : users;

    const {
        pageData: paginatedUsers,
    } = filterSortPaginate(
        filteredUsers,
        search,
        ["name", "email", "phone", "address"],
        sortField,
        sortOrder,
        currentPage,
        pageSize
    );

    const columns: DataTableColumn[] = [
        { label: "#", key: "index" },
        { label: "User Name", key: "name", subtitle: "Name of the User" },
        { label: "Email", key: "email", subtitle: "User Email" },
        { label: "Phone", key: "phone", subtitle: "User Phone Number" },
        { label: "Role", key: "role", subtitle: "User Role (Admin/User)" },
        { label: "Latest Update", key: "updatedAt", subtitle: "Last Modified Date" },
        { label: "Details", key: "details", subtitle: "User Info" },
        { label: "Actions", key: "actions", subtitle: "Manage User", align: "right" },
    ];

    function renderRow(user: User, index: number) {
        const isActive = user.isActive;
        const baseText = isActive ? "text-gray-700" : "text-gray-400";

        return (
            <tr
                key={user.id}
                className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t ${!isActive ? "italic" : ""}`}
            >
                <td className={`px-6 py-4 text-sm ${baseText}`}>
                    {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className={`px-6 py-4 text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {user.name || "N/A"}
                </td>
                <td className={`px-6 py-4 text-sm ${baseText}`}>
                    {user.email || "N/A"}{user.isVerified ? <MdVerified className="inline text-green-500 ml-1" /> : null}
                </td>
                <td className={`px-6 py-4 text-sm ${baseText}`}>
                    {user.phone || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${!isActive
                            ? "bg-gray-200 text-gray-500"
                            : user.role === UserRole.ADMIN
                                ? "bg-red-100 text-red-800"
                                : user.role === UserRole.USER
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {!isActive ? "Inactive" : user.role || "N/A"}
                    </span>
                </td>
                <td className={`px-6 py-4 text-sm ${baseText}`}>
                    <div className="flex flex-col text-left">
                        <span>{formatDate(user.updatedAt ?? user.createdAt)}</span>
                        <span className="text-xs text-gray-400">
                            {formatTime(user.updatedAt ?? user.createdAt)}
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
        );
    }

    return (
        <DataTable<User>
            columns={columns}
            data={paginatedUsers}
            loading={onLoading}
            skeleton={<UserListSkeleton />}
            emptyText="No users found."
            renderRow={renderRow}
        />
    );
}
