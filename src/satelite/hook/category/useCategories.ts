import { apiClient } from "@/lib/client/axios-client";
import { CategoriesResponse } from "@/types/category/categoriesResponse";
import { FetchParams } from "@/types/fetchParams";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchCategories = async (params: FetchParams): Promise<CategoriesResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<CategoriesResponse>(
        `/categories?${queryString}`
    );
    return response.data;
};