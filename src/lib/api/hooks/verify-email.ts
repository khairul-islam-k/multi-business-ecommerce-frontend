import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEmail, VerifyEmailPayload } from "../types";
import { apiQueryKeys } from "../query-keys";
import { emailVerifyApi } from "../email-verification";

export function useVerifyEmail(email: TEmail) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.emailVerify.send(email),
    });

  return {
    sendOtp: useMutation({
      mutationFn: () =>
        emailVerifyApi.Send(email),
      onSuccess: invalidate,
    }),
    emailVerify: useMutation({
      mutationFn: (payload: VerifyEmailPayload) =>
        emailVerifyApi.verify(payload),
      onSuccess: invalidate,
    }),

  };
}