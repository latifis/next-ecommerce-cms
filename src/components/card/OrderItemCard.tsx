
import { PriceType } from "@/enum/priceType";
import { DEFAULT_PRODUCT_URL } from "@/lib/constant";
import { CartItem } from "@/types/cart/cartItem";
import { ProductPriceInput } from "@/types/statistics/productPriceInput";
import { calculateSubtotalPrice, calculateUnitPrice } from "@/utils/productPricing";
import Image from "next/image";
import { FaTrashCan } from "react-icons/fa6";

type OrderItemCardProps = {
    item: CartItem;
    onDecrease?: (id: string) => void;
    onIncrease?: (id: string) => void;
    onDelete?: (id: string) => void;
};

export default function OrderItemCard({ item, onDecrease, onIncrease, onDelete }: OrderItemCardProps) {
    const priceType: PriceType =
        item.quantity < (item.minQuantityForDiscount || 0)
            ? PriceType.REGULAR
            : PriceType.WHOLESALE;

    const productPriceInput: ProductPriceInput = {
        quantity: item.quantity,
        price: item.price,
        discountPercentage: item.discountPercentage,
        minQuantityForDiscount: item.minQuantityForDiscount,
        bulkDiscountPrice: item.bulkDiscountPrice,
    };

    const initalPrice = item.price;
    const actualPrice = calculateUnitPrice(productPriceInput)

    const initialSubTotalPrice = item.price * item.quantity;
    const actualSubtotalPrice = calculateSubtotalPrice(productPriceInput);

    const getPriceLabel = () => {
        switch (priceType) {
            case PriceType.REGULAR:
                return "Harga Eceran";
            case PriceType.WHOLESALE:
                return "Harga Grosir";
            default:
                return "Harga";
        }
    };

    const tag = getPriceLabel();

    return (
        <div className="relative">
            {/* Main Content with opacity transition */}
            <div className={`group flex items-center gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200 px-8 transition-opacity duration-300 opacity-100`}>
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 shrink-0">
                    <Image
                        src={item.imageUrl || DEFAULT_PRODUCT_URL}
                        alt={item.name || "Product Image"}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                        {item.name ?? "Unnamed Product"}
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{item.quantity} x</span>
                        <div className="flex items-center gap-1">
                            {initalPrice && initalPrice > actualPrice && (
                                <span className="line-through text-red-400 text-xs">
                                    Rp {initalPrice.toLocaleString("id-ID")}
                                </span>
                            )}
                            <span className="text-gray-800 font-medium">
                                Rp {actualPrice.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-bold">{tag}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => item.id && onDecrease?.(item.id)}
                    >
                        -
                    </button>
                    <span className="text-gray-900 font-semibold">{item.quantity}</span>
                    <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => item.id && onIncrease?.(item.id)}
                    >
                        +
                    </button>
                </div>

                {/* Subtotal */}
                <div className="ml-3 w-28 text-center">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <div className="flex flex-col items-center gap-0.5 mt-1">
                        <span className="text-base font-bold text-gray-900">
                            Rp {actualSubtotalPrice.toLocaleString("id-ID")}
                        </span>
                        {initialSubTotalPrice && initialSubTotalPrice > actualSubtotalPrice && (
                            <span className="text-xs line-through text-red-400">
                                Rp {initialSubTotalPrice.toLocaleString("id-ID")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delete Icon */}
                <div className="flex flex-col justify-start items-end ml-4">
                    <button
                        onClick={() => item.id && onDelete?.(item.id)}
                        className="cursor-pointer text-red-700 hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Hapus produk"
                        type="button"
                    >
                        <FaTrashCan size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
