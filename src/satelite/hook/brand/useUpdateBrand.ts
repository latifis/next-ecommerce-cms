import { apiClient } from "@/lib/client/axios-client";

export const updateBrand = async (brand: FormData, brandId: string | undefined) => {
  const response = await apiClient.put(
    `/brands/${brandId}`,
    brand
  );
  return response.data;
};