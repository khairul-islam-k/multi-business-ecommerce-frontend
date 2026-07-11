export type CreateProductReviewPayload = {
  productId: string;
  variantId?: string | null;
  rating: number;
  title: string;
  comment: string;
};



export type ProductReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ProductReviewResponse = {
  id: string;
  businessId: string;
  productId: string;
  customerId: string;
  variantId: string | null;

  rating: number;
  title: string;
  comment: string;

  reviewerName: string;
  reviewerEmail: string;
  reviewerPhone: string | null;

  status: ProductReviewStatus;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};