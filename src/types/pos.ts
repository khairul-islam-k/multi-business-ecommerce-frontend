export type PosPaymentMethod =
  | "CASH"
  | "COD"
  | "BKASH"
  | "NAGAD"
  | "CARD"
  | "BANK_TRANSFER"
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
  taxId: string;
  customerName?: string;
  customerPhone?: string;
  items: PosSaleItemInput[];
  payment: PosPaymentInput;
};

export type PosSaleResponse = Record<string, unknown>;
