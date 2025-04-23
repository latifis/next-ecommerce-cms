"use client";

import BannerListSkeleton from "@/components/skeletons/BannerListSkeleton";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Banner } from "@/types/banner/banner";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { FaEdit } from "react-icons/fa";

type BannerListProps = {
    onUpdate: (bannerId: string | undefined) => void;
    onLoading: boolean;
    banners: Banner[];
    search: string;
    sortField: keyof Banner;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
};

export default function BannerList({
    onUpdate,
    onLoading,
    banners,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
}: BannerListProps) {
    const filteredBanners = banners.filter((banner) =>
        (banner.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (banner.mediaType?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const sortedBanners = filteredBanners.sort((a, b) => {
        const valueA = a[sortField] || "";
        const valueB = b[sortField] || "";

        if (valueA === valueB) return 0;
        if (sortOrder === SORT_ORDER_ASC) return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
    });

    const validCurrentPage = currentPage > 0 ? currentPage : 1;
    const validPageSize = pageSize > 0 ? pageSize : 10;

    const maxPage = Math.ceil(sortedBanners.length / validPageSize);
    const finalPage = Math.min(validCurrentPage, maxPage);

    const startIndex = (finalPage - 1) * validPageSize;
    const endIndex = finalPage * validPageSize;

    const paginatedBanners = sortedBanners.slice(
        Math.max(0, startIndex),
        Math.min(sortedBanners.length, endIndex)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">#</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Banner Name
                            <span className="block text-xs text-gray-400">Name of the Banner</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Description
                            <span className="block text-xs text-gray-400">Description of the Banner</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Sequence
                            <span className="block text-xs text-gray-400">Sequence of the Banner</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Media Type
                            <span className="block text-xs text-gray-400">MediaType of the Banner</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Banner Url
                            <span className="block text-xs text-gray-400">Url of the Banner</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Date Created
                            <span className="block text-xs text-gray-400">Date created of the Banner</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Latest Update
                            <span className="block text-xs text-gray-400">Date of Latest Update</span>
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                            Actions
                            <span className="block text-xs text-gray-400">Manage Product</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {onLoading ? (
                        <BannerListSkeleton />
                    ) : paginatedBanners.length > 0 ? (
                        paginatedBanners.map((banner, index) => (
                            <tr key={banner.id}
                                className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {banner.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {banner.description || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {banner.sequence || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {banner.mediaType || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {banner.url || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <div className="flex flex-col text-left">
                                        <span>
                                            {formatDate(banner.createdAt)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatTime(banner.createdAt)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <div className="flex flex-col text-left">
                                        <span>
                                            {formatDate(banner.updatedAt)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatTime(banner.updatedAt)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onUpdate(banner.id)}
                                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                                No banners found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}