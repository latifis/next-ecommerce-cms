import { apiClient } from "@/lib/client/axios-client";

export const addPayment = async (
  payment: FormData
) => {
  const response = await apiClient.post(
    `/bank-account`,
    payment
  );
  return response.data;
};