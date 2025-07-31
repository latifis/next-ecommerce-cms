export type SortOrder = "asc" | "desc";

export function filterData<T>(items: T[], search: string, fields: (keyof T)[]): T[] {
    const lower = search.toLowerCase();
    return items.filter((item) =>
        fields.some((field) =>
            (String(item[field]) ?? "").toLowerCase().includes(lower)
        )
    );
}

export function sortData<T>(items: T[], sortField: keyof T, sortOrder: SortOrder = "asc"): T[] {
    return [...items].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal === bVal) return 0;
        return sortOrder === "asc"
            ? aVal > bVal ? 1 : -1
            : aVal < bVal ? 1 : -1;
    });
}

export function paginateData<T>(items: T[], currentPage: number, pageSize: number) {
    const safePageSize = Math.max(pageSize, 1);
    const maxPage = Math.ceil(items.length / safePageSize) || 1;
    const page = Math.min(Math.max(currentPage, 1), maxPage);
    const start = (page - 1) * safePageSize;
    const end = start + safePageSize;

    return {
        pageData: items.slice(start, end),
        maxPage,
        currentPage: page,
        totalItems: items.length,
    };
}

export function filterSortPaginate<T>(
    data: T[],
    search: string,
    filterKeys: (keyof T)[],
    sortField: keyof T,
    sortOrder: SortOrder,
    currentPage: number,
    pageSize: number
) {
    const filtered = filterData(data, search, filterKeys);
    const sorted = sortData(filtered, sortField, sortOrder);
    return paginateData(sorted, currentPage, pageSize);
}
