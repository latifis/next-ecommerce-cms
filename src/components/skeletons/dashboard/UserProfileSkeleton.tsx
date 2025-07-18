import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UserProfileSkeleton() {
    return (
        <div className="flex justify-between w-full items-center">
            <div className="flex flex-col text-left space-y-2">
                <Skeleton width={100} height={16} />
                <Skeleton width={60} height={12} />
            </div>
            <Skeleton circle width={32} height={32} />
        </div>
    );
}
