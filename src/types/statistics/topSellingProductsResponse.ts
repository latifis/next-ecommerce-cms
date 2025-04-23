import { TopSellingProducts } from "./topSellingProducts";

export interface TopSellingProductsResponse {
    status: string;
    message: string;
    data: {
        topSellingProducts: TopSellingProducts[];
    };
}