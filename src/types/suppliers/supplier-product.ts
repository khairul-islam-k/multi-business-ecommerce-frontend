export type CommonStatus = "ACTIVE" | "INACTIVE";

export type SupplierProductProduct = {
    id: string;
    businessId: string;
    categoryId: string;
    brandId: string | null;
    unitId: string;
    name: string;
    slug: string;
    sku: string;
    barcode: string;
    description: string | null;
    price: string;
    weight: string | null;
    status: CommonStatus;
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type SupplierProductSupplier = {
    id: string;
    businessId: string;
    name: string;
    companyName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    note: string | null;
    status: CommonStatus;
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type SupplierProductVariant = {
    id: string;
    businessId: string;
    productId: string;
    title: string;
    sku: string;
    barcode: string;
    priceOverride: string | null;
    weight: string | null;
    status: CommonStatus;
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type SupplierProductMap = {
    id: string;
    businessId: string;
    supplierId: string;
    productId: string;
    variantId: string | null;
    itemKey: string;
    supplierSku: string | null;
    lastPurchasePrice: string;
    minOrderQuantity: number | null;
    leadTimeDays: number | null;
    status: CommonStatus;
    createdAt: string;
    updatedAt: string;
};

export type SupplierProductResponse = {
    supplierProduct: SupplierProductMap;
    supplier: SupplierProductSupplier;
    product: SupplierProductProduct;
    variant: SupplierProductVariant | null;
};


export type SupplierProductPayload = {
    productId: string;
    variantId?: string | null;
    supplierSku?: string;
    lastPurchasePrice?: number;
    minOrderQuantity?: number | null;
    leadTimeDays?: number | null;
    status: CommonStatus;
};

export type SupplierProductQuery = {
    page?: number;
    limit?: number;
    search?: string;
    supplierId?: string;
    status?: CommonStatus;
};
