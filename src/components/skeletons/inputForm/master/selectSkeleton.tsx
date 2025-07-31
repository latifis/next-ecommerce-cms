import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonSelect() {
    return (
        <div>
            <Skeleton width={120} height={18} style={{ marginBottom: 8 }} />
            <Skeleton height={48} style={{ borderRadius: 12 }} />
        </div>
    );
}