import { apiClient } from "@/lib/client/axios-client";

export const updateProduct = async (product: FormData, productId: string | undefined) => {
  const response = await apiClient.put(
    `/product/${productId}`,
    product
  );
  return response.data;
};