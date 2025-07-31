"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/types/brand/brand";
import { FaPlus } from "react-icons/fa";
import BrandList from "./BrandList";
import Pagination from "@/components/ui/table/Pagination";
import { useBrands } from "@/satelite/services/brandService";
import AddBrandModal from "./modals/AddBrandModal";
import ErrorComponent from "@/components/ui/feedback/Error";
import UpdateBrandModal from "./modals/UpdateBrandModal";
import DetailBrandModal from "./modals/DetailBrandModal";
import PageHeader from "@/components/ui/layout/PageHeader";
import { BRAND_SORT_FIELDS } from "@/lib/constant";
import SearchSortBar from "@/components/ui/table/SearchSortBar";

export default function BrandPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Brand>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [brandIdDetail, setBrandIdDetail] = useState<string | undefined>("");
    const [brandIdToUpdate, setBrandIdToUpdate] = useState<string | undefined>("");

    const [brands, setBrands] = useState<Brand[]>([]);
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

    const { data, isLoading, isError, refetch } = useBrands(filters);

    useEffect(() => {
        if (data) {
            setBrands(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    const handleAddBrand = () => {
        setIsModalAddOpen(true);
    };

    const handleClickDetail = (brandId: string | undefined) => {
        setIsModalDetailOpen(true);
        setBrandIdDetail(brandId);
    };

    const handleUpdateBrand = (brandId: string | undefined) => {
        setIsModalUpdateOpen(true);
        setBrandIdToUpdate(brandId);
    };
    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Brands"
                    subtitle="Manage brand information to maintain product identity and trust."
                    actionLabel="Add Brand"
                    onAction={handleAddBrand}
                    actionIcon={<FaPlus />}
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={BRAND_SORT_FIELDS}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    pageSizes={[5, 10, 15, 20]}
                    setPageSize={setPageSize}
                />

                <BrandList
                    onUpdate={handleUpdateBrand}
                    onClickDetail={handleClickDetail}
                    onLoading={isLoading}
                    brands={brands}
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

            {/* MODAL */}
            <AddBrandModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDone={refetch}
            />
            <UpdateBrandModal
                isOpen={isModalUpdateOpen}
                brandIdToUpdate={brandIdToUpdate}
                onClose={() => setIsModalUpdateOpen(false)}
                onDone={refetch}
            />
            <DetailBrandModal
                isOpen={isModalDetailOpen}
                brandId={brandIdDetail}
                onClose={() => setIsModalDetailOpen(false)}
            />
        </>
    );
}
