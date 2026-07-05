import { ListQuery } from "@/lib/api";

export type AddToCartPayload = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type CartStatus = "ACTIVE" | "ORDERED";
export type CartStatusForFilter = "ACTIVE" | "ORDERED"| string;
export type ProductStatus = "ACTIVE" | "INACTIVE";
export type VariantStatus = "ACTIVE" | "INACTIVE";

export type CartProduct = {
  id: string;
  businessId: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  taxId: string | null;

  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string | null;
  price: string;
  weight: string | null;

  status: ProductStatus;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CartVariant = {
  id: string;
  businessId: string;
  productId: string;

  sku: string;
  barcode: string;
  title: string;
  priceOverride: string;
  weight: string | null;

  status: VariantStatus;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CartImage = {
  id: string;
  businessId: string;
  productId: string;
  variantId: string | null;

  imageUrl: string;
  altText: string | null;
  isThumbnail: boolean;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;

  quantity: string;
  images: CartImage[];

  product: CartProduct;
  variant: CartVariant | null;

  createdAt: string;
  updatedAt: string;
};

export type CustomerCartResponse = {
  id: string;
  businessId: string;
  customerId: string | null;
  sessionId: string | null;

  status: CartStatus;
  expiresAt: string | null;

  items: CartItem[];

  createdAt: string;
  updatedAt: string;
};

export type UpdateQuantity = {
  quantity: number;
};

export type CartQuery = ListQuery & {
  status?: CartStatusForFilter;
};