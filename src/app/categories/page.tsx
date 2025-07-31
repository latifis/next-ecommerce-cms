"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category/category";
import { FaPlus } from "react-icons/fa";
import CategoryList from "./CategoryList";
import Pagination from "@/components/ui/table/Pagination";
import { useCategories } from "@/satelite/services/categoryService";
import AddCategoryModal from "./modals/AddCategoryModal";
import ErrorComponent from "@/components/ui/feedback/Error";
import UpdateCategoryModal from "./modals/UpdateCategoryModal";
import DetailCategoryModal from "./modals/DetailCategoryModal";
import { CATEGORY_SORT_FIELDS } from "@/lib/constant";
import SearchSortBar from "@/components/ui/table/SearchSortBar";
import PageHeader from "@/components/ui/layout/PageHeader";

export default function CategoryPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Category>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [categoryIdDetail, setCategoryIdDetail] = useState<string | undefined>("");
    const [categoryIdToUpdate, setCategoryIdToUpdate] = useState<string | undefined>("");

    const [categories, setCategories] = useState<Category[]>([]);
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

    const { data, isLoading, isError, refetch } = useCategories(filters);

    useEffect(() => {
        if (data) {
            setCategories(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    const handleAddCategory = () => {
        setIsModalAddOpen(true);
    };

    const handleClickDetail = (categoryId: string | undefined) => {
        setIsModalDetailOpen(true);
        setCategoryIdDetail(categoryId);
    };

    const handleUpdateCategory = (categoryId: string | undefined) => {
        setIsModalUpdateOpen(true);
        setCategoryIdToUpdate(categoryId);
    };
    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Categories"
                    subtitle="Organize your products by category to improve customer navigation."
                    actionLabel="Add Category"
                    onAction={handleAddCategory}
                    actionIcon={<FaPlus />}
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={CATEGORY_SORT_FIELDS}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    pageSizes={[5, 10, 15, 20]}
                    setPageSize={setPageSize}
                />

                <CategoryList
                    onUpdate={handleUpdateCategory}
                    onClickDetail={handleClickDetail}
                    onLoading={isLoading}
                    categories={categories}
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
            <AddCategoryModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDone={refetch}
            />
            <UpdateCategoryModal
                isOpen={isModalUpdateOpen}
                categoryIdToUpdate={categoryIdToUpdate}
                onClose={() => setIsModalUpdateOpen(false)}
                onDone={refetch}
            />
            <DetailCategoryModal
                isOpen={isModalDetailOpen}
                categoryId={categoryIdDetail}
                onClose={() => setIsModalDetailOpen(false)}
            />
        </>
    );
}
