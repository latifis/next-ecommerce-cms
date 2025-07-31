import React from "react";

export type DataTableColumn = {
    label: string;
    key: string;
    subtitle?: string;
    align?: "left" | "right";
};

export type DataTableProps<T> = {
    columns: DataTableColumn[];
    data: T[];
    loading?: boolean;
    skeleton?: React.ReactNode;
    emptyText?: string;
    renderRow: (item: T, index: number) => React.ReactNode;
};

const DataTable = <T,>({
    columns,
    data,
    loading = false,
    skeleton,
    emptyText = "No data found.",
    renderRow,
}: DataTableProps<T>) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={col.key || idx}
                                className={`px-6 py-4 text-sm font-bold text-gray-600 ${col.align === "right" ? "text-right" : "text-left"}`}
                            >
                                {col.label}
                                {col.subtitle && (
                                    <span className="block text-xs text-gray-400">{col.subtitle}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        skeleton
                    ) : data.length > 0 ? (
                        data.map((item, idx) => renderRow(item, idx))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                {emptyText}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;