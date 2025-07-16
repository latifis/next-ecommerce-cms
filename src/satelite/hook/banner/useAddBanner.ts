import { apiClient } from "@/lib/client/axios-client";

export const addBanner = async (
  banner: FormData
) => {
  const response = await apiClient.post(
    `/media`,
    banner
  );
  return response.data;
};