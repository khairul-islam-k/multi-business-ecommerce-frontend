export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type StorefrontCategory = {
  id: string;
  businessId: string;

  name: string;
  description: string | null;
  imageUrl: string | null;

  parentId: string | null;
  sortOrder: number;
  status: CategoryStatus;

  createdAt: string;
  updatedAt: string;

  createdBy: string | null;
  updatedBy: string | null;

  deletedAt: string | null;
  deletedBy: string | null;
};

export type StorefrontCategoryTreeItem = {
  category: StorefrontCategory;
  children: StorefrontCategoryTreeItem[];
};