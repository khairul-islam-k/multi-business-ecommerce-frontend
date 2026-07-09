export type TaxStatus = "ACTIVE" | "INACTIVE";

export type TaxPayload = {
  name: string;
  rate: number;
  description: string;
  status: TaxStatus;
};


export type TaxResponse = {
  id: string;
  businessId: string;
  name: string;
  rate: number | undefined;
  description: string;
  status: TaxStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};