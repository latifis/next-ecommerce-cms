import { apiClient } from "@/lib/client/axios-client";
import { Payment } from "@/types/order/payment";

export const verifyPayment = async (payment: Payment) => {
  const response = await apiClient.put(
    `/payments/verify-payment/${payment.id}`,
    payment
  );
  return response.data;
};