export type CustomerAddressType =
    | "HOME"
    | "OFFICE"
    | "SHIPPING"
    | "BILLING"
    | "OTHER";

export type CustomerAddressPayload = {
    addressType: CustomerAddressType;
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    isDefault: boolean;
};

export type CustomerAddressResponse = {
  id: string;
  customerId: string;
  addressType: CustomerAddressType;
  name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};