import { apiClient } from "@/lib/client/axios-client";

export const updateBanner = async (banner: FormData, bannerId: string | undefined) => {
  const response = await apiClient.put(
    `/media/${bannerId}`,
    banner
  );
  return response.data;
};