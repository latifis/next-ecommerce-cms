"use client"

import React, { useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa";
import ErrorComponent from "@/components/ui/feedback/Error";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";
import Button from "@/components/ui/button/Button";
import { useAddPayment } from "@/satelite/services/paymentService";
import SwitchToggle from "@/components/ui/button/SwitchToggle";
import { PaymentMethod } from "@/enum/paymentMethod";


type AddPaymentModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
}

export default function AddPaymentModal({
    isOpen,
    onClose,
    onDone,
}: AddPaymentModalProps) {
    const [paymentType, setPaymentType] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
    const [bankName, setBankName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");

    const { mutate: addPayment, isPending, isError } = useAddPayment();

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

        const newPayment = new FormData();
        newPayment.append("paymentType", paymentType);

        if (paymentType === PaymentMethod.BANK_TRANSFER) {
            newPayment.append("bankName", bankName);
            newPayment.append("bankAccountNumber", bankAccountNumber);
            newPayment.append("accountHolderName", accountHolderName);
        }
        if (paymentType === "QRIS" && imageFile) {
            newPayment.append("file", imageFile);
        }

        addPayment(newPayment, {
            onSuccess: () => {
                toast.success("Payment added successfully");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add payment: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add payment: Unknown error");
                }
            }
        })
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <div className="flex items-center justify-between">
                    <h2>Add Payment</h2>
                </div>
            </ModalBox.Header>

            <ModalBox.Body>
                <div className="flex justify-end">
                    <SwitchToggle
                        value={paymentType}
                        options={paymentTypeOptions}
                        onChange={val => setPaymentType(val as PaymentMethod)}
                        className="ml-4"
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
                        />
                        <FormField
                            label="Bank Account Number"
                            id="bankAccountNumber"
                            value={bankAccountNumber}
                            onChange={e => setBankAccountNumber(e.target.value)}
                            placeholder="Enter bank account number"
                            required
                        />
                        <FormField
                            label="Account Holder Name"
                            id="accountHolderName"
                            value={accountHolderName}
                            onChange={e => setAccountHolderName(e.target.value)}
                            placeholder="Enter account holder name"
                            required
                        />
                    </>
                )}

                {/* QRIS Image Field */}
                {paymentType === "QRIS" && (
                    <FormFileUpload
                        label="QRIS Image"
                        file={imageFile}
                        setFile={setImageFile}
                        maxSize={200_000}
                        required
                    />
                )}

            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleSave}
                    loading={isPending}
                    disabled={isPending}
                    variant="primary"
                    icon={!isPending ? undefined : <FaSpinner className="animate-spin" />}
                >
                    {isPending ? "Adding" : "Add"}
                </Button>
                <Button
                    onClick={handleClose}
                    variant="secondary"
                >
                    Cancel
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    )
}