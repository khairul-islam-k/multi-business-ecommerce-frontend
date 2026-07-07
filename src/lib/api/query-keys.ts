import type {
  ApiId,
  BusinessQuery,
  EmployeeQuery,
  PermissionQuery,
  MediaQuery,
  PackageQuery,
  RoleAssignmentQuery,
  RoleQuery,
  TenantQuery,
  TenantSubscriptionQuery,
  CategoriesQuery,
} from "@/lib/api/types";
import type { OrderQuery, OrderReturnQuery } from "./orders";
import type {
  PaymentGatewayConfigQuery,
  PaymentGatewayQuery,
} from "@/types/payment-gateway";
import type { ProductReviewQuery } from "./product-reviews";
import type { SupplierInvoiceQuery } from "./supplier-invoices";

export const apiQueryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  businesses: {
    all: ["businesses"] as const,
    list: (query?: BusinessQuery) => ["businesses", "list", query] as const,
    detail: (businessId: ApiId) =>
      ["businesses", "detail", businessId] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    list: (query?: TenantQuery) => ["tenants", "list", query] as const,
    detail: (tenantId: ApiId) => ["tenants", "detail", tenantId] as const,
  },
  adminPackages: {
    all: ["admin-packages"] as const,
    plans: (query?: PackageQuery) =>
      ["admin-packages", "plans", query] as const,
    subscriptions: (query?: TenantSubscriptionQuery) =>
      ["admin-packages", "subscriptions", query] as const,
  },
  tenantPackages: {
    all: ["tenant-packages"] as const,
    plans: (query?: PackageQuery) =>
      ["tenant-packages", "plans", query] as const,
    current: ["tenant-packages", "current"] as const,
    history: (query?: PackageQuery) =>
      ["tenant-packages", "history", query] as const,
    usage: ["tenant-packages", "usage"] as const,
  },
  employees: {
    all: (businessId: ApiId) => ["employees", businessId] as const,
    list: (businessId: ApiId, query?: EmployeeQuery) =>
      ["employees", businessId, "list", query] as const,
    detail: (businessId: ApiId, employeeId: ApiId) =>
      ["employees", businessId, "detail", employeeId] as const,
  },
  roles: {
    all: (businessId: ApiId) => ["roles", businessId] as const,
    list: (businessId: ApiId, query?: RoleQuery) =>
      ["roles", businessId, "list", query] as const,
    detail: (businessId: ApiId, roleId: ApiId) =>
      ["roles", businessId, "detail", roleId] as const,
    assignments: (businessId: ApiId, query?: RoleAssignmentQuery) =>
      ["roles", businessId, "assignments", query] as const,
  },
  permissions: {
    available: ["permissions", "available"] as const,
    list: (businessId: ApiId, query?: PermissionQuery) =>
      ["permissions", businessId, "list", query] as const,
    role: (businessId: ApiId, roleId: ApiId) =>
      ["permissions", businessId, "role", roleId] as const,
  },
  media: {
    all: (businessId: ApiId) => ["media", businessId] as const,

    lists: (businessId: ApiId) =>
      [...apiQueryKeys.media.all(businessId), "list"] as const,

    list: (businessId: ApiId, query?: MediaQuery) =>
      [...apiQueryKeys.media.lists(businessId), query ?? {}] as const,
  },
  ProductCategories: {
    all: (businessId: ApiId) => ["categories", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["categories", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["categories", businessId, "detail", CategoryId] as const,
  },
  ProductBrands: {
    all: (businessId: ApiId) => ["brands", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["brands", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["brands", businessId, "detail", CategoryId] as const,
  },
  ProductUnit: {
    all: (businessId: ApiId) => ["units", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["units", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["units", businessId, "detail", CategoryId] as const,
  },
  ProductTags: {
    all: (businessId: ApiId) => ["tags", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["tags", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["tags", businessId, "detail", CategoryId] as const,
  },
  Product: {
    all: (businessId: ApiId) => ["products", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["products", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["products", businessId, "detail", CategoryId] as const,
  },
  ProductReviews: {
    all: (businessId: ApiId) => ["productReviews", businessId] as const,
    list: (businessId: ApiId, query?: ProductReviewQuery) =>
      ["productReviews", businessId, "list", query] as const,
  },
  ProductVariant: {
    all: (businessId: ApiId) => ["variant", businessId] as const,
    list: (businessId: ApiId, productId: ApiId, search?: string) =>
      ["variant", businessId, productId, "list", search] as const,
    options: (businessId: ApiId, productId: ApiId, selectedAttributes?: unknown) =>
      ["variant", businessId, productId, "options", selectedAttributes] as const,

    detail: (businessId: ApiId, productId: ApiId, variantId: ApiId) =>
      ["variant", businessId, "detail", productId, variantId] as const,
  },
  pos: {
    all: (businessId: ApiId) => ["pos", businessId] as const,
  },
  paymentGateway: {
    all: (businessId: ApiId) => ["paymentGateway", businessId] as const,
    gateways: (businessId: ApiId, query?: PaymentGatewayQuery) =>
      ["paymentGateway", businessId, "gateways", query] as const,
    configs: (businessId: ApiId, query?: PaymentGatewayConfigQuery) =>
      ["paymentGateway", businessId, "configs", query] as const,
  },
  courierConfig: {
    all: (businessId: ApiId) => ["courierConfig", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["courierConfig", businessId, "gateways", query] as const,
    listAreas: (businessId: ApiId,configId: ApiId, query?: CategoriesQuery) =>
      ["courierConfig", businessId, configId, "gateways", query] as const,
    configs: (businessId: ApiId, query?: CategoriesQuery) =>
      ["courierConfig", businessId, "configs", query] as const,
    pickUp: (businessId: ApiId, configId: ApiId) =>
      ["courierConfig", businessId, configId,  "configs"] as const,
  },
  ProductAttribute: {
    all: (businessId: ApiId) => ["attribute", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["attribute", businessId, "list", query] as const,

    detail: (businessId: ApiId, attributeId: ApiId) =>
      ["attribute", businessId, attributeId, "detail"] as const,
  },
  supplier: {
    all: (businessId: ApiId) => ["suppliers", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["suppliers", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["suppliers", businessId, "detail", CategoryId] as const,
  },
  supplierProduct: {
    all: (businessId: ApiId) => ["supplierProduct", businessId] as const,
    list: (businessId: ApiId, supplierId: ApiId, query?: CategoriesQuery) =>
      ["supplierProduct", businessId, supplierId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId, productMId: ApiId) =>
      ["supplierProduct", businessId, "detail", CategoryId, productMId] as const,
  },
  warehouse: {
    all: (businessId: ApiId) => ["warehouse", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["warehouse", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["warehouse", businessId, "detail", CategoryId] as const,
  },
  purchaseOrder: {
    all: (businessId: ApiId) => ["purchaseOrder", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["purchaseOrder", businessId, "list", query] as const,
    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["purchaseOrder", businessId, "detail", CategoryId] as const,
  },
  purchaseOrderReturn: {
    all: (businessId: ApiId) => ["purchaseOrderReturn", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["purchaseOrderReturn", businessId, "list", query] as const,
    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["purchaseOrderReturn", businessId, "detail", CategoryId] as const,
  },
  supplierInvoices: {
    all: (businessId: ApiId) => ["supplierInvoices", businessId] as const,
    list: (businessId: ApiId, query?: SupplierInvoiceQuery) =>
      ["supplierInvoices", businessId, "list", query] as const,
    detail: (businessId: ApiId, supplierInvoiceId: ApiId) =>
      ["supplierInvoices", businessId, "detail", supplierInvoiceId] as const,
  },
  tax: {
    all: (businessId: ApiId) => ["tax", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["tax", businessId, "list", query] as const,
    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["tax", businessId, "detail", CategoryId] as const,
  },
  emailVerify: {
    send: (email: string) => ["sendOtp", email] as const,
  },
  productStock: {
    all: (businessId: ApiId) => ["stocks", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["stocks", businessId, "list", query] as const,
    movementList: (businessId: ApiId, query?: CategoriesQuery) =>
      ["stocks", businessId, "movementList", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["stocks", businessId, "detail", CategoryId] as const,
  },
  stockAdjustment: {
    all: (businessId: ApiId) => ["stockAdjustment", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["stockAdjustment", businessId, "list", query] as const,

    detail: (businessId: ApiId, adjustmentId: ApiId) =>
      ["stockAdjustment", businessId, "detail", adjustmentId] as const,
  },
  stockTransfer: {
    all: (businessId: ApiId) => ["stockTransfer", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["stockTransfer", businessId, "list", query] as const,

    detail: (businessId: ApiId, adjustmentId: ApiId) =>
      ["stockTransfer", businessId, "detail", adjustmentId] as const,
  },
  financeAccount: {
    all: (businessId: ApiId) => ["financeAccount", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["financeAccount", businessId, "list", query] as const,
    listTransaction: (businessId: ApiId, accountId: ApiId, query?: CategoriesQuery) =>
      ["financeAccount", businessId, accountId, "listTraction", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["financeAccount", businessId, "detail", CategoryId] as const,
  },
  financePayable: {
    all: (businessId: ApiId) => ["financePayable", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["financePayable", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["financePayable", businessId, "detail", CategoryId] as const,
  },
  financeReceivable: {
    all: (businessId: ApiId) => ["financeReceivable", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["financeReceivable", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["financeReceivable", businessId, "detail", CategoryId] as const,
  },
  financeExpenseCategory: {
    all: (businessId: ApiId) => ["financeExpenseCategory", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["financeExpenseCategory", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["financeExpenseCategory", businessId, "detail", CategoryId] as const,
  },
  financeExpense: {
    all: (businessId: ApiId) => ["financeExpense", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["financeExpense", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["financeExpense", businessId, "detail", CategoryId] as const,
  },
  customer: {
    all: (businessId: ApiId) => ["customer", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["customer", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["customer", businessId, "detail", CategoryId] as const,
    orders: (businessId: ApiId, customerId: ApiId, query?: OrderQuery) =>
      ["customer", businessId, "detail", customerId, "orders", query] as const,
  },
  customerAddress: {
    all: (businessId: ApiId) => ["customerAddress", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["customerAddress", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["customerAddress", businessId, "detail", CategoryId] as const,
  },
  orders: {
    all: (businessId: ApiId) => ["orders", businessId] as const,
    list: (businessId: ApiId, query?: OrderQuery) =>
      ["orders", businessId, "list", query] as const,
    detail: (businessId: ApiId, orderId: ApiId) =>
      ["orders", businessId, "detail", orderId] as const,
    returns: (businessId: ApiId, query?: OrderReturnQuery) =>
      ["orders", businessId, "returns", query] as const,
    returnDetail: (businessId: ApiId, returnId: ApiId) =>
      ["orders", businessId, "returns", "detail", returnId] as const,
  },
  website: {
    all: (businessId: ApiId) => ["website", businessId] as const,
    templates: (businessId: ApiId) =>
      ["website", businessId, "templates"] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["website", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["website", businessId, "detail", CategoryId] as const,
  },

  publicWebsite: {
    all: (businessId: ApiId) => ["publicWebsite", businessId] as const,
    list: (query?: CategoriesQuery) =>
      ["publicWebsite", "list", query] as const,
    listTag: (query?: CategoriesQuery) =>
      ["publicWebsite", "listTag", query] as const,
    listProducts: (query?: CategoriesQuery) =>
      ["publicWebsite", "listProducts", query] as const,

    detail: (slug: ApiId) =>
      ["publicWebsite", slug, "detail"] as const,
  },

  productReview: {
    all: () => ["productReview"] as const,
    list: (query?: CategoriesQuery) =>
      ["productReview", "list", query] as const,

    detailProfile: () =>
      ["detailProfile"] as const,
  },

  addCart: {
    all: () => ["addCart"] as const,
    list: (query?: CategoriesQuery) =>
      ["addCart", "list", query] as const,

    detail: () =>
      ["addCart", "detail"] as const,

    detailOldCart: (cartId: ApiId) =>
      ["addCart", cartId, "detail"] as const,

    detailActive: () =>
      ["addCart", "detailActive"] as const,
  },

  customerAddressTemplate: {
    all: () => ["customer"] as const,
    list: () =>
      ["customer", "list"] as const,

    detail: (addressId: ApiId) =>
      ["customer", "detail", addressId] as const,
  },
  paymentTemplate: {
    all: () => ["paymentTemplate"] as const,
    list: () =>
      ["paymentTemplate", "list"] as const,

    detail: (addressId: ApiId) =>
      ["paymentTemplate", "detail", addressId] as const,
  },

  templateOrderHistory: {
    all: ()=> ["orderHistory"] as const,
    list: (query?: CategoriesQuery) =>
      ["orderHistory", "list", query] as const,

    detail: (orderId: ApiId) =>
      ["orderHistory", orderId, "detail"] as const,
  },

  templateOrderReturn: {
    all: ()=> ["templateOrderReturn"] as const,
    list: (query?: CategoriesQuery) =>
      ["templateOrderReturn", "list", query] as const,

    detail: (orderId: ApiId) =>
      ["templateOrderReturn", orderId, "detail"] as const,
  },
  templateProductWishList: {
    all: ()=> ["wishList"] as const,
    list: (query?: CategoriesQuery) =>
      ["wishList", "list", query] as const,

    detail: (orderId: ApiId) =>
      ["wishList", orderId, "detail"] as const,
  },

  templateCourier: {
    all: ()=> ["templateCourier"] as const,
    list: () =>
      ["templateCourier", "list"] as const,
    listArea: (configId: ApiId) =>
      ["templateCourier", configId, "listArea"] as const,

    detail: (orderId: ApiId) =>
      ["templateCourier", orderId, "detail"] as const,
  },

  templateResolve: {
    detail: () =>
      ["categories", "detail"] as const,
  },

};
