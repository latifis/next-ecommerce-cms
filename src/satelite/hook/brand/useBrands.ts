import { apiClient } from "@/lib/client/axios-client";
import { BrandsResponse } from "@/types/brand/brandsResponse";
import { FetchParams } from "@/types/fetchParams";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchBrands = async (params: FetchParams): Promise<BrandsResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<BrandsResponse>(
        `/brands?${queryString}`
    );
    return response.data;
};
