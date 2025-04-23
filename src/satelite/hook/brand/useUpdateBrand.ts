"use server"

import axios from "axios";

export const updateBrand = async (brand: FormData, brandId: string | undefined) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/brands/${brandId}`, brand);
  return response.data;
};