"use client"

import ErrorComponent from "@/components/Error";
import RecentOrdersSkeleton from "@/components/skeletons/dashboard/RecentOrdersSkeleton";
import { useOrders } from "@/satelite/services/orderService";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { capitalizeWords } from "@/utils/stringUtils";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

export default function RecentOrders() {
    const router = useRouter();

    const { data: order, isPending, isError } = useOrders({
        sortField: "updatedAt"
    });

    const handleClick = () => {
        router.push("/orders");
    };

    if (isError) return <ErrorComponent />;

    if (isPending) return <RecentOrdersSkeleton />;

    return (
        <>
            <div className="flex justify-between items-center mb-6 mx-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Recent Orders</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        A quick overview of the latest orders in your system.
                    </p>
                </div>
                <button
                    className="flex items-center text-blue-600 font-medium text-sm group hover:text-blue-700 transition-all duration-300 ease-in-out"
                    onClick={handleClick}
                >
                    <span className="mr-2">See All</span>
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 ease-in-out" />
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
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
                                <span className="block text-xs font-normal text-gray-400">Current status of the Order</span>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">
                                Latest Update
                                <span className="block text-xs text-gray-400">Date of Latest Update</span>
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">
                                Total Price
                                <span className="block text-xs text-gray-400">Total cost of the Order</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.data.data && order.data.data.length > 0 ? (
                            order?.data.data.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {order.orderId || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {order.user?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-sm">{order.orderStatus || "N/A"}</span>
                                            <span className="text-gray-500 text-xs">
                                                ({order.paymentStatus
                                                    ? capitalizeWords(order.paymentStatus)
                                                    : "N/A"} payment)
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
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
                                    <td className="px-6 py-4 text-sm text-gray-700 text-right">
                                        {order.totalPrice ? parseInt(order.totalPrice).toLocaleString('id-ID') : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
