import { apiClient } from "@/lib/client/axios-client";
import { ProductByIdResponse } from "@/types/product/productByIdResponse";

export const fetchProductByCode = async (code: string | undefined): Promise<ProductByIdResponse> => {
    const response = await apiClient.get<ProductByIdResponse>(
        `/product/code/${code}`
    );
    return response.data;
};