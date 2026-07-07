import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { templateInvoiceApi } from "../template-invoice";
import { invoiceQuery } from "@/types/template/invoice";

export function useTemplateInvoiceQuery(query?: invoiceQuery) {
    return useQuery({
        queryKey: apiQueryKeys.templateInvoice.list(query),
        queryFn: () => templateInvoiceApi.list(query),
    });
}

export function useTemplateInvoice(invoiceId: ApiId) {
    return useQuery({
        queryKey: apiQueryKeys.templateInvoice.detail(invoiceId),

        queryFn: () => {
            if (!invoiceId) {
                throw new Error("Business ID and Category ID are required");
            }

            return templateInvoiceApi.get(invoiceId);
        },

        enabled: Boolean(invoiceId),
    });
}