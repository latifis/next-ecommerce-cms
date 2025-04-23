"use server"

import { BrandByIdResponse } from "@/types/brand/brandByIdResponse";
import axios from "axios";

export const fetchBrandById = async (brandId: string | undefined): Promise<BrandByIdResponse> => {
    const response = await axios.get<BrandByIdResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/brands/${brandId}`);
    return response.data;
};