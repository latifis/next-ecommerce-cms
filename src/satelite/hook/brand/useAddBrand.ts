import { apiClient } from "@/lib/client/axios-client";

export const addBrand = async (
  brand: FormData
) => {
  const response = await apiClient.post(
    `/brands`,
    brand
  );
  return response.data;
};