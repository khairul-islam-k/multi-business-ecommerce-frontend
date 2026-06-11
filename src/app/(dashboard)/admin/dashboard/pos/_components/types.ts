import { ResponseProduct } from "@/types/product/product";
import { ResponseVariant } from "@/types/product/variant";

export type PosCartItem = {
  id: string;
  product: ResponseProduct;
  variant: ResponseVariant | null;
  quantity: number;
  discountAmount: number;
  unitPrice: number;
  availableQuantity?: number;
};

export type PosCheckoutValues = {
  warehouseId?: string;
  taxId?: string;
  paymentMethod?: string;
  financeAccountId?: string;
  customerName?: string;
  customerPhone?: string;
};
