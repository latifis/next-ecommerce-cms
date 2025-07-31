"use client";

import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import CategoryListSkeleton from "@/components/skeletons/list/CategoryListSkeleton";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Category } from "@/types/category/category";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { truncateDescription } from "@/utils/truncateDescription";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import { filterSortPaginate } from "@/utils/dataUtils";

type CategoryListProps = {
    onUpdate: (categoryId: string | undefined) => void;
    onClickDetail: (productId: string | undefined) => void;
    onLoading: boolean;
    categories: Category[];
    search: string;
    sortField: keyof Category;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
};

const columns: DataTableColumn[] = [
    { label: "#", key: "no" },
    { label: "Category Name", subtitle: "Name of the Category", key: "name" },
    { label: "Description", subtitle: "Details about the category", key: "desc" },
    { label: "Latest Update", subtitle: "Date of Latest Update", key: "update" },
    { label: "Details", subtitle: "More Info", key: "details" },
    { label: "Actions", subtitle: "Manage Category", key: "actions", align: "right" },
];

export default function CategoryList({
    onUpdate,
    onClickDetail,
    onLoading,
    categories,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
}: CategoryListProps) {
    const {
        pageData: paginatedCategories,
    } = filterSortPaginate(
        categories,
        search,
        ["name", "description"],
        sortField,
        sortOrder,
        currentPage,
        pageSize
    );

    function renderRow(category: Category, index: number) {
        return (
            <tr key={category.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                <td className="px-6 py-4 text-sm text-gray-800">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{truncateDescription(category.description, 100) || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>{category.updatedAt ? formatDate(category.updatedAt) : formatDate(category.createdAt)}</span>
                        <span className="text-xs text-gray-400">{category.updatedAt ? formatTime(category.updatedAt) : formatTime(category.createdAt)}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-left">
                    <button
                        onClick={() => onClickDetail(category.id)}
                        className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 px-3 py-2 rounded mx-2"
                    >
                        <FaInfoCircle />
                    </button>
                </td>
                <td className="px-6 py-4 text-right">
                    <button
                        onClick={() => onUpdate(category.id)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 px-3 py-2 rounded mx-2"
                    >
                        <FaEdit />
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <DataTable<Category>
            columns={columns}
            data={paginatedCategories}
            loading={onLoading}
            skeleton={<CategoryListSkeleton />}
            emptyText="No categories found."
            renderRow={renderRow}
        />
    );
}