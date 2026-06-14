import { ResponseProduct } from "@/types/product/product";
import { ResponseVariant } from "@/types/product/variant";

export type PosCartItem = {
  id: string;
  product: Pick<ResponseProduct, 'id'| 'name'>;
  variant: Pick<ResponseVariant, 'id'| 'title'> | null;
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
