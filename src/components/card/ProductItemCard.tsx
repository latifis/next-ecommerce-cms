import { DEFAULT_PRODUCT_URL } from "@/lib/constant";
import { Product } from "@/types/product/product";
import Image from "next/image";

type ProductItemCardProps = {
    item: Product;
};

export default function ProductItemCard({ item }: ProductItemCardProps) {
    const discount =
        item.discountPercentage > 0
            ? Math.round(item.price - item.price * (item.discountPercentage / 100))
            : null;

    return (
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all p-4 w-full">
            {/* Kiri: Gambar + Nama + Kode */}
            <div className="flex items-center gap-4 min-w-[220px]">
                <div className="w-14 h-14 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Image
                        src={item.imageUrl || DEFAULT_PRODUCT_URL}
                        alt={item.name || "Product Image"}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-base truncate">{item.name}</span>
                    <span className="text-xs text-gray-400 mt-[2px] italic">
                        {item.code}
                    </span>
                </div>
            </div>

            {/* Tengah: Harga-harga */}
            <div className="flex flex-col flex-1 items-center">
                <div className="flex gap-8">
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-400">Normal Price</span>
                        <span className="text-sm font-semibold text-gray-800">
                            Rp {item.price.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-400">Bulk Price</span>
                        <span className="text-sm font-semibold text-blue-600">
                            Rp {item.bulkDiscountPrice?.toLocaleString() || "-"}
                        </span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-400">Discount Price</span>
                        <span className="text-sm font-semibold text-green-600">
                            {discount !== null ? `Rp ${discount.toLocaleString()}` : "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Kanan: Stock */}
            <div className="flex items-center">
                <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm
                        ${item.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}
                >
                    Stock: {item.stock}
                </span>
            </div>
        </div>
    );
}
