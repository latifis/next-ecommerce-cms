"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import RecentOrdersSkeleton from "@/components/skeletons/dashboard/RecentOrdersSkeleton";
import { OrderStatus } from "@/enum/orderStatus";
import { useOrders } from "@/satelite/services/orderService";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { capitalizeWords } from "@/utils/stringUtils";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import PageHeader from "@/components/ui/layout/PageHeader";
import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import { Order } from "@/types/order/order";

export default function RecentOrders() {
    const router = useRouter();

    const { data: order, isPending, isError } = useOrders({
        sortField: "updatedAt",
        limit: 5,
    });

    const handleClick = () => {
        router.push("/orders");
    };

    if (isError) return <ErrorComponent />;
    if (isPending) return <RecentOrdersSkeleton />;

    const columns: DataTableColumn[] = [
        {
            label: "Order ID",
            key: "orderId",
            subtitle: "Unique identifier of the Order",
        },
        {
            label: "Customer",
            key: "customer",
            subtitle: "Name of The Customer",
        },
        {
            label: "Order Status",
            key: "orderStatus",
            subtitle: "Current status of the Order",
        },
        {
            label: "Latest Update",
            key: "latestUpdate",
            subtitle: "Date of Latest Update",
        },
        {
            label: "Total Price",
            key: "totalPrice",
            subtitle: "Total cost of the Order",
            align: "right",
        },
    ];

    const renderOrderRow = (order: Order, index: number) => (
        <tr
            key={order.id}
            className={`
                hover:bg-blue-50 
                ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                border-t
                ${order.orderStatus === OrderStatus.COMPLETED
                    ? "text-gray-400 italic"
                    : order.orderStatus === OrderStatus.CANCELLED
                        ? "text-red-400 line-through italic"
                        : "text-gray-800"
                }
            `}
        >
            <td className="px-6 py-4 text-sm font-medium">
                {order.orderId || "N/A"}
            </td>
            <td className="px-6 py-4 text-sm">
                {order.user?.name || "N/A"}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{order.orderStatus || "N/A"}</span>
                    <span className="text-gray-500 text-xs">
                        ({order.paymentStatus
                            ? capitalizeWords(order.paymentStatus)
                            : "N/A"} payment)
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm">
                <div className="flex flex-col text-left">
                    <span>
                        {order.updatedAt
                            ? formatDate(order.updatedAt)
                            : formatDate(order.createdAt)}
                    </span>
                    <span className="text-xs">
                        {order.updatedAt
                            ? formatTime(order.updatedAt)
                            : formatTime(order.createdAt)}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-right">
                {order.totalPrice ? parseInt(order.totalPrice).toLocaleString('id-ID') : "N/A"}
            </td>
        </tr>
    );

    return (
        <>
            <PageHeader
                title="Recent Orders"
                subtitle="A quick overview of the latest orders in your system."
                className="mb-6 mx-2"
                actionElement={
                    <button
                        className="flex items-center text-blue-600 font-medium text-sm group hover:text-blue-700 transition-all duration-300 ease-in-out"
                        onClick={handleClick}
                    >
                        <span className="mr-2">See All</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 ease-in-out" />
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={order?.data.data || []}
                loading={false}
                emptyText="No orders found."
                renderRow={renderOrderRow}
            />
        </>
    );
}