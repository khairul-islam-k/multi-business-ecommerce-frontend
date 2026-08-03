import {
  unwrapApiResponse,
} from "@/lib/api/response";
import type {
  ApiResponse,
  MediaAsset,
  UploadMediaPayload,
} from "@/lib/api/types";
import webApi from "../public-api-hook/web-api";

const mediaPath = () =>`/storefront/customer/images`;

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

export const storeFontMedia = {
  upload(payload: UploadMediaPayload) {
    return webApi
      .post<ApiResponse<MediaAsset>>(mediaPath(), mediaForm(payload))
      .then((res) => unwrapApiResponse(res.data));
  },
};
