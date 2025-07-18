import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SalesChartSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 mx-2">
            <div className="grid gap-4 w-full">
                <div>
                    <Skeleton height={32} width={200} />
                    <Skeleton height={16} width="80%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <Skeleton height={24} width={160} className="mb-4" />
                        <Skeleton height={500} />
                    </div>
                    <div className="col-span-1 bg-white rounded-lg shadow p-4">
                        <Skeleton height={24} width={160} className="mb-4" />
                        <Skeleton height={500} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-4">
                            <Skeleton height={24} width={200} className="mb-4" />
                            <Skeleton height={300} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
