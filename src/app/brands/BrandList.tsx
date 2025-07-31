import { FaEdit, FaInfoCircle } from "react-icons/fa";
import BrandListSkeleton from "@/components/skeletons/list/BrandListSkeleton";
import { Brand } from "@/types/brand/brand";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { truncateDescription } from "@/utils/truncateDescription";
import { SORT_ORDER_ASC } from "@/lib/constant";
import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import { filterSortPaginate } from "@/utils/dataUtils";

type BrandListProps = {
    onUpdate: (brandId: string | undefined) => void;
    onClickDetail: (productId: string | undefined) => void;
    onLoading: boolean;
    brands: Brand[];
    search: string;
    sortField: keyof Brand;
    sortOrder: typeof SORT_ORDER_ASC | "desc";
    currentPage: number;
    pageSize: number;
};

const columns: DataTableColumn[] = [
    { label: "#", key: "no" },
    { label: "Brand Name", key: "name", subtitle: "Name of the Brand" },
    { label: "Description", key: "description", subtitle: "Details about the brand" },
    { label: "Latest Update", key: "latestUpdate", subtitle: "Date of Latest Update" },
    { label: "Details", key: "details", subtitle: "More Info" },
    { label: "Actions", key: "actions", subtitle: "Manage Brand", align: "right" },
];

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
    const {
        pageData: paginatedBrands,
    } = filterSortPaginate(
        brands,
        search,
        ["name", "description"],
        sortField,
        sortOrder,
        currentPage,
        pageSize
    );

    function renderRow(brand: Brand, index: number) {
        return (
            <tr key={brand.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                <td className="px-6 py-4 text-sm text-gray-800">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{brand.name || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{truncateDescription(brand.description, 100) || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>{brand.updatedAt ? formatDate(brand.updatedAt) : formatDate(brand.createdAt)}</span>
                        <span className="text-xs text-gray-400">{brand.updatedAt ? formatTime(brand.updatedAt) : formatTime(brand.createdAt)}</span>
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
                </td>
            </tr>
        );
    }

    return (
        <DataTable<Brand>
            columns={columns}
            data={paginatedBrands}
            loading={onLoading}
            skeleton={<BrandListSkeleton />}
            emptyText="No brands found."
            renderRow={renderRow}
        />
    );
}