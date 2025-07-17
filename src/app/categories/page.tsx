"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category/category";
import { FaPlus } from "react-icons/fa";
import CategorySearchSort from "./CategorySearchSort";
import CategoryList from "./CategoryList";
import Pagination from "@/components/Pagination";
import { useCategories } from "@/satelite/services/categoryService";
import AddCategoryModal from "./modals/AddCategoryModal";
import ErrorComponent from "@/components/Error";
import UpdateCategoryModal from "./modals/UpdateCategoryModal";
import DetailCategoryModal from "./modals/DetailCategoryModal";

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
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-blue-200"
                    >
                        <FaPlus />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Search and Sort */}
                <CategorySearchSort
                    search={search}
                    setSearch={setSearch}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    setPageSize={setPageSize}
                />

                {/* Category Table */}
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

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div>

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
