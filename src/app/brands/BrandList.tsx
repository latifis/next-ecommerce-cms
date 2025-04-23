"use client";

import BrandListSkeleton from "@/components/skeletons/BrandListSkeleton";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Brand } from "@/types/brand/brand";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { truncateDescription } from "@/utils/truncateDescription";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

type BrandListProps = {
    onUpdate: (brandId: string | undefined) => void;
    onClickDetail: (productId: string | undefined) => void;
    onLoading: boolean;
    brands: Brand[];
    search: string;
    sortField: keyof Brand;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
};

export default function BrandList({
    onUpdate,
    onClickDetail,
    onLoading,
    brands,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
}: BrandListProps) {
    const filteredBrands = brands.filter((brand) =>
        (brand.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (brand.description?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const sortedBrands = filteredBrands.sort((a, b) => {
        const valueA = a[sortField] || "";
        const valueB = b[sortField] || "";

        if (valueA === valueB) return 0;
        if (sortOrder === SORT_ORDER_ASC) return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
    });

    const validCurrentPage = currentPage > 0 ? currentPage : 1;
    const validPageSize = pageSize > 0 ? pageSize : 10;

    const maxPage = Math.ceil(sortedBrands.length / validPageSize);
    const finalPage = Math.min(validCurrentPage, maxPage);

    const startIndex = (finalPage - 1) * validPageSize;
    const endIndex = finalPage * validPageSize;

    const paginatedBrands = sortedBrands.slice(
        Math.max(0, startIndex),
        Math.min(sortedBrands.length, endIndex)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">#</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Brand Name
                            <span className="block text-xs text-gray-400">Name of the Brand</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Description
                            <span className="block text-xs text-gray-400">Details about the brand</span>
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
                            <span className="block text-xs text-gray-400">Manage Brand</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {onLoading ? (
                        <BrandListSkeleton />
                    ) : paginatedBrands.length > 0 ? (
                        paginatedBrands.map((brand, index) => (
                            <tr
                                key={brand.id}
                                className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
                            >
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {brand.name || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {truncateDescription(brand.description, 100) || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <div className="flex flex-col text-left">
                                        <span>
                                            {brand.updatedAt
                                                ? formatDate(brand.updatedAt)
                                                : formatDate(brand.createdAt)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {brand.updatedAt
                                                ? formatTime(brand.updatedAt)
                                                : formatTime(brand.createdAt)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <button
                                        onClick={() => onClickDetail(brand.id)}
                                        className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaInfoCircle />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onUpdate(brand.id)}
                                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    {/* <button className="text-red-600 hover:text-red-700 mx-2">
                                        <FaTrash />
                                    </button> */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                No brands found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
