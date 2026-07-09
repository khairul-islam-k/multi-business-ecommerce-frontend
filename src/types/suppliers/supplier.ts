export type SupplierStatus = "ACTIVE" | "INACTIVE";

export type SupplierPayload = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: SupplierStatus;
  note?: string | null;
};

export type SupplierResponse = {
  id: string;
  businessId: string;

  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: SupplierStatus;
  note: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  createdBy: string;
  updatedBy: string;

  _count: {
    products: number;
    orders: number;
  };
};