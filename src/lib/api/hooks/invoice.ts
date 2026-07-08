import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { tenantInvoiceApi } from "../invoice";
import { invoiceQuery } from "@/types/template/invoice";

export function useOrderInvoiceQuery(businessId: ApiId, query?: invoiceQuery) {
  return useQuery({
    queryKey: apiQueryKeys.orderInvoices.list(businessId, query),
    queryFn: () => tenantInvoiceApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useOrderInvoice(businessId: ApiId, invoiceId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductCategories.detail(businessId, invoiceId),

    queryFn: () => {
      if (!businessId || !invoiceId) {
        throw new Error("Business ID and Category ID are required");
      }

      return tenantInvoiceApi.get(businessId, invoiceId);
    },

    enabled: Boolean(businessId && invoiceId),
  });
}