"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user/user";
import UserList from "./UserList";
import Pagination from "@/components/ui/table/Pagination";
import { useUsers } from "@/satelite/services/userService";
import ErrorComponent from "@/components/ui/feedback/Error";
import UpdateUserModal from "./modals/UpdateUserModal";
import DetailUserModal from "./modals/DetailUserModal";
import { UserRole } from "@/enum/userRole";
import PageHeader from "@/components/ui/layout/PageHeader";
import SearchSortBar from "@/components/ui/table/SearchSortBar";
import { USER_SORT_FIELDS } from "@/lib/constant";

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

    const [filterUserRole, setFilterUserRole] = useState<UserRole | "">("");

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

    const userRoleFilter = {
        label: "User Role",
        value: filterUserRole,
        options: Object.values(UserRole).map(role => ({
            key: role,
            label: role.charAt(0) + role.slice(1).toLowerCase(),
        })),
        onChange: (val: string) => setFilterUserRole(val as UserRole | ""),
    };

    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Users"
                    subtitle="View, add, and manage users with different roles and statuses."
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={USER_SORT_FIELDS as (keyof User)[]}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    pageSizes={[5, 10, 15, 20]}
                    setPageSize={setPageSize}
                    filters={[userRoleFilter]}
                />

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

                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div >

            {/* MODAL */}
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
