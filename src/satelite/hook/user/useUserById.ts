import { apiClient } from "@/lib/client/axios-client";
import { UserByIdResponse } from "@/types/user/userByIdResponse";

export const fetchUserById = async (userId: string | undefined): Promise<UserByIdResponse> => {
    const response = await apiClient.get<UserByIdResponse>(
        `/user/${userId}`
    );
    return response.data;
};