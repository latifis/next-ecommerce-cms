import { PaymentStatus } from "@/enum/paymentStatus";

export interface Payment {
    id?: string;
    orderId?: string;
    paymentStatus: PaymentStatus;
    paymentProof?: string;
    transactionId?: string;
    createdAt?: string;
    updatedAt?: string;
}
