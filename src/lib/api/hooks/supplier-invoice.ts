"use client";

import { useQuery } from "@tanstack/react-query";

import { supplierInvoicesApi } from "../supplier-invoices";
import { apiQueryKeys } from "../query-keys";
import type { ApiId } from "../types";
import type { SupplierInvoiceQuery } from "../supplier-invoices";

export function useSupplierInvoicesQuery(
  businessId: ApiId,
  query?: SupplierInvoiceQuery,
) {
  return useQuery({
    queryKey: apiQueryKeys.supplierInvoices.list(businessId, query),
    queryFn: () => supplierInvoicesApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useSupplierInvoice(
  businessId: ApiId,
  supplierInvoiceId: ApiId,
) {
  return useQuery({
    queryKey: apiQueryKeys.supplierInvoices.detail(
      businessId,
      supplierInvoiceId,
    ),
    queryFn: () => supplierInvoicesApi.get(businessId, supplierInvoiceId),
    enabled: Boolean(businessId && supplierInvoiceId),
  });
}
