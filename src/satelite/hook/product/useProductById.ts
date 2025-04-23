"use server"

import { ProductByIdResponse } from "@/types/product/productByIdResponse";
import axios from "axios";

export const fetchProductById = async (productId: string | undefined): Promise<ProductByIdResponse> => {
    const response = await axios.get<ProductByIdResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/product/${productId}`);
    return response.data;
};