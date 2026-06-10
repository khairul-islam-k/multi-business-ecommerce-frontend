export type AccountType =
|"CASH"
|"BANK"
|"MOBILE_BANKING"
|"PAYMENT_GATEWAY"
|"OTHER";

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