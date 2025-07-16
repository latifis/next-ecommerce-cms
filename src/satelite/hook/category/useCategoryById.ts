import { apiClient } from "@/lib/client/axios-client";
import { CategoryByIdResponse } from "@/types/category/categoryByIdResponse";

export const fetchCategoryById = async (categoryId: string | undefined): Promise<CategoryByIdResponse> => {
    const response = await apiClient.get<CategoryByIdResponse>(
        `/categories/${categoryId}`
    );
    return response.data;
};