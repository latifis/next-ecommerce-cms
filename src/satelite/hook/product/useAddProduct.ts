import { apiClient } from "@/lib/client/axios-client";

export const addProduct = async (
  product: FormData
) => {
  const response = await apiClient.post(
    `/product`,
    product
  );
  return response.data;
};