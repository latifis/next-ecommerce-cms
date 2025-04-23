"use server"

import { BannersResponse } from "@/types/banner/bannerResponse";
import { FetchParams } from "@/types/fetchParams";
import axios from "axios";

export const fetchBanner = async (params: FetchParams): Promise<BannersResponse> => {
    const response = await axios.get<BannersResponse>(process.env.NEXT_PUBLIC_BASE_URL + "/media", { params });
    return response.data;
}