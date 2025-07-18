import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function RecentOrdersSkeleton() {
    return (
        <>
            <div className="flex justify-between items-center mb-6 mx-2">
                <div>
                    <Skeleton height={28} width={200} />
                    <Skeleton height={16} width={250} />
                </div>
                <Skeleton height={32} width={100} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <th key={i} className="px-6 py-4 text-left">
                                    <Skeleton width={100} height={14} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {Array.from({ length: 5 }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        <Skeleton width="100%" height={16} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
