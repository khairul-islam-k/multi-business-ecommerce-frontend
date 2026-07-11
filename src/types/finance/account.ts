export type AccountType =
  | "CASH"
  | "BANK"
  | "MOBILE_BANKING"
  | "PAYMENT_GATEWAY"
  | "OTHER";

export type AccountStatus = "ACTIVE" | "INACTIVE";

export type FinanceAccountPayload = {
  name: string;
  accountType: AccountType;
  accountNumber: string;
  currencyCode: string;
  openingBalance?: number;
  status: AccountStatus;
};

export type FinanceAccountResponse = {
  id: string;
  businessId: string;
  name: string;
  accountType: AccountType;
  accountNumber: string;
  currencyCode: string;
  openingBalance: string;
  currentBalance: string;
  status: AccountStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count: {
    transactions: number;
    expenses: number;
    orderPayments: number;
  };
};

export type AddMoneyPayload = {
  amount: number;
  note?: string;
};


export type FinanceTransactionType =
  | "DEBIT"
  | "CREDIT";

export type FinanceTransactionReferenceType =
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

export type FinanceTransactionResponse = {
  id: string;
  businessId: string;
  accountId: string;
  transactionNo: string;
  transactionType: FinanceTransactionType;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  referenceType: FinanceTransactionReferenceType;
  referenceId: string | null;
  note: string | null;
  createdBy: string;
  createdAt: string;
};