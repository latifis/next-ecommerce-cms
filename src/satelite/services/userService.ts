import { FetchParams } from "@/types/fetchParams";
import { fetchUsers } from "../hook/user/useUsers";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types/user/user";
import { updateUser } from "../hook/user/useUpdateUser";
import { fetchUserById } from "../hook/user/useUserById";
import { UserByIdResponse } from "@/types/user/userByIdResponse";
import { UserResponse } from "@/types/user/userResponse";
import { fetchUser } from "../hook/user/useUser";
import { CreateUpdateUserInput } from "@/types/user/createUpdateUserInput";
import { updateThisUser } from "../hook/user/useUpdateThisUser";

export const useUser = () => {
  return useQuery<UserResponse, Error>({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
  });
};

export const useUsers = (params: FetchParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, params] = queryKey as [string, FetchParams];
      return fetchUsers(params);
    },
  });
};

export const useUserById = (userId: string | undefined) => {
  return useQuery<UserByIdResponse, Error>({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (user: Partial<User>) => updateUser(user)
  });
};

export const useUpdateThisUser = () => {
  return useMutation({
    mutationFn: (user: CreateUpdateUserInput) => updateThisUser(user),
  });
};