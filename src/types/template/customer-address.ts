export type CustomerAddressType =
  | "HOME"
  | "OFFICE"
  | "SHIPPING"
  | "BILLING"
  | "OTHER";

export type CustomerAddressPayload = {
  addressType: CustomerAddressType;
  name: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
};