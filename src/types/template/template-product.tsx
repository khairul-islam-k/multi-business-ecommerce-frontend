import { ListQuery } from "@/lib/api";

export type ProductStatus = "ACTIVE" | "INACTIVE";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AuditFields = {
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductCategory = AuditFields & {
  id: string;
  businessId: string;
  parentId: string | null;

  name: string;
  description: string | null;
  imageUrl: string | null;

  status: ProductStatus;
};

export type ProductBrand = AuditFields & {
  id: string;
  businessId: string;

  name: string;
  description: string | null;
  logoUrl: string | null;

  status: ProductStatus;
};

export type ProductTag = AuditFields & {
  id: string;
  businessId: string;

  name: string;
  status: ProductStatus;
  isFeatured: boolean;
};

export type ProductImage = AuditFields & {
  id: string;
  businessId: string;

  productId: string;
  variantId: string | null;

  imageUrl: string;
  altText: string | null;
  isThumbnail: boolean;
};

export type ProductStockSummary = {
  totalQuantity: string;
  quantityReserved: string;
  availableQuantity: string;
  inStock: boolean;
};

export type ProductReviewSummary = {
  reviewCount: number;
  averageRating: number;
};

export type ProductReview = AuditFields & {
  id: string;
  businessId: string;

  productId: string;
  customerId: string | null;
  variantId: string | null;

  rating: number;
  title: string;
  comment: string;

  reviewerName: string | null;
  reviewerEmail: string | null;
  reviewerPhone: string | null;

  status: ReviewStatus;
};

// variant

export type StockSummary = {
  totalQuantity: number;
  quantityReserved: number;
  availableQuantity: number;
  inStock: boolean;
};

export type ProductVariant = {
  id: string;
  businessId: string;
  productId: string;

  sku: string;
  barcode: string;
  title: string;

  priceOverride: string;
  weight: string;
  status: "ACTIVE" | "INACTIVE";

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  stockSummary: StockSummary;

  effectivePrice: string;

  images: ProductImage[];
};

export type StorefrontProduct = AuditFields & {
  id: string;
  businessId: string;

  categoryId: string;
  brandId: string;
  unitId: string;
  taxId: string | null;

  name: string;
  slug: string;
  description: string | null;

  sku: string;
  barcode: string | null;

  price: string;
  weight: string | null;

  status: ProductStatus;

  category: ProductCategory;
  brand: ProductBrand;

  tags: ProductTag[];
  images: ProductImage[];

  variants: ProductVariant[];

  stockSummary: ProductStockSummary;
  reviewSummary: ProductReviewSummary;
  reviews: ProductReview[];
};

export type ProductQuery = ListQuery & {
  tagId?: string;
  search?: string;
  categoryId?: string;
  brandId?: string;
};
