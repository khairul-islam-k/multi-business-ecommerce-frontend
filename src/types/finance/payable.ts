import { ListQuery } from "@/lib/api";

export type PartyType =
  | "CUSTOMER"
  | "SUPPLIER"
  | "COURIER"
  | "PAYMENT_GATEWAY"
  | "EMPLOYEE"
  | "OTHER";

export type SourceType =
  | "ORDER"
  | "INVOICE"
  | "SUPPLIER_INVOICE"
  | "SUPPLIER_PAYMENT"
  | "SUPPLIER_RETURN"
  | "COURIER_RECEIVABLE"
  | "COURIER_SETTLEMENT"
  | "EXPENSE"
  | "REFUND"
  | "MANUAL";

export type PayableStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED";

export type PayableResponse = {
  id: string;
  businessId: string;
  payableNo: string;
  partyType: PartyType;
  partyId: string;
  sourceType: SourceType;
  sourceId: string;
  totalAmount: string;
  paidAmount: string;
  status: PayableStatus;
  dueDate: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PayableQuery = ListQuery & {
  status?: PayableStatus;
};


export type ReceivableStatus =
  | "PENDING"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export type ReceivableResponse = {
  id: string;
  businessId: string;
  receivableNo: string;
  partyType: PartyType;
  partyId: string;
  sourceType: SourceType;
  sourceId: string;
  totalAmount: string;
  receivedAmount: string;
  status: ReceivableStatus;
  dueDate: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReceivableQuery = ListQuery & {
  status?: ReceivableStatus;
};

type AccountType =
|"CASH"
|"BANK_TRANSFER"
|"BKASH"
|"NAGAD"
|"CHEQUE"
|"OTHER";

export type PayPayableFormValues = {
  financeAccountId: string;
  amount: number;
  paymentMethod: AccountType;
  note?: string;
};

export type ReceiveReceivableFormValues = {
  financeAccountId: string;
  amount: number;
  note?: string;
};