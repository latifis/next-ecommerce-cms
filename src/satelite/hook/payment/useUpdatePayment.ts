import { apiClient } from "@/lib/client/axios-client";

export const updatePayment = async (payment: FormData, paymentId: string | undefined) => {
  const response = await apiClient.put(
    `/bank-account/${paymentId}`,
    payment
  );
  return response.data;
};