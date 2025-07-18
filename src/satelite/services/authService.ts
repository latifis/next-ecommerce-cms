import { useMutation, useQuery } from "@tanstack/react-query";
import { login } from "../hook/auth/useLogin";
import { DecodedToken } from "@/types/decodedToken";
import { fetchProfile } from "../hook/auth/useAuth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
  });
};

export const useAuth = () => {
  return useQuery<DecodedToken>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};