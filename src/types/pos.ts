export type PosPaymentMethod =
  | "CASH"
  | "COD"
  | "ONLINE_PAYMENT"
  | "OTHER";

export type PosSaleItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
  discountAmount: number;
};

export type PosPaymentInput = {
  paymentMethod: PosPaymentMethod;
  financeAccountId: string;
};

export type CreatePosSalePayload = {
  warehouseId?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: PosSaleItemInput[];
  payment: PosPaymentInput;
};

export type PosSaleResponse = Record<string, unknown>;
