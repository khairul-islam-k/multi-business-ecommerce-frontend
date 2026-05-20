export type MediaFileType = "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT";

export type MediaStatus = "ACTIVE" | "INACTIVE";

export type MediaTag = {
    id: string;
    name: string;
};

export type MediaFile = {
    id: string;
    businessId: string;
    uploadedBy: string;
    fileName: string;
    fileUrl: string;
    fileType: MediaFileType;
    mimeType: string;
    fileSize: number;
    altText: string | null;
    status: MediaStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    tags: MediaTag[];
};

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type ProductCategoryPayload = {
    name: string;
    description: string;
    imageUrl: string;
    parentId?: string | null;
    status: CategoryStatus;
    sortOrder: number;
};

export type ProductCategoryCount = {
    children: number;
    products: number;
};


export type CategoryParent = {
  id: string;
  businessId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
};

export type CategoryChild = {
  id: string;
  businessId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
};

export type ResponseCategory = {
  id: string;
  businessId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: CategoryStatus;

  parent: CategoryParent | null;
  children: CategoryChild[];

  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;

  _count: {
    children: number;
    products: number;
  };
};