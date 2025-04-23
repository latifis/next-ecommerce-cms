"use server"

import { CategoryByIdResponse } from "@/types/category/categoryByIdResponse";
import axios from "axios";

export const fetchCategoryById = async (categoryId: string | undefined): Promise<CategoryByIdResponse> => {
    const response = await axios.get<CategoryByIdResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/categories/${categoryId}`);
    return response.data;
};