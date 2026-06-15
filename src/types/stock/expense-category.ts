export type ExpenseCategoryStatus = "ACTIVE" | "INACTIVE";

export type ExpenseCategoryPayload = {
  name: string;
  description: string;
  status: ExpenseCategoryStatus;
};

export type ExpenseCategoryResponse = {
  id: string;
  businessId: string;
  name: string;
  description: string;
  status: ExpenseCategoryStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};