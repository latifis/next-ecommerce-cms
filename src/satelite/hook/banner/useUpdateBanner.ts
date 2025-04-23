"use server"

import axios from "axios";

export const updateBanner = async (banner: FormData, bannerId: string | undefined) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/media/${bannerId}`, banner);
  return response.data;
}