"use server"

import { BannerByIdResponse } from "@/types/banner/bannerByIdResponse";
import axios from "axios";

export const fetchBannerById = async (bannerId: string | undefined): Promise<BannerByIdResponse> => {
    const response = await axios.get<BannerByIdResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/media/${bannerId}`);
    return response.data;
}