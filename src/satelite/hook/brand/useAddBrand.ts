"use server"

import axios from "axios";

export const addBrand = async (brand: FormData) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "/brands", brand);
  return response.data;
};