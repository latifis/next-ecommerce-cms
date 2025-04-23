"use server"

import { StatisticsResponse } from "@/types/statistics/statisticsResponse";
import axios from "axios";

export const fetchStatistics = async (): Promise<StatisticsResponse> => {
    const response = await axios.get<StatisticsResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/statistics`);
    return response.data;
};