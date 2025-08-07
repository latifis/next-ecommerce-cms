import { apiClient } from "@/lib/client/axios-client";
import { Category } from "@/types/category/category";

export const addCategory = async (
  category: Partial<Category>
) => {
  const response = await apiClient.post(
    `/categories`,
    category
  );
  return response.data;
};