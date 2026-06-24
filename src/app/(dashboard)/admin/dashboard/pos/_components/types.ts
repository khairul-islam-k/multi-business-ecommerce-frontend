import { ResponseProduct } from "@/types/product/product";
import { ResponseVariant } from "@/types/product/variant";

export type PosCartItem = {
  id: string;
  product: Pick<ResponseProduct, "id" | "name" | "taxId">;
  variant: Pick<ResponseVariant, 'id'| 'title'> | null;
  quantity: number;
  discountAmount: number;
  unitPrice: number;
  availableQuantity?: number;
};

export type PosCheckoutValues = {
  customerMode?: "existing" | "walk-in";
  customerId?: string;
  warehouseId?: string;
  paymentMethod?: string;
  financeAccountId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
};
