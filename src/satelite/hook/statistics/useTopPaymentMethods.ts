"use server"

import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { TopPaymentMethodsResponse } from "@/types/statistics/topPaymentMethodsResponse";
import axios from "axios";

export const fetchTopPaymentMethods = async (params: FetchParamsStatistics): Promise<TopPaymentMethodsResponse> => {
    const response = await axios.get<TopPaymentMethodsResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/statistics/top-payment-methods`, { params });
    return response.data;
};