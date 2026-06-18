import { ResponseAttributeValue, ResponseProductAttribute } from "./attribute";

export type VariantStatus = "ACTIVE" | "INACTIVE";

export type VariantImagePayload = {
  imageUrl: string;
  altText: string;
};


export type VariantAttributePayload = {
  attributeId: string;
  attributeValueId: string;
};

export type ProductVariantAttributeInput = VariantAttributePayload;

export type VariantPayload = {
  images: VariantImagePayload[];
  title: string;
  priceOverride: number;
  weight: number;
  status: VariantStatus;
  attributes: VariantAttributePayload[];
};

export type BulkVariantPayload = {
  variants: VariantPayload[];
};

export type BulkUpdateVariantItemPayload = Partial<VariantPayload> & {
  variantId?: string;
};

export type BulkUpdateVariantPayload = {
  variants: BulkUpdateVariantItemPayload[];
};


export type ResponseVariantImage = {
  id: string;
  businessId: string;
  productId: string;
  variantId: string | null;

  imageUrl: string | undefined;
  altText: string | undefined;
  isThumbnail: boolean;
  sortOrder: number;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ResponseVariantAttribute = {
  id: string;
  variantId: string;
  attributeId: string;
  attributeValueId: string;

  attribute: ResponseProductAttribute;
  attributeValue: ResponseAttributeValue;

  createdAt: string;
};

type products = {
  name: string;
}

export type ResponseVariant = {
  id: string;
  businessId: string;
  productId: string;

  title: string;
  sku: string;
  barcode: string;

  // Your API returns string: "15", "55"
  priceOverride: string | undefined;
  weight: string | number;

  status: VariantStatus;

  product?: products;

  images: ResponseVariantImage[];
  attributes: ResponseVariantAttribute[];
  effectivePrice?: string | number;
  stock?: {
    totalQuantity: number;
    quantityReserved: number;
    availableQuantity: number;
    inStock: boolean;
  };

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductVariantOptionsPayload = {
  selectedAttributes: ProductVariantAttributeInput[];
  includeOutOfStock?: boolean;
};

export type ProductVariantOptionValue = {
  attributeValueId: string;
  value: string;
  matchingVariantCount: number;
  availableQuantity: number;
  inStock: boolean;
  selected: boolean;
};

export type ProductVariantAvailableOption = {
  attributeId: string;
  name: string;
  values: ProductVariantOptionValue[];
};

export type ProductVariantSelectedAttribute = {
  attributeId: string;
  attributeName: string;
  attributeValueId: string;
  attributeValue: string;
};

export type ProductVariantOptionsResponse = {
  selectedAttributes: ProductVariantSelectedAttribute[];
  availableOptions: ProductVariantAvailableOption[];
  matchingVariants: ResponseVariant[];
  selectedVariant: ResponseVariant | null;
};
