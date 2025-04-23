"use server"

import { FetchParamsStatistics } from "@/types/fetchParamsStatistics";
import { TopCategoriesResponse } from "@/types/statistics/topCategoriesResponse";
import axios from "axios";

export const fetchTopCategories = async (params: FetchParamsStatistics): Promise<TopCategoriesResponse> => {
    const response = await axios.get<TopCategoriesResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/statistics/top-categories`, { params });
    return response.data;
};