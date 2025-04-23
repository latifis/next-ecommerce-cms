import { useMutation } from "@tanstack/react-query";
import { login } from "../hook/auth/useLogin";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
  });
};