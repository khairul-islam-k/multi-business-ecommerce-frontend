export type PurchaseReturnStatus =
|"DRAFT"
|"PENDING"
|"COMPLETED"
|"CANCELLED";
export type SupplierStatus = "ACTIVE" | "INACTIVE";
export type InvoiceStatus =
    | "UNPAID"
    | "PARTIALLY_PAID"
    | "PAID"
    | "CANCELLED"
export type PurchaseOrderStatus =
    | "DRAFT"
    | "ORDERED"
    | "RECEIVED"
    | "CANCELLED";
export type TaxStatus = "ACTIVE" | "INACTIVE";

export type PurchaseReturnResponse = {
    id: string;
    businessId: string;
    purchaseOrderId: string;
    supplierId: string;
    supplierInvoiceId: string;
    warehouseId: string;
    taxId: string | null;

    returnNo: string;
    returnDate: string;
    reason: string;
    status: PurchaseReturnStatus;

    subtotal: string;
    discountTotal: string;
    taxRate: string;
    taxTotal: string;
    totalAmount: string;

    createdAt: string;
    updatedAt: string;
    createdBy: string;

    items: PurchaseReturnItem[];
    purchaseOrder: PurchaseOrder;
    supplier: Supplier;
    supplierInvoice: SupplierInvoice;
    tax: Tax | null;
};

export type PurchaseReturnItem = {
    id: string;
    purchaseReturnId: string;
    productId: string;
    variantId: string | null;

    quantity: string;
    unitCost: string;
    discountAmount: string;
    taxAmount: string;
    lineTotal: string;
    reason: string;

    createdAt: string;
    updatedAt: string;
};

export type PurchaseOrder = {
    id: string;
    businessId: string;
    supplierId: string;
    warehouseId: string;
    taxId: string | null;

    purchaseOrderNo: string;
    orderDate: string;
    expectedDeliveryDate: string | null;
    status: PurchaseOrderStatus;
    note: string | null;

    subtotal: string;
    discountTotal: string;
    shippingCost: string;
    taxRate: string;
    taxTotal: string;
    totalAmount: string;

    approvedAt: string | null;
    approvedBy: string | null;

    createdAt: string;
    updatedAt: string;
    createdBy: string;
    deletedAt: string | null;
};

export type Supplier = {
    id: string;
    businessId: string;

    name: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    note: string | null;
    status: SupplierStatus;

    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    deletedAt: string | null;
};

export type SupplierInvoice = {
    id: string;
    businessId: string;
    purchaseOrderId: string;
    supplierId: string;
    taxId: string | null;

    invoiceNo: string;
    invoiceDate: string;
    dueDate: string | null;
    status: InvoiceStatus;
    note: string | null;

    subtotal: string;
    discountTotal: string;
    shippingCost: string;
    taxRate: string;
    taxTotal: string;
    totalAmount: string;
    paidAmount: string;

    createdAt: string;
    updatedAt: string;
    createdBy: string;
    deletedAt: string | null;
};

export type Tax = {
    id: string;
    businessId: string;

    name: string;
    rate: string;
    description: string | null;
    status: TaxStatus;

    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    deletedAt: string | null;
};