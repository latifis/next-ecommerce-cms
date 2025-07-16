import { apiClient } from "@/lib/client/axios-client";
import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { TopCategoriesResponse } from "@/types/statistics/topCategoriesResponse";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchTopCategories = async (params: FetchParamsStatistics): Promise<TopCategoriesResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<TopCategoriesResponse>(
        `/statistics/top-categories?${queryString}`
    );
    return response.data;
};