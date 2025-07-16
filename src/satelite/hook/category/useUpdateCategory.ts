import { apiClient } from "@/lib/client/axios-client";
import { Category } from "@/types/category/category";

export const updateCategory = async (category: Category) => {
  const response = await apiClient.put(
    `/categories/${category.id}`,
    category
  );
  return response.data;
};