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
    openingBalance: number;
    status: AccountStatus;
};