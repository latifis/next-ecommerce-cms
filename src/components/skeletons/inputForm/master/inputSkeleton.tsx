import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonInput({ type = "input" }) {
    return (
        <div>
            <Skeleton width={120} height={18} style={{ marginBottom: 8 }} />
            {type === "textarea" ? (
                <Skeleton height={90} style={{ marginTop: 8, borderRadius: 12 }} />
            ) : (
                <Skeleton height={48} style={{ marginTop: 8, borderRadius: 12 }} />
            )}
        </div>
    );
}