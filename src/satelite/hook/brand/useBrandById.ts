import { apiClient } from "@/lib/client/axios-client";
import { BrandByIdResponse } from "@/types/brand/brandByIdResponse";

export const fetchBrandById = async (brandId: string | undefined): Promise<BrandByIdResponse> => {
    const response = await apiClient.get<BrandByIdResponse>(
        `/brands/${brandId}`
    );
    return response.data;
};