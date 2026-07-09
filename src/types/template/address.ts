export type CustomerAddressType = "HOME" | "OFFICE" | "SHIPPING" | "BILLING" | "OTHER";

export type CustomerAddress = {
    id: string;
    customerId: string;
    addressType: CustomerAddressType;
    name: string;
    address: string;
    city: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    deletedBy: string | null;
    deletedAt: string | null;
};