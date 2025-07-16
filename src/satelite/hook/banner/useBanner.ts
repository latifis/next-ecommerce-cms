import { apiClient } from "@/lib/client/axios-client";
import { BannersResponse } from "@/types/banner/bannerResponse";
import { FetchParams } from "@/types/fetchParams";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchBanner = async (params: FetchParams): Promise<BannersResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<BannersResponse>(
        `/media?${queryString}`
    );
    return response.data;
};
