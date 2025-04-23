import { Statistics } from "./statistics";

export interface StatisticsResponse {
    status: string;
    message: string;
    data: {
        statistics: Statistics;
    };
}