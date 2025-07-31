"use client";

import BannerListSkeleton from "@/components/skeletons/list/BannerListSkeleton";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Banner } from "@/types/banner/banner";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { FaEdit } from "react-icons/fa";
import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import { filterSortPaginate } from "@/utils/dataUtils";

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

const columns: DataTableColumn[] = [
    { label: "#", key: "no" },
    { label: "Banner Name", key: "name", subtitle: "Name of the Banner" },
    { label: "Description", key: "description", subtitle: "Description of the Banner" },
    { label: "Sequence", key: "sequence", subtitle: "Sequence of the Banner" },
    { label: "Media Type", key: "mediaType", subtitle: "MediaType of the Banner" },
    { label: "Banner Url", key: "url", subtitle: "Url of the Banner" },
    { label: "Date Created", key: "createdAt", subtitle: "Date created of the Banner" },
    { label: "Latest Update", key: "updatedAt", subtitle: "Date of Latest Update" },
    { label: "Actions", key: "actions", subtitle: "Manage Product", align: "right" },
];

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
    const {
        pageData: paginatedBanners,
    } = filterSortPaginate(
        banners,
        search,
        ["name", "mediaType"],
        sortField,
        sortOrder,
        currentPage,
        pageSize
    );

    function renderRow(banner: Banner, index: number) {
        return (
            <tr key={banner.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                <td className="px-6 py-4 text-sm text-gray-800">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{banner.name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{banner.description || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{banner.sequence || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{banner.mediaType || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{banner.url || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>{formatDate(banner.createdAt)}</span>
                        <span className="text-xs text-gray-400">{formatTime(banner.createdAt)}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>{formatDate(banner.updatedAt)}</span>
                        <span className="text-xs text-gray-400">{formatTime(banner.updatedAt)}</span>
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
        );
    }

    return (
        <DataTable<Banner>
            columns={columns}
            data={paginatedBanners}
            loading={onLoading}
            skeleton={<BannerListSkeleton />}
            emptyText="No banners found."
            renderRow={renderRow}
        />
    );
}