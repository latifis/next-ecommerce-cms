"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product/product";
import { FaPlus } from "react-icons/fa";
import ProductList from "./ProductList";
import Pagination from "@/components/ui/table/Pagination";
import ErrorComponent from "@/components/ui/feedback/Error";
import { useProducts } from "@/satelite/services/productService";
import AddProductModal from "./modals/AddProductModal";
import UpdateProductModal from "./modals/UpdateProductModal";
import DetailProductModal from "./modals/DetailProductModal";
import PageHeader from "@/components/ui/layout/PageHeader";
import SearchSortBar from "@/components/ui/table/SearchSortBar";
import { PRODUCT_SORT_FIELDS } from "@/lib/constant";

export default function ProductPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Product>("updatedAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Products"
                    subtitle="Monitor and manage your product listings, prices, and availability."
                    actionLabel="Add Product"
                    onAction={handleAddProduct}
                    actionIcon={<FaPlus />}
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={PRODUCT_SORT_FIELDS}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    pageSizes={[5, 10, 15, 20]}
                    setPageSize={setPageSize}
                />

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

                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div>

            {/* MODAL */}
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
