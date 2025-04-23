"use server"

import axios from "axios";

export const updateProduct = async (product: FormData, productId: string | undefined) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/product/${productId}`, product);
  return response.data;
};