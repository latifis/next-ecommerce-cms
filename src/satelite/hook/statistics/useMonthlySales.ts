import { apiClient } from "@/lib/client/axios-client";
import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { MonthlySalesResponse } from "@/types/statistics/monthlySalesResponse";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchMonthlySales = async (params: FetchParamsStatistics): Promise<MonthlySalesResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<MonthlySalesResponse>(
        `/statistics/monthly-sales?${queryString}`
    );
    return response.data;
};