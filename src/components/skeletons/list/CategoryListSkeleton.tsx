"use client";

const CategoryListSkeleton = () => {
    return (
        <>
            {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end">
                            <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default CategoryListSkeleton;
