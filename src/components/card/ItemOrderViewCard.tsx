
import { PriceType } from "@/enum/priceType";
import { DEFAULT_PRODUCT_URL } from "@/lib/constant";
import { ItemsOrder } from "@/types/order/itemsOrder";
import { ProductPriceInput } from "@/types/statistics/productPriceInput";
import { formatCurrency } from "@/utils/formatCurrency";
import { calculateUnitPrice } from "@/utils/productPricing";
import Image from "next/image";
import { FaTrashCan } from "react-icons/fa6";

type ItemOrderViewCardProps = {
    item: ItemsOrder;
};

export default function ItemOrderViewCard({ item }: ItemOrderViewCardProps) {
    const priceType: PriceType =
        item.quantity < (item.product.minQuantityForDiscount || 0)
            ? PriceType.REGULAR
            : PriceType.WHOLESALE;

    const productPriceInput: ProductPriceInput = {
        quantity: item.quantity,
        price: item.product.price,
        discountPercentage: item.product.discountPercentage,
        minQuantityForDiscount: item.product.minQuantityForDiscount,
        bulkDiscountPrice: item.product.bulkDiscountPrice,
    };

    const initalPrice = item.product.price;
    const actualPrice = calculateUnitPrice(productPriceInput)

    const initialSubTotalPrice = Number(item.subtotal);
    const actualSubtotalPrice = Number(item.subtotal);

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
                        src={item.product.imageUrl || DEFAULT_PRODUCT_URL}
                        alt={item.product.name || "Product Image"}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                        {item.product.name ?? "Unnamed Product"}
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{item.quantity} x</span>
                        <div className="flex items-center gap-1">
                            {initalPrice && initalPrice > actualPrice && (
                                <span className="line-through text-red-400 text-xs">
                                    {formatCurrency(initalPrice)}
                                </span>
                            )}
                            <span className="text-gray-800 font-medium">
                                {formatCurrency(actualPrice)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-bold">{tag}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                    >
                        -
                    </button>
                    <span className="text-gray-900 font-semibold">{item.quantity}</span>
                    <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                    >
                        +
                    </button>
                </div>

                {/* Subtotal */}
                <div className="ml-3 w-28 text-center">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <div className="flex flex-col items-center gap-0.5 mt-1">
                        <span className="text-base font-bold text-gray-900">
                            {formatCurrency(actualSubtotalPrice)}
                        </span>
                        {initialSubTotalPrice && initialSubTotalPrice > actualSubtotalPrice && (
                            <span className="text-xs line-through text-red-400">
                                {formatCurrency(initialSubTotalPrice)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delete Icon */}
                <div className="flex flex-col justify-start items-end ml-4">
                    <button
                        className="cursor-pointer text-red-700 hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Hapus produk"
                        type="button"
                        disabled
                    >
                        <FaTrashCan size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
