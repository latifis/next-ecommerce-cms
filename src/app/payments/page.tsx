"use client"

import { Payment } from "@/types/payment/payment";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import PaymentList from "./PaymentList";
import Pagination from "@/components/ui/table/Pagination";
import ErrorComponent from "@/components/ui/feedback/Error";
import AddPaymentModal from "./modals/AddPaymentModal";
import UpdatePaymentModal from "./modals/UpdatePaymentModal";
import PageHeader from "@/components/ui/layout/PageHeader";
import { PAYMENT_SORT_FIELDS } from "@/lib/constant";
import SearchSortBar from "@/components/ui/table/SearchSortBar";
import { usePayment } from "@/satelite/services/paymentService";
import { PaymentMethod } from "@/enum/paymentMethod";

export default function PaymentPage() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Payment>("bankName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [paymentIdToUpdate, setPaymentIdToUpdate] = useState<string | undefined>("");

    const [filterPaymentType, setFilterPaymentType] = useState<PaymentMethod | "">("");

    const [payments, setPayments] = useState<Payment[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const filters = {
        page: currentPage,
        limit: pageSize,
        filterPaymentType: filterPaymentType,
        search,
        sortField,
        sortOrder,
    };

    const { data, isLoading, isError, refetch } = usePayment(filters);
    
    useEffect(() => {
        if (data) {
            setPayments(data.data.data || []);
            setTotalItems(data.data.meta.totalItems || 0);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField, sortOrder, pageSize]);

    const handleAddPayment = () => {
        setIsModalAddOpen(true);
    }

    const handleUpdatePayment = (paymentId: string | undefined) => {
        setPaymentIdToUpdate(paymentId);
        setIsModalUpdateOpen(true);
    }

    const paymentTypeFilter = {
        label: "Payment Type",
        value: filterPaymentType,
        options: Object.values(PaymentMethod)
            .filter(type => type !== PaymentMethod.COD)
            .map(type => ({
                key: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
            })),
        onChange: (val: string) => setFilterPaymentType(val as PaymentMethod | ""),
    };

    if (isError) return <ErrorComponent />

    return (
        <>
            <div className="p-8 min-h-screen space-y-8">
                <PageHeader
                    title="Manage Payment"
                    subtitle="Create and update promotional payments to boost visibility and sales."
                    actionLabel="Add Payment"
                    onAction={handleAddPayment}
                    actionIcon={<FaPlus />}
                />

                <SearchSortBar
                    search={search}
                    setSearch={setSearch}
                    sortFields={PAYMENT_SORT_FIELDS}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    pageSizes={[5, 10, 15, 20]}
                    setPageSize={setPageSize}
                    filters={[paymentTypeFilter]}
                />

                <PaymentList
                    onUpdate={handleUpdatePayment}
                    onLoading={isLoading}
                    payments={payments}
                    search={search}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    refetch={refetch}
                />

                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    pageSize={pageSize}
                />
            </div>

            <AddPaymentModal
                isOpen={isModalAddOpen}
                onClose={() => setIsModalAddOpen(false)}
                onDone={refetch}
            />

            <UpdatePaymentModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                onDone={refetch}
                paymentIdToUpdate={paymentIdToUpdate}
            />
        </>
    )
}