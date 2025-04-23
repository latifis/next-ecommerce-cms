"use client";

import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Product } from "@/types/product/product";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

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
    const filteredProducts = products.filter((product) =>
        (product.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (product.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (product.categoryName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (product.brandName?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const sortedProducts = filteredProducts.sort((a, b) => {
        const valueA = a[sortField] || "";
        const valueB = b[sortField] || "";

        if (valueA === valueB) return 0;
        if (sortOrder === SORT_ORDER_ASC) return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
    });

    const validCurrentPage = currentPage > 0 ? currentPage : 1;
    const validPageSize = pageSize > 0 ? pageSize : 10;

    const maxPage = Math.ceil(sortedProducts.length / validPageSize);
    const finalPage = Math.min(validCurrentPage, maxPage);

    const startIndex = (finalPage - 1) * validPageSize;
    const endIndex = finalPage * validPageSize;

    const paginatedProducts = sortedProducts.slice(
        Math.max(0, startIndex),
        Math.min(sortedProducts.length, endIndex)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">#</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Product Name
                            <span className="block text-xs text-gray-400">Name of the Product</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Price
                            <span className="block text-xs text-gray-400">IDR (Indonesian Rupiah)</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Stock
                            <span className="block text-xs text-gray-400">Unit (Quantity Available)</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Category
                            <span className="block text-xs text-gray-400">Product Category</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Brand
                            <span className="block text-xs text-gray-400">Product Brand</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Latest Update
                            <span className="block text-xs text-gray-400">Date of Latest Update</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Details
                            <span className="block text-xs text-gray-400">More Info</span>
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                            Actions
                            <span className="block text-xs text-gray-400">Manage Product</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {onLoading ? (
                        <ProductListSkeleton />
                    ) : paginatedProducts.length > 0 ? (
                        paginatedProducts.map((product, index) => (
                            <tr
                                key={product.id}
                                className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
                            >
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {product.name || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {product.price.toLocaleString('id-ID') || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {product.stock.toLocaleString('id-ID') || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {product.categoryName || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {product.brandName || "N/A"}
                                </td>
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
                                    {/* <button
                                        className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaTrash />
                                    </button> */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
