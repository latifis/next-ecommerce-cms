"use client"

import ErrorComponent from "@/components/ui/feedback/Error";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";
import { usePaymentById, useUpdatePayment } from "@/satelite/services/paymentService";
import FormPaymentSkeleton from "@/components/skeletons/inputForm/formPaymentSkeleton";
import { PaymentMethod } from "@/enum/paymentMethod";
import SwitchToggle from "@/components/ui/button/SwitchToggle";

type UpdatePaymentModalProps = {
    paymentIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdatePaymentModal({
    paymentIdToUpdate,
    isOpen,
    onClose,
    onDone
}: UpdatePaymentModalProps) {
    const [paymentType, setPaymentType] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
    const [bankName, setBankName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");

    const { mutate: updatePayment, isPending: isPendingUpdate } = useUpdatePayment(paymentIdToUpdate);
    const { data: payment, isPending, isError } = usePaymentById(paymentIdToUpdate);

    const paymentTypeOptions = [
        { value: PaymentMethod.BANK_TRANSFER, label: "Bank Account" },
        { value: PaymentMethod.QRIS, label: "QRIS" },
    ];

    const handleClose = () => {
        resetValue();
        onClose(false);
    }

    const resetValue = () => {
        setBankName("");
        setBankAccountNumber("");
        setAccountHolderName("");
        setImageFile(null);
        setPaymentType(PaymentMethod.BANK_TRANSFER);
    }

    useEffect(() => {
        if (isOpen && payment) {
            setBankName(payment.data.bankName || "");
            setBankAccountNumber(payment.data.bankAccountNumber || "");
            setAccountHolderName(payment.data.accountHolder || "");
            setImageUrl(payment.data.qrisMedia?.url || "");
            setPaymentType(payment.data.qrisMedia?.url ? PaymentMethod.QRIS : PaymentMethod.BANK_TRANSFER);
            console.log("payment", payment);
            console.log("image url", payment.data.qrisMedia?.url);
            console.log("is QRIS?", payment.data.qrisMedia?.url ? PaymentMethod.QRIS : PaymentMethod.BANK_TRANSFER);
        }
    }, [isOpen, payment]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentType === PaymentMethod.BANK_TRANSFER) {
            if (!bankName || !bankAccountNumber || !accountHolderName) {
                toast.error("Please fill all Bank Account fields");
                return;
            }
        } else {
            if (!imageFile) {
                toast.error("Please upload QRIS image");
                return;
            }
        }

        const updatedPayment = new FormData();

        if (paymentType) {
            if (paymentType === PaymentMethod.BANK_TRANSFER) {
                updatedPayment.append("bankName", bankName);
                updatedPayment.append("bankAccountNumber", bankAccountNumber);
                updatedPayment.append("accountHolderName", accountHolderName);
            }
            if (paymentType === "QRIS" && imageFile) {
                updatedPayment.append("file", imageFile);
            }

            updatePayment(updatedPayment, {
                onSuccess: () => {
                    toast.success("Payment updated successfully");
                    onDone();
                    resetValue();
                    onClose(false);
                },
                onError: (error: unknown) => {
                    if (error instanceof AxiosError) {
                        if (error.response?.data?.message) {
                            toast.error("Failed to update brand: " + error.response.data.message);
                        }
                    } else {
                        toast.error("Failed to update brand: Unknown error");
                    }
                }
            })
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUrl(undefined);
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Update Payment</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <FormPaymentSkeleton />
                ) : (
                    <>
                        <div className="flex justify-end">
                            <SwitchToggle
                                value={paymentType}
                                options={paymentTypeOptions}
                                onChange={val => setPaymentType(val as PaymentMethod)}
                                className="ml-4"
                                disabled={true}
                            />
                        </div>
                        {/* Bank Account Fields */}
                        {paymentType === PaymentMethod.BANK_TRANSFER && (
                            <>
                                <FormField
                                    label="Bank Name"
                                    id="bankName"
                                    value={bankName}
                                    onChange={e => setBankName(e.target.value)}
                                    placeholder="Enter bank name"
                                    required
                                    disabled={isPendingUpdate || isPending}
                                />

                                <FormField
                                    label="Bank Account Number"
                                    id="bankAccountNumber"
                                    value={bankAccountNumber}
                                    onChange={e => setBankAccountNumber(e.target.value)}
                                    placeholder="Enter bank account number"
                                    required
                                    disabled={isPendingUpdate || isPending}
                                />

                                <FormField
                                    label="Account Holder Name"
                                    id="accountHolderName"
                                    value={accountHolderName}
                                    onChange={e => setAccountHolderName(e.target.value)}
                                    placeholder="Enter account holder name"
                                    required
                                    disabled={isPendingUpdate || isPending}
                                />
                            </>
                        )}

                        {paymentType === "QRIS" && (
                            <FormFileUpload
                                label="Payment Image"
                                file={imageFile}
                                setFile={setImageFile}
                                url={imageUrl}
                                onRemoveUrl={handleRemoveImage}
                                maxSize={200_000}
                                disabled={isPendingUpdate || isPending}
                                required
                            />
                        )}
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleSave}
                    loading={isPendingUpdate}
                    disabled={isPendingUpdate}
                    variant="primary"
                    icon={!isPendingUpdate ? undefined : <FaSpinner className="animate-spin" />}
                >
                    {isPendingUpdate ? "Updating" : "Update"}
                </Button>

                <Button
                    onClick={handleClose}
                    variant="secondary"
                >
                    Cancel
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    );
}