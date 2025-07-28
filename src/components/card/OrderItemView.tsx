import { useState } from "react";
import OrderItemViewCard from "./OrderItemViewCard";
import { OrderItem } from "@/types/order/orderItem";
import { FiChevronDown } from "react-icons/fi";

type Props = {
    orderItems: OrderItem[];
    showLess?: boolean;
};

export default function OrderItemView({ orderItems, showLess = false }: Props) {
    const [showAll, setShowAll] = useState(false);

    const itemsToShow = showLess && !showAll ? orderItems.slice(0, 1) : orderItems;

    return (
        <div className="space-y-4 pr-2">
            {itemsToShow.map((item) => (
                <OrderItemViewCard
                    key={item.id}
                    item={item}
                />
            ))}

            {showLess && !showAll && orderItems.length > 1 && (
                <div className="flex justify-center pt-2">
                    <button
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors
                                   bg-transparent font-bold text-sm px-3 py-1 rounded focus:outline-none"
                        onClick={() => setShowAll(true)}
                        aria-label="See all items"
                    >
                        See All ({orderItems.length - 1})
                        <FiChevronDown className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
}