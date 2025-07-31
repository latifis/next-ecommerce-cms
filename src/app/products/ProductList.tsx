"use client";

import { FaEdit, FaInfoCircle } from "react-icons/fa";
import ProductListSkeleton from "@/components/skeletons/list/ProductListSkeleton";
import { Product } from "@/types/product/product";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import { filterSortPaginate } from "@/utils/dataUtils";

type ProductListProps = {
    onUpdate: (productId: string | undefined) => void;
    onClickDetail: (productId: string | undefined) => void;
    onLoading: boolean;
    products: Product[];
    search: string;
    sortField: keyof Product;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
};

const columns: DataTableColumn[] = [
    { label: "#", key: "no" },
    { label: "Product Name", key: "name", subtitle: "Name of the Product" },
    { label: "Price", key: "price", subtitle: "IDR (Indonesian Rupiah)" },
    { label: "Stock", key: "stock", subtitle: "Unit (Quantity Available)" },
    { label: "Category", key: "categoryName", subtitle: "Product Category" },
    { label: "Brand", key: "brandName", subtitle: "Product Brand" },
    { label: "Latest Update", key: "latestUpdate", subtitle: "Date of Latest Update" },
    { label: "Details", key: "details", subtitle: "More Info" },
    { label: "Actions", key: "actions", subtitle: "Manage Product", align: "right" },
];

export default function ProductList({
    onUpdate,
    onClickDetail,
    onLoading,
    products,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
}: ProductListProps) {
    const {
        pageData: paginatedProducts,
    } = filterSortPaginate(
        products,
        search,
        ["name", "description", "categoryName", "brandName"],
        sortField,
        sortOrder,
        currentPage,
        pageSize
    );

    function renderRow(product: Product, index: number) {
        return (
            <tr key={product.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                <td className="px-6 py-4 text-sm text-gray-800">
                    {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.price.toLocaleString('id-ID') || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.stock.toLocaleString('id-ID') || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.categoryName || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.brandName || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>
                            {product.updatedAt
                                ? formatDate(product.updatedAt)
                                : formatDate(product.createdAt)}
                        </span>
                        <span className="text-xs text-gray-400">
                            {product.updatedAt
                                ? formatTime(product.updatedAt)
                                : formatTime(product.createdAt)}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4 text-left">
                    <button
                        onClick={() => onClickDetail(product.id)}
                        className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 px-3 py-2 rounded mx-2"
                    >
                        <FaInfoCircle />
                    </button>
                </td>
                <td className="px-6 py-4 text-right">
                    <button
                        onClick={() => onUpdate(product.id)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 px-3 py-2 rounded mx-2"
                    >
                        <FaEdit />
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <DataTable<Product>
            columns={columns}
            data={paginatedProducts}
            loading={onLoading}
            skeleton={<ProductListSkeleton />}
            emptyText="No products found."
            renderRow={renderRow}
        />
    );
}
