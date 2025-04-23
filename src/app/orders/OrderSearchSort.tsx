"use client";

import { FaSort } from "react-icons/fa";
import { Order } from "@/types/order/order";
import { ORDER_SORT_FIELDS, SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { PaymentMethod } from "@/enum/paymentMethod";
import { PaymentStatus } from "@/enum/paymentStatus";
import { OrderStatus } from "@/enum/orderStatus";

type OrderSearchSortProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    sortField: keyof Order;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    setSortField: React.Dispatch<React.SetStateAction<keyof Order>>;
    setSortOrder: React.Dispatch<React.SetStateAction<typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    orderStatus: OrderStatus | null
    paymentStatus: PaymentStatus | null;
    paymentMethod: PaymentMethod | null;
    setOrderStatus: React.Dispatch<React.SetStateAction<OrderStatus | null>>;
    setPaymentStatus: React.Dispatch<React.SetStateAction<PaymentStatus | null>>;
    setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
};

export default function OrderSearchSort({
    search,
    setSearch,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    setPageSize,
    orderStatus,
    paymentStatus,
    paymentMethod,
    setOrderStatus,
    setPaymentStatus,
    setPaymentMethod,
}: OrderSearchSortProps) {
    const toggleSortOrder = (field: keyof Order) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === SORT_ORDER_ASC ? SORT_ORDER_DESC : SORT_ORDER_ASC));
        } else {
            setSortField(field);
            setSortOrder(SORT_ORDER_ASC);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-wrap gap-4 items-center border border-gray-200">
            <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Sort By:</span>
                {ORDER_SORT_FIELDS.map((field) => (
                    <button
                        key={field}
                        onClick={() => toggleSortOrder(field as keyof Order)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${sortField === field ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                            } hover:bg-blue-200`}
                    >
                        {field === "updatedAt" ? "Latest" : field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortField === field && (
                            <FaSort
                                className={`ml-2 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2 items-center">
                    <span className="text-gray-600 font-medium">Filters:</span>
                    <div className="flex gap-2">
                        <select
                            onChange={(e) => setOrderStatus(e.target.value as null | OrderStatus)}
                            value={orderStatus || ""}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Order Status</option>
                            {Object.keys(OrderStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setPaymentStatus(e.target.value as null | PaymentStatus)}
                            value={paymentStatus || ""}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Payment Status</option>
                            {Object.keys(PaymentStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setPaymentMethod(e.target.value as null | PaymentMethod)}
                            value={paymentMethod || ""}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Payment Method</option>
                            {Object.keys(PaymentMethod).map((method) => (
                                <option key={method} value={method}>
                                    {method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Dropdown for page size */}
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Page Size:</span>
                <select
                    onChange={handlePageSizeChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {[5, 10, 15, 20].map((size) => (
                        <option key={size} value={size}>
                            {size} items
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
