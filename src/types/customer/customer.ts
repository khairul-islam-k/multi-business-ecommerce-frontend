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

export type CustomerAddress = {
  id: string;
  customerId: string;
  businessId: string;
  name?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
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
  addresses: CustomerAddress[];
  _count: CustomerCount;
};