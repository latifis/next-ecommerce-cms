"use server"

import { Category } from "@/types/category/category";
import axios from "axios";

export const updateCategory = async (category: Category) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/categories/${category.id}`, category);
  return response.data;
};