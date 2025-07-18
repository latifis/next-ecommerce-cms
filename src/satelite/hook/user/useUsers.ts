import { apiClient } from "@/lib/client/axios-client";
import { UsersResponse } from "@/types/user/usersResponse";
import { FetchParams } from "@/types/fetchParams";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchUsers = async (params: FetchParams): Promise<UsersResponse> => {
    const queryString = buildQueryString(params || {});
    const response = await apiClient.get<UsersResponse>(
        `/user?${queryString}`
    );
    return response.data;
};