"use client"

import { Banner } from "@/types/banner/banner";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa"
import BannerSearchSort from "./BannerSearchSort";
import BannerList from "./BannerList";
import { useBanner } from "@/satelite/services/bannerService";
import Pagination from "@/components/Pagination";
import ErrorComponent from "@/components/Error";
import AddBannerModal from "./modals/AddBannerModal";
import UpdateBannerModal from "./modals/UpdateBannerModal";

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

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField, sortOrder, pageSize]);

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

    const handleAddBanner = () => {
        setIsModalAddOpen(true);
    }

    const handleUpdateBanner = (bannerId: string | undefined) => {
        setBannerIdToUpdate(bannerId);
        setIsModalUpdateOpen(true);
    }

    if (isError){
        return <ErrorComponent/>
    }
    return (
        <>
            <div className="p-8 bg-gray-50 min-h-screen space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Banner</h1>
                    <button
                        onClick={handleAddBanner}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-blue-200"
                    >
                        <FaPlus />
                        <span>Add Banner</span>
                    </button>
                </div>

                {/* Search and Sort */}
                <BannerSearchSort
                    search={search}
                    setSearch={setSearch}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
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