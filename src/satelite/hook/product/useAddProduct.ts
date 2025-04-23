"use server"

import axios from "axios";

export const addProduct = async (product: FormData) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "/product", product);
  return response.data;
};