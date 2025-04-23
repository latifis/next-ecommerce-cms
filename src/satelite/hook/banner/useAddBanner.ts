"use server"
import axios from "axios";

export const addBanner = async (banner: FormData) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "/media", banner);
  return response.data;
};