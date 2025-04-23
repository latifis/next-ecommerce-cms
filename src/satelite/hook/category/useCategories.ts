"use server"

import { CategoriesResponse } from "@/types/category/categoriesResponse";
import { FetchParams } from "@/types/fetchParams";
import axios from "axios";

export const fetchCategories = async (params: FetchParams): Promise<CategoriesResponse> => {
    const response = await axios.get<CategoriesResponse>(process.env.NEXT_PUBLIC_BASE_URL + "/categories", { params });
    return response.data;
};
