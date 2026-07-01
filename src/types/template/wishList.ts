import { ProductStatus } from "./add-cart";

export type ProductWishListPayload = {
  productId: string;
  variantId?: string;
};

// wish list product

export type ApiId = string;

// export type ProductStatus = "ACTIVE" | "INACTIVE";

export type WishlistProduct = {
  id: ApiId;
  businessId: ApiId;
  categoryId: ApiId;
  brandId: ApiId | null;
  unitId: ApiId | null;
  taxId: ApiId | null;

  name: string;
  slug: string;
  description: string | null;
  sku: string;
  barcode: string;
  price: string;
  weight: string | null;
  status: ProductStatus;

  createdBy: ApiId | null;
  updatedBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type WishlistVariant = {
  id: ApiId;
  businessId: ApiId;
  productId: ApiId;

  sku: string;
  barcode: string;
  title: string;
  priceOverride: string | null;
  weight: string | null;
  status: ProductStatus;

  createdBy: ApiId | null;
  updatedBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type WishlistImage = {
  id: ApiId;
  businessId: ApiId;
  productId: ApiId;
  variantId: ApiId | null;

  imageUrl: string;
  altText: string | null;
  isThumbnail: boolean;
  sortOrder: number;

  createdBy: ApiId | null;
  updatedBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type WishlistItem = {
  id: ApiId;
  businessId: ApiId;
  customerId: ApiId;
  productId: ApiId;
  variantId: ApiId | null;

  createdAt: string;
  updatedAt: string;

  product: WishlistProduct;
  variant: WishlistVariant | null;
  image: WishlistImage | null;
};