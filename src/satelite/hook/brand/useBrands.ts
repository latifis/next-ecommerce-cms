"use server"

import { BrandsResponse } from "@/types/brand/brandsResponse";
import { FetchParams } from "@/types/fetchParams";
import axios from "axios";

export const fetchBrands = async (params: FetchParams): Promise<BrandsResponse> => {
    const response = await axios.get<BrandsResponse>(process.env.NEXT_PUBLIC_BASE_URL + "/brands", { params });
    return response.data;
};
