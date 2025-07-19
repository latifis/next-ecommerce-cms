import { apiClient } from "@/lib/client/axios-client";
import { User } from "@/types/user/user";

export const updateUser = async (user: Partial<User>) => {
  const response = await apiClient.put(
    `/user/${user.id}`,
    user
  );
  return response.data;
};