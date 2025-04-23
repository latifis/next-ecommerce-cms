"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product/product";
import { FaPlus } from "react-icons/fa";
import ProductSearchSort from "./ProductSearchSort";
import ProductList from "./ProductList";
import Pagination from "@/components/Pagination";
import ErrorComponent from "@/components/Error";
import { useProducts } from "@/satelite/services/productService";
import AddProductModal from "./modals/AddProductModal";
import UpdateProductModal from "./modals/UpdateProductModal";
import DetailProductModal from "./modals/DetailProductModal";

export default function ProductPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Product>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [productIdToUpdate, setProductIdToUpdate] = useState<string | undefined>("");
    const [productIdDetail, setProductIdDetail] = useState<string | undefined>("");

    const [products, setProducts] = useState<Product[]>([]);
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

    const { data, isLoading, isError, refetch } = useProducts(filters);

    useEffect(() => {
        if (data) {
            setProducts(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    const handleAddProduct = () => {
        setIsModalAddOpen(true);
    };

    const handleUpdateProduct = (productId: string | undefined) => {
        setIsModalUpdateOpen(true);
        setProductIdToUpdate(productId);
    };

    const handleClickDetail = (productId: string | undefined) => {
        setIsModalDetailOpen(true);
        setProductIdDetail(productId);
    };

    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 bg-gray-50 min-h-screen space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-blue-200"
                    >
                        <FaPlus />
                        <span>Add Product</span>
                    </button>
                </div>

                {/* Search and Sort */}
                <ProductSearchSort
                    search={search}
                    setSearch={setSearch}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    setPageSize={setPageSize}
                />

                {/* Product Table */}
                <ProductList
                    onUpdate={handleUpdateProduct}
                    onClickDetail={handleClickDetail}
                    onLoading={isLoading}
                    products={products}
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

            <AddProductModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDone={refetch}
            />

            <UpdateProductModal
                isOpen={isModalUpdateOpen}
                productIdToUpdate={productIdToUpdate}
                onClose={() => setIsModalUpdateOpen(false)}
                onDone={refetch}
            />

            <DetailProductModal
                isOpen={isModalDetailOpen}
                productId={productIdDetail}
                onClose={() => setIsModalDetailOpen(false)}
            />
        </>
    );
}
