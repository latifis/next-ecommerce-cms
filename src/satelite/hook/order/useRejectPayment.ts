import { apiClient } from "@/lib/client/axios-client";
import { Payment } from "@/types/order/payment";

export const rejectPayment = async (payment: Payment) => {
  const response = await apiClient.put(
    `/payments/reject-payment/${payment.id}`,
    payment
  );
  return response.data;
};