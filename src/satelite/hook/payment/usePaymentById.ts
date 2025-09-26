import { apiClient } from "@/lib/client/axios-client";
import { PaymentByIdResponse } from "@/types/payment/paymentByIdResponse";

export const fetchPaymentById = async (paymentId: string | undefined): Promise<PaymentByIdResponse> => {
    const response = await apiClient.get<PaymentByIdResponse>(
        `/bank-account/${paymentId}`
    );
    return response.data;
};