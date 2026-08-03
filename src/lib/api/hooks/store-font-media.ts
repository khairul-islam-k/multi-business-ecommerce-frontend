"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "@/lib/api/query-keys";
import type {
  UploadMediaPayload,
} from "@/lib/api/types";
import { storeFontMedia } from "../store-font-media";


export function useStoreFontMediaMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.storeFontMedia.all(),
    });
  };

  return {
    uploadMedia: useMutation({
      mutationFn: (payload: UploadMediaPayload) =>
        storeFontMedia.upload(payload),
      onSuccess: invalidate,
    }),

  };
}
