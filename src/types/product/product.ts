import { ListQuery } from "@/lib/api";
import { ResponseBrand } from "./brands";
import { ResponseUnit } from "./unit";
import { ResponseVariant } from "./variant";

export type MediaFileType = "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT";

export type MediaStatus = "ACTIVE" | "INACTIVE";

export type MediaTag = {
  id: string;
  name: string;
};

export type MediaFile = {
  id: string;
  businessId: string;
  uploadedBy: string;
  fileName: string;
  fileUrl: string;
  fileType: MediaFileType;
  mimeType: string;
  fileSize: number;
  altText: string | null;
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tags: MediaTag[];
};

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type ProductCategoryPayload = {
  name: string;
  description: string;
  imageUrl: string;
  parentId?: string | null;
  status: CategoryStatus;
  sortOrder: number;
};

export type ProductCategoryCount = {
  children: number;
  products: number;
};


export type CategoryParent = {
  id: string;
  businessId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
};

export type CategoryChild = {
  id: string;
  businessId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
};

export type ResponseCategory = {
  id: string;
  businessId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: CategoryStatus;

  parent: CategoryParent | null;
  children: CategoryChild[];

  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;

  _count: {
    children: number;
    products: number;
  };
};


export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type ProductImagePayload = {
  imageUrl: string;
  altText?: string;
  isThumbnail?: boolean;
};

export type ProductPayload = {
  images: ProductImagePayload[];
  name: string;
  price: number;
  weight?: number;
  description: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  status: ProductStatus;
  tagIds: string[];
};

export type ProductFormValues = ProductPayload;

type Tag = {
  id: string;
  businessId: string;
  name: string;
  status: MediaStatus;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductTag = {
  id: string;
  productId: string;
  tagId: string;
  createdAt: string;
  tag: Tag;
};

type ProductImage = {
  id: string;
  businessId: string;
  productId: string;
  variantId: string | null;

  imageUrl: string;
  altText: string;
  isThumbnail: boolean;
  sortOrder: number;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ResponseProduct = {
  id: string;
  businessId: string;

  categoryId: string;
  brandId: string;
  unitId: string;

  name: string;
  sku?: string;
  barcode?: string;
  price: string;
  weight: string | null;
  slug: string;
  description: string | null;
  status: ProductStatus;

  images: ProductImage[];
  tags: ProductTag[];
  attributes: unknown;
  variants: ResponseVariant[];

  category: ResponseCategory;
  brand: ResponseBrand;
  unit: ResponseUnit;
  stockSummary?: {
    totalQuantity: string | number;
    quantityReserved: string | number;
    availableQuantity: string | number;
  };

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductQuery = ListQuery & {
  status?: ProductStatus;
};
