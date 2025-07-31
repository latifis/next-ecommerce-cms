import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonFileUpload() {
    return (
        <div>
            <Skeleton width={120} height={18} style={{ marginBottom: 8 }} />
            <Skeleton height={192} style={{ borderRadius: 16, marginBottom: 12 }} />
        </div>
    );
}