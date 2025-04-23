import { BANNER_SORT_FIELDS, SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Banner } from "@/types/banner/banner";
import { FaSort } from "react-icons/fa";

type BannerSearchSortProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    sortField: keyof Banner;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    setSortField: React.Dispatch<React.SetStateAction<keyof Banner>>;
    setSortOrder: React.Dispatch<React.SetStateAction<typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

export default function BannerSearchSort({
    search,
    setSearch,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    setPageSize,
}: BannerSearchSortProps) {
    const toggleSortOrder = (field: keyof Banner) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === SORT_ORDER_ASC ? SORT_ORDER_DESC : SORT_ORDER_ASC));
        } else {
            setSortField(field);
            setSortOrder(SORT_ORDER_ASC);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-wrap gap-4 items-center border border-gray-200">
            <input
                type="text"
                placeholder="Search banners by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Sort By:</span>
                {BANNER_SORT_FIELDS.map((field) => (
                    <button
                        key={field}
                        onClick={() => toggleSortOrder(field as keyof Banner)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${sortField === field
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                            } hover:bg-blue-200`}
                    >
                        {field === "updatedAt"
                            ? "Latest"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortField === field && (
                            <FaSort
                                className={`ml-2 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>
                ))}
            </div>
            {/* Dropdown for page size */}
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Page Size:</span>
                <select
                    onChange={handlePageSizeChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {[5, 10, 15, 20].map((size) => (
                        <option key={size} value={size}>
                            {size} items
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}