"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { mediaApi } from "@/lib/api/media";
import { apiQueryKeys } from "@/lib/api/query-keys";
import type {
  ApiId,
  MediaQuery,
  UploadMediaBulkPayload,
  UploadMediaPayload,
} from "@/lib/api/types";

export function useMediaAssets(businessId: ApiId, query?: MediaQuery) {
  return useQuery({
    queryKey: apiQueryKeys.media.list(businessId, query),
    queryFn: () => mediaApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useMediaMutations(businessId?: ApiId | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    if (!businessId) return;
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.media.all(businessId),
    });
  };

  return {
    uploadMedia: useMutation({
      mutationFn: (payload: UploadMediaPayload) =>
        mediaApi.upload(businessId as ApiId, payload),
      onSuccess: invalidate,
    }),
    uploadMediaBulk: useMutation({
      mutationFn: (payload: UploadMediaBulkPayload) =>
        mediaApi.uploadBulk(businessId as ApiId, payload),
      onSuccess: invalidate,
    }),
    removeMedia: useMutation({
      mutationFn: (mediaAssetId: ApiId) =>
        mediaApi.remove(businessId as ApiId, mediaAssetId),
      onSuccess: invalidate,
    }),
    removeMediaBulk: useMutation({
      mutationFn: (mediaAssetIds: ApiId[]) =>
        mediaApi.removeBulk(businessId as ApiId, mediaAssetIds),
      onSuccess: invalidate,
    }),
  };
}
