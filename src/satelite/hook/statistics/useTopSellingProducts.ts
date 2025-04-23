"use server"

import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { TopSellingProductsResponse } from "@/types/statistics/topSellingProductsResponse";
import axios from "axios";

export const fetchTopSellingProducts = async (params: FetchParamsStatistics): Promise<TopSellingProductsResponse> => {
    const response = await axios.get<TopSellingProductsResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/statistics/top-selling-products`, { params });
    return response.data;
};