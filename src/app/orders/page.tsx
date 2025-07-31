"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order/order";
import OrderList from "./OrderList";
import Pagination from "@/components/ui/table/Pagination";
import { useOrders } from "@/satelite/services/orderService";
import ErrorComponent from "@/components/ui/feedback/Error";
import PreShippingCheckModal from "./modals/PreShippingCheckModal";
import DetailOrderModal from "./modals/DetailOrderModal";
import VerifyPaymentModal from "./modals/VerifyPaymentModal";
import { PaymentStatus } from "@/enum/paymentStatus";
import { OrderStatus } from "@/enum/orderStatus";
import OrderFinalizationModal from "./modals/OrderFinalizationModal";
import AwaitingPaymentModal from "./modals/AwaitingPaymentModal";
import { PaymentMethod } from "@/enum/paymentMethod";
import { OrderSource } from "@/enum/orderSource";
import PageHeader from "@/components/ui/layout/PageHeader";
import SearchSortBar from "@/components/ui/table/SearchSortBar";
import { ORDER_SORT_FIELDS } from "@/lib/constant";

export default function OrderPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Order>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [orderIdDetail, setOrderIdDetail] = useState<string | undefined>("");
    const [orderIdToUpdate, setOrderIdToUpdate] = useState<string | undefined>("");

    const [filterOrderStatus, setOrderStatusFilter] = useState<OrderStatus | "">("");
    const [filterPaymentStatus, setPaymentStatusFilter] = useState<PaymentStatus | "">("");
    const [filterPaymentMethod, setPaymentMethodFilter] = useState<PaymentMethod | "">("");
    const [filterOrderSource, setOrderSourceFilter] = useState<OrderSource | "">("");

    const [orders, setOrders] = useState<Order[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField, sortOrder, pageSize, filterOrderStatus, filterPaymentStatus, filterPaymentMethod, filterOrderSource]);

    const filters = {
        page: currentPage,
        limit: pageSize,
        search,
        sortField,
        sortOrder,
        filterOrderStatus: filterOrderStatus,
        filterPaymentStatus: filterPaymentStatus,
        filterPaymentMethod: filterPaymentMethod,
        filterOrderSource: filterOrderSource
    };

    const { data, isPending, isError, refetch } = useOrders(filters);

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

    const orderStatusFilter = {
        label: "Order Status",
        value: filterOrderStatus,
        options: [
            ...Object.values(OrderStatus).map((status) => ({
                key: status,
                label: status.charAt(0) + status.slice(1).toLowerCase(),
            })),
        ],
        onChange: (val: string) => setOrderStatusFilter(val as OrderStatus | ""),
    };

    const paymentStatusFilter = {
        label: "Payment Status",
        value: filterPaymentStatus,
        options: [
            ...Object.values(PaymentStatus).map((status) => ({
                key: status,
                label: status.charAt(0) + status.slice(1).toLowerCase(),
            })),
        ],
        onChange: (val: string) => setPaymentStatusFilter(val as PaymentStatus | ""),
    };

    const paymentMethodFilter = {
        label: "Payment Method",
        value: filterPaymentMethod,
        options: [
            ...Object.values(PaymentMethod).map((method) => ({
                key: method,
                label: method.charAt(0) + method.slice(1).toLowerCase(),
            })),
        ],
        onChange: (val: string) => setPaymentMethodFilter(val as PaymentMethod | ""),
    };

    const orderSourceFilter = {
        label: "Order Source",
        value: filterOrderSource,
        options: [
            ...Object.values(OrderSource).map((src) => ({
                key: src,
                label: src.charAt(0) + src.slice(1).toLowerCase(),
            })),
        ],
        onChange: (val: string) => setOrderSourceFilter(val as OrderSource | ""),
    };

    if (isError) return <ErrorComponent />;

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Orders"
                    subtitle="Track, update, and manage customer orders efficiently."
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={ORDER_SORT_FIELDS as (keyof Order)[]}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    setPageSize={setPageSize}
                    pageSizes={[5, 10, 15, 20, 50, 100]}
                    filters={[
                        orderStatusFilter,
                        paymentStatusFilter,
                        paymentMethodFilter,
                        orderSourceFilter,
                    ]}
                />

                <OrderList
                    onUpdate={handleUpdateOrder}
                    onClickDetail={handleClickDetail}
                    onLoading={isPending}
                    orders={orders}
                    search={search}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    currentPage={currentPage}
                    pageSize={pageSize}
                />

                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div>

            {/* MODAL */}
            <AwaitingPaymentModal
                isOpen={isModalOpen && paymentStatus === PaymentStatus.UNPAID}
                orderId={orderIdToUpdate}
                onClose={handleOnClickClose}
            />
            <VerifyPaymentModal
                isOpen={isModalOpen && paymentStatus === PaymentStatus.PENDING}
                paymentId={orderIdToUpdate}
                onClose={handleOnClickClose}
                onDone={refetch}
            />
            <PreShippingCheckModal
                isOpen={isModalOpen && paymentStatus === PaymentStatus.CONFIRMED && orderStatus === OrderStatus.PAID}
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
