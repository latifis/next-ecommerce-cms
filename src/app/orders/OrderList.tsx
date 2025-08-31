"use client";

import OrderListSkeleton from "@/components/skeletons/list/OrderListSkeleton";
import { OrderStatus } from "@/enum/orderStatus";
import { PaymentStatus } from "@/enum/paymentStatus";
import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Order } from "@/types/order/order";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { capitalizeWords } from "@/utils/stringUtils";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

type OrderListProps = {
    onUpdate: (orderId: string | undefined, paymentStatus: PaymentStatus, orderStatus: OrderStatus) => void;
    onClickDetail: (productId: string | undefined) => void;
    onLoading: boolean;
    orders: Order[];
    search: string;
    sortField: keyof Order;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
};

export default function OrderList({
    onUpdate,
    onClickDetail,
    onLoading,
    orders,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
}: OrderListProps) {
    const filteredOrders = orders.filter((order) =>
        (order.user?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (order.orderId?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const sortedOrders = filteredOrders.sort((a, b) => {
        const valueA = a[sortField] || "";
        const valueB = b[sortField] || "";

        if (valueA === valueB) return 0;
        if (sortOrder === SORT_ORDER_ASC) return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
    });

    const validCurrentPage = currentPage > 0 ? currentPage : 1;
    const validPageSize = pageSize > 0 ? pageSize : 10;

    const maxPage = Math.ceil(sortedOrders.length / validPageSize);
    const finalPage = Math.min(validCurrentPage, maxPage);

    const startIndex = (finalPage - 1) * validPageSize;
    const endIndex = finalPage * validPageSize;

    const paginatedOrders = sortedOrders.slice(
        Math.max(0, startIndex),
        Math.min(sortedOrders.length, endIndex)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">#</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Order ID
                            <span className="block text-xs text-gray-400">Unique identifier of the Order</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Customer
                            <span className="block text-xs text-gray-400">Name of The Customer</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Order Status
                            <span className="block text-xs text-gray-400">Current status of the Order</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Total Price
                            <span className="block text-xs text-gray-400">Total cost of the Order</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Latest Update
                            <span className="block text-xs text-gray-400">Date of Latest Update</span>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                            Details
                            <span className="block text-xs text-gray-400">More Info</span>
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                            Actions
                            <span className="block text-xs text-gray-400">Manage Order</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {onLoading ? (
                        <OrderListSkeleton />
                    ) : paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order, index) => (
                            <tr
                                key={order.id}
                                className={`
                                    hover:bg-blue-50 
                                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                                    border-t
                                    ${order.orderStatus === OrderStatus.COMPLETED
                                        ? "text-gray-400 italic"
                                        : order.orderStatus === OrderStatus.CANCELLED
                                            ? "text-red-400 italic"
                                            : "text-gray-800"
                                    }
                                `}
                            >
                                <td className={`px-6 py-4 text-sm`}>
                                    {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium`}>
                                    {order.orderId || "N/A"}
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium`}>
                                    {order.user?.name || "N/A"}
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium`}>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-sm">{order.orderStatus || "N/A"}</span>
                                        <span className="text-gray-500 text-xs">
                                            ({order.paymentStatus
                                                ? capitalizeWords(order.paymentStatus)
                                                : "N/A"} payment)
                                        </span>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium`}>
                                    {order.totalPrice ? parseInt(order.totalPrice).toLocaleString('id-ID') : "N/A"}
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium`}>
                                    <div className="flex flex-col text-left">
                                        <span>
                                            {order.updatedAt
                                                ? formatDate(order.updatedAt)
                                                : formatDate(order.createdAt)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {order.updatedAt
                                                ? formatTime(order.updatedAt)
                                                : formatTime(order.createdAt)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <button
                                        onClick={() => onClickDetail(order.id)}
                                        className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 px-3 py-2 rounded mx-2"
                                    >
                                        <FaInfoCircle />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onUpdate(order.id, order.paymentStatus as PaymentStatus, order.orderStatus as OrderStatus)}
                                        className={`px-3 py-2 rounded mx-2 ${order.orderStatus === OrderStatus.COMPLETED || order.orderStatus === OrderStatus.CANCELLED
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"}`}
                                        disabled={order.orderStatus === OrderStatus.COMPLETED || order.orderStatus === OrderStatus.CANCELLED}
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
