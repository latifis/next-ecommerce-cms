import { apiClient } from "@/lib/client/axios-client";
import { BannerByIdResponse } from "@/types/banner/bannerByIdResponse";

export const fetchBannerById = async (bannerId: string | undefined): Promise<BannerByIdResponse> => {
    const response = await apiClient.get<BannerByIdResponse>(
        `/media/${bannerId}`
    );
    return response.data;
};