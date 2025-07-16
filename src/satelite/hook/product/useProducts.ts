import { ProductsResponse } from "@/types/product/productsResponse";
import { FetchParams } from "@/types/fetchParams";
import { apiClient } from "@/lib/client/axios-client";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchProducts = async (params: FetchParams): Promise<ProductsResponse> => {
    try {
        const queryString = buildQueryString(params || {});
        const response = await apiClient.get<ProductsResponse>(
            `/product?${queryString}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
