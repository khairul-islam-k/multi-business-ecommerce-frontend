export type UnitStatus = "ACTIVE" | "INACTIVE";

export type UnitPayload = {
  name: string;
  status: UnitStatus;
};

export type ResponseUnit = {
  id: string;
  businessId: string;
  name: string;
  status: UnitStatus;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  _count?: {
    products: number;
  };
};