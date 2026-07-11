import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import {
  normalizePaginatedResponse,
  unwrapApiResponse,
} from "@/lib/api/response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  MediaAsset,
  MediaQuery,
  UploadMediaBulkPayload,
  UploadMediaPayload,
} from "@/lib/api/types";

const mediaPath = (businessId: ApiId) =>
  `/media/businesses/${businessId}/images`;

const mediaForm = (payload: {
  altText?: string;
  tags?: string;
  files?: File[];
  file?: File;
}) => {
  const formData = new FormData();

  if (payload.file) formData.append("file", payload.file);
  payload.files?.forEach((file) => formData.append("files", file));
  if (payload.altText?.trim()) formData.append("altText", payload.altText);
  if (payload.tags?.trim()) formData.append("tags", payload.tags);

  return formData;
};

export const mediaApi = {
  list(businessId: ApiId, query?: MediaQuery) {
    return api
      .get<
        ApiPaginatedResponse<MediaAsset>
      >(`${mediaPath(businessId)}${buildQueryString(query)}`)
      .then((res) => normalizePaginatedResponse(res.data));
  },

  upload(businessId: ApiId, payload: UploadMediaPayload) {
    return api
      .post<ApiResponse<MediaAsset>>(mediaPath(businessId), mediaForm(payload))
      .then((res) => unwrapApiResponse(res.data));
  },

  uploadBulk(businessId: ApiId, payload: UploadMediaBulkPayload) {
    return api
      .post<ApiResponse<MediaAsset[]>>(
        `${mediaPath(businessId)}/bulk`,
        mediaForm(payload),
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, mediaAssetId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${mediaPath(businessId)}/${mediaAssetId}`)
      .then((res) => ({
        message: res.data.message ?? "Media asset deleted successfully",
      }));
  },

  removeBulk(businessId: ApiId, mediaAssetIds: ApiId[]) {
    return api
      .delete<ApiResponse<null>>(`${mediaPath(businessId)}/bulk`, {
        data: { mediaAssetIds },
      })
      .then((res) => ({
        message: res.data.message ?? "Media assets deleted successfully",
      }));
  },
};
