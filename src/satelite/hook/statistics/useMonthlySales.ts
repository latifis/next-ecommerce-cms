"use server"

import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { MonthlySalesResponse } from "@/types/statistics/monthlySalesResponse";
import axios from "axios";

export const fetchMonthlySales = async (params: FetchParamsStatistics): Promise<MonthlySalesResponse> => {
    const response = await axios.get<MonthlySalesResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/statistics/monthly-sales`, { params });
    return response.data;
};