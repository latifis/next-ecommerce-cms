import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductItemCardSkeleton() {
    return (
        <>
            <div className="flex flex-col gap-y-3">
                {[1, 2, 3, 4].map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl shadow-sm p-4 w-full">
                        {/* Kiri: Gambar + Nama + Kode */}
                        <div className="flex items-center gap-4 min-w-[220px]">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Skeleton width={56} height={56} borderRadius={8} />
                            </div>
                            <div className="flex flex-col gap-1 w-[120px]">
                                <Skeleton height={16} />
                                <Skeleton height={12} width={80} />
                            </div>
                        </div>

                        {/* Tengah: Harga-harga */}
                        <div className="flex flex-col flex-1 items-center">
                            <div className="flex gap-8">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex flex-col items-start gap-[2px]">
                                        <Skeleton height={12} width={60} />
                                        <Skeleton height={16} width={80} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kanan: Stock */}
                        <div className="flex items-center">
                            <Skeleton height={24} width={80} borderRadius={999} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
