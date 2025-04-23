"use server"

import { ProductsResponse } from "@/types/product/productsResponse";
import { FetchParams } from "@/types/fetchParams";
import axios from "axios";

export const fetchProducts = async (params: FetchParams): Promise<ProductsResponse> => {
    const response = await axios.get<ProductsResponse>(process.env.NEXT_PUBLIC_BASE_URL + "/product", { params });
    return response.data;
};
