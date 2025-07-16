import { apiClient } from "@/lib/client/axios-client";
import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { TopPaymentMethodsResponse } from "@/types/statistics/topPaymentMethodsResponse";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchTopPaymentMethods = async (params: FetchParamsStatistics): Promise<TopPaymentMethodsResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<TopPaymentMethodsResponse>(
        `/statistics/top-payment-methods?${queryString}`
    );
    return response.data;
};