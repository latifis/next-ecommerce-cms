import ItemOrderViewCard from "./ItemOrderViewCard";
import { ItemsOrder } from "@/types/order/itemsOrder";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type Props = {
    itemsOrder: ItemsOrder[];
    showLess?: boolean;
};

export default function ItemOrderView({ itemsOrder, showLess = false }: Props) {
    const [showAll, setShowAll] = useState(false);

    const itemsToShow = showLess && !showAll ? itemsOrder.slice(0, 1) : itemsOrder;

    return (
        <div className="space-y-4 pr-2">
            {itemsToShow.map((item) => (
                <ItemOrderViewCard
                    key={item.id}
                    item={item}
                />
            ))}

            {showLess && !showAll && itemsOrder.length > 1 && (
                <div className="flex justify-center pt-2">
                    <button
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors
                                   bg-transparent font-bold text-sm px-3 py-1 rounded focus:outline-none"
                        onClick={() => setShowAll(true)}
                        aria-label="See all items"
                    >
                        See All ({itemsOrder.length - 1})
                        <FiChevronDown className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
}