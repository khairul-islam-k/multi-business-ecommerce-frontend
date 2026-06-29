import type { ApiId, ListQuery } from "@/lib/api/types";
import type { FinanceAccountResponse } from "@/types/finance/account";

export type PaymentGatewayProvider = "SSLCOMMERZ" | "AAMARPAY" | "SURJOPAY";
export type PaymentGatewayMode = "SANDBOX" | "LIVE";
export type PaymentGatewayStatus = "ACTIVE" | "INACTIVE";

export type PaymentGatewayQuery = Pick<
  ListQuery,
  "page" | "limit" | "search"
> & {
  status?: PaymentGatewayStatus;
};

export type PaymentGatewayConfigQuery = PaymentGatewayQuery & {
  provider?: PaymentGatewayProvider;
  mode?: PaymentGatewayMode;
};

export type PaymentGatewayDefinition = {
  id: ApiId;
  provider?: PaymentGatewayProvider;
  name?: string;
  displayName?: string;
  slug?: string;
  code?: string;
  description?: string | null;
  status?: PaymentGatewayStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type PaymentGatewayConfigPayload = {
  provider: PaymentGatewayProvider;
  financeAccountId: ApiId;
  mode: PaymentGatewayMode;
  status?: PaymentGatewayStatus;
  configData: Record<string, unknown>;
};

export type UpdatePaymentGatewayConfigPayload =
  Partial<PaymentGatewayConfigPayload>;

export type GatewayProvider = "SSLCOMMERZ" | "AAMARPAY" | "SURJOPAY";

export type PaymentGateway = {
  id: string;
  name: string;
  code: GatewayProvider;
  description: string | null;
  sortOrder: number;
  status: PaymentGatewayStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaymentGatewayConfig = {
  id: ApiId;
  businessId: ApiId;
  provider: PaymentGatewayProvider;
  financeAccountId: ApiId;
  financeAccount?: FinanceAccountResponse | null;
  mode: PaymentGatewayMode;
  status: PaymentGatewayStatus;
  configData: Record<string, unknown>;
  gateway:PaymentGateway;
  createdAt?: string;
  updatedAt?: string;
};


export type GatewayMode = "SANDBOX" | "LIVE";

export type GatewayStatus = "ACTIVE" | "INACTIVE";

export type PaymentGatewayPayload = {
  configs: {
    provider: GatewayProvider;
    financeAccountId: string | undefined;
    mode: GatewayMode;
    status: GatewayStatus;
    configData: Record<string, string>;
  }[];
};
