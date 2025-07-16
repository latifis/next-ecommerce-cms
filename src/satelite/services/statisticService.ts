import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { fetchMonthlySales } from "../hook/statistics/useMonthlySales";
import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { StatisticsResponse } from "@/types/statistics/statisticsResponse";
import { fetchStatistics } from "../hook/statistics/useStatistics";
import { fetchTopCategories } from "../hook/statistics/useTopCategories";
import { fetchTopPaymentMethods } from "../hook/statistics/useTopPaymentMethods";
import { fetchTopSellingProducts } from "../hook/statistics/useTopSellingProducts";

export const useStatistics = () => {
    return useQuery<StatisticsResponse>({
        queryKey: ['statistics'],
        queryFn: fetchStatistics,
    });
};

export const useMonthlySales = (params: FetchParamsStatistics) => {
    return useQuery({
        queryKey: ['monthlySales', params],
        queryFn: ({ queryKey }: QueryFunctionContext) => {
            const [, params] = queryKey as [string, FetchParamsStatistics];
            return fetchMonthlySales(params);
        },
    });
};

export const useTopCategories = (params: FetchParamsStatistics) => {
    return useQuery({
        queryKey: ['topCategories', params],
        queryFn: ({ queryKey }: QueryFunctionContext) => {
            const [, params] = queryKey as [string, FetchParamsStatistics];
            return fetchTopCategories(params);
        },
    });
};

export const useTopPaymentMethods = (params: FetchParamsStatistics) => {
    return useQuery({
        queryKey: ['topPaymentMethods', params],
        queryFn: ({ queryKey }: QueryFunctionContext) => {
            const [, params] = queryKey as [string, FetchParamsStatistics];
            return fetchTopPaymentMethods(params);
        },
    });
};

export const useTopSellingProducts = (params: FetchParamsStatistics) => {
    return useQuery({
        queryKey: ['topSellingProducts', params],
        queryFn: ({ queryKey }: QueryFunctionContext) => {
            const [, params] = queryKey as [string, FetchParamsStatistics];
            return fetchTopSellingProducts(params);
        },
    });
};