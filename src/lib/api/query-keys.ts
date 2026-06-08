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
    addons: (query?: PackageQuery) =>
      ["admin-packages", "addons", query] as const,
    subscriptions: (query?: TenantSubscriptionQuery) =>
      ["admin-packages", "subscriptions", query] as const,
  },
  tenantPackages: {
    all: ["tenant-packages"] as const,
    plans: (query?: PackageQuery) =>
      ["tenant-packages", "plans", query] as const,
    addons: (query?: PackageQuery) =>
      ["tenant-packages", "addons", query] as const,
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
  ProductVariant: {
    all: (businessId: ApiId) => ["variant", businessId] as const,
    list: (businessId: ApiId, productId: ApiId, search?: string) =>
      ["variant", businessId, productId, "list", search] as const,

    detail: (businessId: ApiId, productId: ApiId, variantId: ApiId) =>
      ["variant", businessId, "detail", productId, variantId] as const,
  },
  ProductAttribute: {
    all: (businessId: ApiId) => ["attribute", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["attribute", businessId, "list", query] as const,

    detail: (businessId: ApiId,  attributeId: ApiId) =>
      ["attribute", businessId, attributeId, "detail"] as const,
  },
  supplier: {
    all: (businessId: ApiId) => ["suppliers", businessId] as const,
    list: (businessId: ApiId, query?: CategoriesQuery) =>
      ["suppliers", businessId, "list", query] as const,

    detail: (businessId: ApiId, CategoryId: ApiId) =>
      ["suppliers", businessId, "detail", CategoryId] as const,
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
};
