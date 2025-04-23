"use client";

type PaginationProps = {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    pageSize: number;
};

export default function Pagination({
    currentPage,
    setCurrentPage,
    totalItems,
    pageSize,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalItems === 0) return null;

    const getPageRange = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [1, 2, 3];
        } else if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        } else if (currentPage === 2) {
            return [1, 2, 3];
        } else if (currentPage === totalPages - 1) {
            return [totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [currentPage - 1, currentPage, currentPage + 1];
        }
    };

    const pageRange = getPageRange();

    return (
        <div className="flex justify-center items-center mt-4 space-x-2">
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-semibold ${currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-200"}`}
            >
                <span className="text-lg">&lt;</span>
            </button>

            {pageRange.map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium border-2 ${currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-600"}`}
                >
                    {page}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-semibold ${currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-200"}`}
            >
                <span className="text-lg">&gt;</span>
            </button>
        </div>
    );
}
