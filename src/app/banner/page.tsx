"use client"

import { Banner } from "@/types/banner/banner";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import BannerList from "./BannerList";
import { useBanner } from "@/satelite/services/bannerService";
import Pagination from "@/components/ui/table/Pagination";
import ErrorComponent from "@/components/ui/feedback/Error";
import AddBannerModal from "./modals/AddBannerModal";
import UpdateBannerModal from "./modals/UpdateBannerModal";
import PageHeader from "@/components/ui/layout/PageHeader";
import { BANNER_SORT_FIELDS } from "@/lib/constant";
import SearchSortBar from "@/components/ui/table/SearchSortBar";

export default function BannerPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Banner>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [bannerIdToUpdate, setBannerIdToUpdate] = useState<string | undefined>("");

    const [banners, setBanners] = useState<Banner[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const filters = {
        page: currentPage,
        limit: pageSize,
        search,
        sortField,
        sortOrder,
    };

    const { data, isLoading, isError, refetch } = useBanner(filters);
    useEffect(() => {
        if (data) {
            setBanners(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField, sortOrder, pageSize]);

    const handleAddBanner = () => {
        setIsModalAddOpen(true);
    }

    const handleUpdateBanner = (bannerId: string | undefined) => {
        setBannerIdToUpdate(bannerId);
        setIsModalUpdateOpen(true);
    }

    if (isError) return <ErrorComponent />

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Banner"
                    subtitle="Create and update promotional banners to boost visibility and sales."
                    actionLabel="Add Banner"
                    onAction={handleAddBanner}
                    actionIcon={<FaPlus />}
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={BANNER_SORT_FIELDS}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    pageSizes={[5, 10, 15, 20]}
                    setPageSize={setPageSize}
                />

                <BannerList
                    onUpdate={handleUpdateBanner}
                    onLoading={isLoading}
                    banners={banners}
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
            </div>

            <AddBannerModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDone={refetch}
            />

            <UpdateBannerModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                onDone={refetch}
                bannerIdToUpdate={bannerIdToUpdate}
            />
        </>
    )
}