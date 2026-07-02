export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type StorefrontCategory = {
  id: string;
  businessId: string;

  name: string;
  description: string | null;
  imageUrl: string | null;

  parentId: string | null;
  status: CategoryStatus;

  createdAt: string;
  updatedAt: string;

  createdBy: string | null;
  updatedBy: string | null;

  deletedAt: string | null;
  deletedBy: string | null;
  _count: {
    children: number;
    products: number;
  };
};

export type StorefrontCategoryTreeItem = {
  category: StorefrontCategory;
  children: StorefrontCategoryTreeItem[];
};

// tags

export type ProductTagResponse = {
  id: string;
  businessId: string;

  name: string;
  status: CategoryStatus;
  isFeatured: boolean;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
