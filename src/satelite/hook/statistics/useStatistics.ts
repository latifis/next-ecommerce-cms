import { StatisticsResponse } from "@/types/statistics/statisticsResponse";
import { AxiosError } from "axios";
import { apiClient } from "@/lib/client/axios-client";

export const fetchStatistics = async (): Promise<StatisticsResponse> => {
    try {
        const response = await apiClient.get<StatisticsResponse>(
            `/statistics`
        );

        return response.data;
    } catch (error: unknown) {
        console.log("Error fetching statistics:", error);
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                throw new Error("Unauthorized. Please log in again.");
            }

            throw new Error(
                error.response?.data?.message || "Failed to fetch statistics. Please try again later."
            );
        }

        throw new Error("Failed to fetch statistics. Please try again later.");
    }
};
