import React from "react";
import { FaSort } from "react-icons/fa";

interface FilterProps {
    label: string;
    value: string | number | undefined;
    options: { key: string; label: string }[];
    onChange: (val: string) => void;
}

interface SearchSortBarProps<TField extends string = string> {
    search: string;
    setSearch: (val: string) => void;
    sortFields: TField[];
    sortField: TField;
    sortOrder: "asc" | "desc";
    setSortField: React.Dispatch<React.SetStateAction<TField>>;
    setSortOrder: (order: "asc" | "desc") => void;
    pageSizes: number[];
    setPageSize: (size: number) => void;
    filters?: FilterProps[];
}

export default function SearchSortBar<TField extends string>({
    search,
    setSearch,
    sortFields,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    pageSizes,
    setPageSize,
    filters = [],
}: SearchSortBarProps<TField>) {
    const toggleSortOrder = (field: TField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-wrap gap-4 items-center border border-gray-200">
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Sort By:</span>
                {sortFields.map(field => (
                    <button
                        key={field}
                        onClick={() => toggleSortOrder(field)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${sortField === field ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                            } hover:bg-blue-200`}
                    >
                        {field === "updatedAt" ? "Latest" : field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortField === field && (
                            <FaSort
                                className={`ml-2 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>
                ))}
            </div>
            {filters.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-gray-600 font-medium">Filters:</span>
                    <div className="flex gap-2">
                        {filters.map((f, idx) => (
                            <select
                                key={idx}
                                value={f.value || ""}
                                onChange={e => f.onChange(e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">{`All ${f.label}`}</option>
                                {f.options.map(opt => (
                                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Page Size:</span>
                <select
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {pageSizes.map(size => (
                        <option key={size} value={size}>{`${size} items`}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}