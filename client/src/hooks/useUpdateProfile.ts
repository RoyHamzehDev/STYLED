import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/auth";
import { ME_QUERY_KEY } from "../context/auth-context";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    // AuthContext reads the user from the ["me"] query, so writing the updated user
    // into that cache entry updates AuthContext, and with it the nav and home greeting.
    onSuccess: (user) => queryClient.setQueryData(ME_QUERY_KEY, user),
  });
}
