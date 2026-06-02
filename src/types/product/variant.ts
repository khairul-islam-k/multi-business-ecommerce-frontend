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

export type VariantPayload = {
  images: VariantImagePayload[];
  title: string;
  price: number;
  weight: number;
  status: VariantStatus;
  attributes: VariantAttributePayload[];
};


export type ResponseVariantImage = {
  id: string;
  businessId: string;
  productId: string;
  variantId: string | null;

  imageUrl: string;
  altText: string | null;
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
  price: string | number;
  weight: string | number;

  status: VariantStatus;

  product?: products;

  images: ResponseVariantImage[];
  attributes: ResponseVariantAttribute[];

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

