import { MonthlySales } from "./monthlySales";

export interface MonthlySalesResponse {
    status: string;
    message: string;
    data: {
        monthlySales: MonthlySales[];
    };
}