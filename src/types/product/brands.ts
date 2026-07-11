export type BrandStatus = "ACTIVE" | "INACTIVE";

export type BrandPayload = {
  name: string;
  description: string;
  logoUrl: string;
  status: BrandStatus;
};

export type ResponseBrand = {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  status: BrandStatus;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  _count?: {
    products: number;
  };
};
