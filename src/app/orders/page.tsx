"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order/order";
import OrderSearchSort from "./OrderSearchSort";
import OrderList from "./OrderList";
import Pagination from "@/components/Pagination";
import { useOrders } from "@/satelite/services/orderService";
import ErrorComponent from "@/components/Error";
import PreShippingCheckModal from "./modals/PreShippingCheckModal";
import DetailOrderModal from "./modals/DetailOrderModal";
import VerifyPaymentModal from "./modals/VerifyPaymentModal";
import { PaymentStatus } from "@/enum/paymentStatus";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFinalizationModal from "./modals/OrderFinalizationModal";
import AwaitingPaymentModal from "./modals/AwaitingPaymentModal";
import { PaymentMethod } from "@/enum/paymentMethod";

export default function OrderPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Order>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [orderIdDetail, setOrderIdDetail] = useState<string | undefined>("");
    const [orderIdToUpdate, setOrderIdToUpdate] = useState<string | undefined>("");
    
    const [filterOrderStatus, setOrderStatusFilter] = useState<OrderStatus | null>(null);
    const [filterPaymentStatus, setPaymentStatusFilter] = useState<PaymentStatus | null>(null);
    const [filterPaymentMethod, setPaymentMethodFilter] = useState<PaymentMethod | null>(null);

    const [orders, setOrders] = useState<Order[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField, sortOrder, pageSize, filterOrderStatus, filterPaymentStatus, filterPaymentMethod]);

    const filters = {
        page: currentPage,
        limit: pageSize,
        search,
        sortField,
        sortOrder,
        filterOrderStatus: filterOrderStatus,
        filterPaymentStatus: filterPaymentStatus,
        filterPaymentMethod: filterPaymentMethod,
    };

    const { data, isLoading, isError, refetch } = useOrders(filters);

    useEffect(() => {
        if (data) {
            setOrders(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    const handleClickDetail = (orderId: string | undefined) => {
        setIsModalDetailOpen(true);
        setOrderIdDetail(orderId);
    };

    const handleUpdateOrder = (orderId: string | undefined, paymentStatus: PaymentStatus, orderStatus: OrderStatus) => {
        setPaymentStatus(paymentStatus);
        setOrderStatus(orderStatus);
        setIsModalOpen(true);
        setOrderIdToUpdate(orderId);
    };

    const handleOnClickClose = () => {
        setIsModalOpen(false);
        setIsModalDetailOpen(false);
    }

    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 bg-gray-50 min-h-screen space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
                </div>

                {/* Search and Sort */}
                <OrderSearchSort
                    search={search}
                    setSearch={setSearch}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    setPageSize={setPageSize}
                    orderStatus={filterOrderStatus}
                    paymentStatus={filterPaymentStatus}
                    paymentMethod={filterPaymentMethod}
                    setOrderStatus={setOrderStatusFilter}
                    setPaymentStatus={setPaymentStatusFilter}
                    setPaymentMethod={setPaymentMethodFilter}
                />

                {/* Order Table */}
                <OrderList
                    onUpdate={handleUpdateOrder}
                    onClickDetail={handleClickDetail}
                    onLoading={isLoading}
                    orders={orders}
                    search={search}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    currentPage={currentPage}
                    pageSize={pageSize}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div>

            <AwaitingPaymentModal
                isOpen={isModalOpen && paymentStatus === PaymentStatus.UNPAID}
                paymentId={orderIdToUpdate}
                onClose={handleOnClickClose}
            />

            <VerifyPaymentModal
                isOpen={isModalOpen && paymentStatus === PaymentStatus.PENDING}
                paymentId={orderIdToUpdate}
                onClose={handleOnClickClose}
                onDone={refetch}
            />

            <PreShippingCheckModal
                isOpen={isModalOpen && paymentStatus === PaymentStatus.CONFIRMED}
                orderIdToUpdate={orderIdToUpdate}
                onClose={handleOnClickClose}
                onDone={refetch}
            />

            <OrderFinalizationModal
                isOpen={isModalOpen && orderStatus === OrderStatus.SHIPPED}
                orderIdToUpdate={orderIdToUpdate}
                onClose={handleOnClickClose}
                onDone={refetch}
            />

            <DetailOrderModal
                isOpen={isModalDetailOpen}
                orderId={orderIdDetail}
                onClose={handleOnClickClose}
            />
        </>
    );
}
