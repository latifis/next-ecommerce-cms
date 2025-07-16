import { apiClient } from "@/lib/client/axios-client";
import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { TopSellingProductsResponse } from "@/types/statistics/topSellingProductsResponse";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchTopSellingProducts = async (params: FetchParamsStatistics): Promise<TopSellingProductsResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<TopSellingProductsResponse>(
        `/statistics/top-selling-products?${queryString}`
    );
    return response.data;
};