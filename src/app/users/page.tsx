"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user/user";
import UserSearchSort from "./UserSearchSort";
import UserList from "./UserList";
import Pagination from "@/components/Pagination";
import { useUsers } from "@/satelite/services/userService";
import ErrorComponent from "@/components/Error";
import UpdateUserModal from "./modals/UpdateUserModal";
import DetailUserModal from "./modals/DetailUserModal";
import { UserRole } from "@/enum/userRole";

export default function UserPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof User>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [userIdDetail, setUserIdDetail] = useState<string | undefined>("");
    const [userIdToUpdate, setUserIdToUpdate] = useState<string>("");

    const [filterUserRole, setFilterUserRole] = useState<UserRole | null>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField, sortOrder, pageSize, filterUserRole]);

    const filters = {
        page: currentPage,
        limit: pageSize,
        filterUserRole: filterUserRole,
        search,
        sortField,
        sortOrder,
    };

    const { data, isLoading, isError, refetch } = useUsers(filters);

    useEffect(() => {
        if (data) {
            setUsers(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    const handleClickDetail = (userId: string | undefined) => {
        setIsModalDetailOpen(true);
        setUserIdDetail(userId);
    };

    const handleUpdateUser = (userId: string) => {
        setIsModalUpdateOpen(true);
        setUserIdToUpdate(userId);
    };
    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
                        <p className="text-gray-600 text-sm mt-2">
                            View, add, and manage users with different roles and statuses.
                        </p>
                    </div>
                </div>

                {/* Search and Sort */}
                <UserSearchSort
                    search={search}
                    setSearch={setSearch}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    setPageSize={setPageSize}
                    userRole={filterUserRole}
                    setFilterUserRole={setFilterUserRole}
                />

                {/* User Table */}
                <UserList
                    onUpdate={handleUpdateUser}
                    onClickDetail={handleClickDetail}
                    onLoading={isLoading}
                    users={users}
                    search={search}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    currentPage={currentPage}
                    pageSize={pageSize}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div >

            <UpdateUserModal
                isOpen={isModalUpdateOpen}
                userIdToUpdate={userIdToUpdate}
                onClose={() => setIsModalUpdateOpen(false)}
                onDone={refetch}
            />

            <DetailUserModal
                isOpen={isModalDetailOpen}
                userId={userIdDetail}
                onClose={() => setIsModalDetailOpen(false)}
            />
        </>
    );
}
