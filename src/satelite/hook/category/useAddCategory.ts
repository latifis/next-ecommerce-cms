"use server"

import { Category } from "@/types/category/category";
import axios from "axios";

export const addCategory = async (category: Category) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "/categories", category);
  return response.data;
};