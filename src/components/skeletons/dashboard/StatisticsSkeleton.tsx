import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StatisticsSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="mr-4">
                        <Skeleton circle width={40} height={40} />
                    </div>
                    <div className="flex flex-col flex-1 space-y-2">
                        <Skeleton width="60%" height={12} />
                        <Skeleton width="80%" height={24} />
                    </div>
                </div>
            ))}
        </>
    );
}
