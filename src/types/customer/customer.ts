import { CustomerAddressResponse } from "./customerAddress";

export type CustomerStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "BLOCKED";

export type CustomerPayload = {
    name: string;
    email?: string;
    phone?: string;
    status: CustomerStatus;
    note?: string;
};

export type CustomerCount = {
  carts: number;
  orders: number;
};

export type CustomerResponse = {
  id: string;
  businessId: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: CustomerStatus;
  note: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  addresses: CustomerAddressResponse[];
  _count: CustomerCount;
};