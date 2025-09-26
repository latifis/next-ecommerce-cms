"use client";

import { SORT_ORDER_ASC, SORT_ORDER_DESC } from "@/lib/constant";
import { Payment } from "@/types/payment/payment";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { FaEdit, FaEye, FaQrcode, FaRegCreditCard } from "react-icons/fa";
import DataTable, { DataTableColumn } from "@/components/ui/table/DataTable";
import { filterSortPaginate } from "@/utils/dataUtils";
import PaymentListSkeleton from "@/components/skeletons/list/PaymentListSkeleton";
import { useState } from "react";
import ShowQrisImageModal from "./modals/ShowQrisImageModal";
import SwitchToggle from "@/components/ui/button/SwitchToggle";
import { ActivityStatus } from "@/enum/activityStatus";
import { useUpdatePaymentRaw } from "@/satelite/services/paymentService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type PaymentListProps = {
    onUpdate: (paymentId: string | undefined) => void;
    onLoading: boolean;
    payments: Payment[];
    search: string;
    sortField: keyof Payment;
    sortOrder: typeof SORT_ORDER_ASC | typeof SORT_ORDER_DESC;
    currentPage: number;
    pageSize: number;
    refetch: () => void;
};

const columns: DataTableColumn[] = [
    { label: "#", key: "no" },
    { label: "Bank Name", key: "bankName", subtitle: "Bank name associated with this account" },
    { label: "Bank Account Number", key: "bankAccountNumber", subtitle: "Unique bank account number" },
    { label: "Account Holder Name", key: "accountHolder", subtitle: "Owner of the bank account" },
    { label: "Payment Type", key: "paymentType", subtitle: "Type of payment method" },
    { label: "Active", key: "isActive", subtitle: "Active status of the payment account" },
    { label: "Date Created", key: "createdAt", subtitle: "Date this account was created" },
    { label: "Latest Update", key: "updatedAt", subtitle: "Date of last update to this account" },
    { label: "Actions", key: "actions", subtitle: "Edit or manage this account", align: "right" },
];

export default function PaymentList({
    onUpdate,
    onLoading,
    payments,
    search,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
    refetch
}: PaymentListProps) {
    const {
        pageData: paginatedPayments,
    } = filterSortPaginate(
        payments,
        search,
        ["bankName", "bankAccountNumber", "accountHolder"],
        sortField,
        sortOrder,
        currentPage,
        pageSize
    );

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedQrisUrl, setSelectedQrisUrl] = useState("");

    const activityStatusOptions = [
        { value: ActivityStatus.INACTIVE, label: "Inactive" },
        { value: ActivityStatus.ACTIVE, label: "Active" },
    ];

    const { mutate: updatePayment, isPending: isPendingUpdate } = useUpdatePaymentRaw();

    const handleToggleStatus = (payment: Payment, newStatus: ActivityStatus) => {
        const updatedPayment = new FormData();
        updatedPayment.append("isActive", String(newStatus === ActivityStatus.ACTIVE));

        updatePayment(
            { paymentId: payment.id, data: updatedPayment },
            {
                onSuccess: () => {
                    toast.success("Payment updated successfully");
                    refetch();
                },
                onError: (error: unknown) => {
                    if (error instanceof AxiosError && error.response?.data?.message) {
                        toast.error("Failed to update payment: " + error.response.data.message);
                    } else {
                        toast.error("Failed to update payment: Unknown error");
                    }
                },
            }
        );
    };

    const handleOpenModal = (paymentId: string | undefined) => {
        const payment = payments.find(p => p.id === paymentId);
        if (payment && payment.qrisMedia?.url) {
            setSelectedQrisUrl(payment.qrisMedia.url);
        } else {
            setSelectedQrisUrl("");
        }
        setIsOpenModal(true);
    };

    function renderRow(payment: Payment, index: number) {
        return (
            <tr key={payment.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}>
                <td className="px-6 py-4 text-sm text-gray-800">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                    {!payment.qrisMedia?.url ? (
                        payment.bankName
                    ) : (
                        "N/A"
                    )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                    {!payment.qrisMedia?.url ? (
                        payment.bankAccountNumber
                    ) : (
                        "N/A"
                    )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                    {!payment.qrisMedia?.url ? (
                        payment.accountHolder
                    ) : (
                        "N/A"
                    )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                        {payment.qrisMedia?.url ? (
                            <>
                                <FaQrcode className="text-xl text-red-600" />
                                <span>QRIS</span>
                            </>
                        ) : (
                            <>
                                <FaRegCreditCard className="text-xl text-green-600" />
                                <span>Bank Account</span>
                            </>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                    <SwitchToggle
                        value={payment.isActive ? ActivityStatus.ACTIVE : ActivityStatus.INACTIVE}
                        options={activityStatusOptions}
                        onChange={(val) => handleToggleStatus(payment, val as ActivityStatus)}
                        isMini={true}
                        disabled={isPendingUpdate || onLoading}
                    />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>{formatDate(payment.createdAt)}</span>
                        <span className="text-xs text-gray-400">{formatTime(payment.createdAt)}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col text-left">
                        <span>{formatDate(payment.updatedAt)}</span>
                        <span className="text-xs text-gray-400">{formatTime(payment.updatedAt)}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-right">
                    {payment.qrisMedia?.url && (
                        <button
                            onClick={() => handleOpenModal(payment.id)}
                            className="bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700 px-3 py-2 rounded mx-2 mb-2"
                        >
                            <FaEye />
                        </button>
                    )}

                    <button
                        onClick={() => onUpdate(payment.id)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 px-3 py-2 rounded mx-2"
                    >
                        <FaEdit />
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <>
            <DataTable<Payment>
                columns={columns}
                data={paginatedPayments}
                loading={onLoading}
                skeleton={<PaymentListSkeleton />}
                emptyText="No Payments found."
                renderRow={renderRow}
            />

            <ShowQrisImageModal
                isOpen={isOpenModal}
                onClose={setIsOpenModal}
                url={selectedQrisUrl}
            />
        </>
    );
}