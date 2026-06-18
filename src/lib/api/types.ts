export type SortOrder = "asc" | "desc" | "ASC" | "DESC";
export type ApiId = string;
export type TEmail = string;

export type SendOtpResponse = {
  data: {
    verificationId: string;
    email: string;
    expiresAt: string;
  };
  message: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type VerifiedResponse = {
  data: unknown;
  message: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  items: T[];
};

export type ApiPaginatedResponse<T> = {
  meta: PaginatedResponse<T>["meta"];
  data: T[];
};

export type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  includeDeleted?: boolean;
};

export type SystemUserType = "ADMIN" | "TENANT" | "EMPLOYEE" | string;
export type SystemUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
export type BusinessStatus = "TRIAL" | "ACTIVE" | "INACTIVE" | string;
export type RoleStatus = "ACTIVE" | "INACTIVE" | string;
export type AssignmentStatus = "ACTIVE" | "INACTIVE" | "EXPIRED" | string;
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;

export type SystemUser = {
  id: ApiId;
  name: string;
  email: string;
  phone?: string | null;
  imageUrl?: string | null;
  avatarUrl?: string | null;
  profile?: EmployeeProfile | null;
  type: SystemUserType;
  status?: SystemUserStatus;
  createdAt?: string;
  updatedAt?: string;
  businessId: string;
};

export type AuthBusiness = {
  id: ApiId;
  name: string;
  ownerUserId: ApiId | undefined;
  members?: Array<{
    id: ApiId;
    userId: ApiId;
  }>;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: SystemUser;
  selectedBusiness: AuthBusiness | null;
  businesses?: AuthBusiness[];
  activeSubscription: unknown | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  businessName?: string;
};

export type RegisterResponse = {
  user: SystemUser;
  selectedBusiness: Business;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RefreshPayload = {
  refreshToken: string;
  businessId?: ApiId | null;
};

export type SelectBusinessPayload = {
  businessId: ApiId;
  refreshToken: string;
};

export type LogoutPayload = {
  refreshToken: string;
};

export type MessageResponse = {
  message: string;
};

export type BusinessSetting = {
  id?: ApiId;
  orderPrefix?: string;
  invoicePrefix?: string;
  defaultLanguage?: string;
  defaultCurrency?: string;
  timezone?: string;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
  autoConfirmOrder?: boolean;
  codEnabled?: boolean;
  onlinePaymentEnabled?: boolean;
};

export type BusinessBranding = {
  id?: ApiId;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  fontFamily?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type Business = {
  id: ApiId;
  name: string;
  slug?: string;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  currencyCode?: string;
  timezone?: string;
  status?: BusinessStatus;
  ownerUserId?: ApiId;
  ownerUser?: SystemUser;
  settings?: BusinessSetting | null;
  branding?: BusinessBranding | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    members?: number;
    roles?: number;
  };
};

export type BusinessQuery = ListQuery & {
  status?: BusinessStatus;
  currencyCode?: string;
  country?: string;
};

export type CategoriesQuery = ListQuery & {
  status?: RoleStatus;
};

export type BusinessPayload = {
  name: string;
  slug?: string;
  email?: string;
  phone?: string;
  country?: string;
  currencyCode?: string;
  timezone?: string;
  status?: BusinessStatus;
  settings?: BusinessSetting;
  branding?: BusinessBranding;
};

export type MediaAsset = {
  id: ApiId;
  businessId?: ApiId;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  altText?: string | null;
  tags: MediaTag[];
  createdAt?: string;
  updatedAt?: string;
};

export type MediaTag = {
  id: ApiId;
  name: string;
  status: string;
};

export type MediaQuery = {
  tags?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "fileName" | "fileSize";
  sortOrder?: "asc" | "desc";
};

export type UploadMediaPayload = {
  file: File;
  altText?: string;
  tags?: string;
};

export type UploadMediaBulkPayload = {
  files: File[];
  altText?: string;
  tags?: string;
};

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  profile?: EmployeeProfile;
};

export type Tenant = SystemUser & {
  _count?: {
    ownedBusinesses?: number;
    tenantUsers?: number;
  };
};

export type TenantDetail = Tenant & {
  profile?: EmployeeProfile | null;
  ownedBusinesses?: Business[];
};

export type TenantQuery = ListQuery & {
  status?: SystemUserStatus;
};

export type UpdateTenantStatusPayload = {
  status: SystemUserStatus;
};

export type PermissionAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | string;
export type RbacFeature =
  | "MEDIA_MANAGEMENT"
  | "PACKAGE_MANAGEMENT"
  | "PRODUCT_MANAGEMENT"
  | "SUPPLIER_MANAGEMENT"
  | "INVENTORY_MANAGEMENT"
  | "ORDER_MANAGEMENT"
  | "POS_MANAGEMENT"
  | "PAYMENT_MANAGEMENT"
  | "FINANCE_MANAGEMENT"
  | "COURIER_MANAGEMENT"
  | "BUSINESS_MANAGEMENT"
  | "EMPLOYEE_MANAGEMENT"
  | "ROLE_PERMISSION_MANAGEMENT"
  | string;

export type PermissionItem = {
  feature: RbacFeature;
  action: PermissionAction;
};

export type Permission = PermissionItem & {
  id?: ApiId;
  roleId?: ApiId;
  businessId?: ApiId;
  createdAt?: string;
};

export type PermissionQuery = {
  page?: number;
  limit?: number;
  roleId?: ApiId;
  feature?: string;
  action?: string;
};

export type PermissionPayload = {
  permissions: PermissionItem[];
};

export type Role = {
  id: ApiId;
  businessId?: ApiId;
  name: string;
  description?: string | null;
  status?: RoleStatus;
  permissions?: PermissionItem[];
  createdAt?: string;
  updatedAt?: string;
};

export type RoleQuery = ListQuery & {
  status?: RoleStatus;
};

export type RolePayload = {
  name: string;
  description?: string;
  status?: RoleStatus;
  permissions?: PermissionItem[];
};

export type RoleAssignment = {
  id: ApiId;
  userId: ApiId;
  roleId: ApiId;
  status?: AssignmentStatus;
  expiresAt?: string | null;
  user?: SystemUser;
  role?: Role;
  createdAt?: string;
};

export type RoleAssignmentQuery = {
  page?: number;
  limit?: number;
  userId?: ApiId;
  roleId?: ApiId;
  status?: AssignmentStatus;
};

export type AssignRolePayload = {
  userId: ApiId;
  expiresAt?: string;
};

export type UpdateRoleAssignmentPayload = {
  status?: AssignmentStatus;
  expiresAt?: string | null;
};

export type EmployeeProfile = {
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
};

export type Employee = {
  id: ApiId;
  name: string;
  email: string;
  phone?: string | null;
  status?: EmployeeStatus;
  profile?: EmployeeProfile | null;
  roles?: Role[];
  userRoleMaps?: Array<{
    id: ApiId;
    status?: AssignmentStatus;
    assignedAt?: string;
    expiresAt?: string | null;
    role: Role;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export type EmployeeQuery = ListQuery & {
  status?: EmployeeStatus;
};

export type CreateEmployeePayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  status?: EmployeeStatus;
  profile?: EmployeeProfile;
  roleIds?: ApiId[];
};

export type UpdateEmployeePayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  password?: string;
  profile?: EmployeeProfile;
};

export type UpdateEmployeeStatusPayload = {
  status: EmployeeStatus;
};

export type AssignEmployeeRolesPayload = {
  roleIds: ApiId[];
};

export type PackageBillingCycle = "FREE" | "MONTHLY" | "YEARLY" | "LIFETIME";

export type PackageStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type PackageResetCycle = "LIFETIME" | "DAILY" | "MONTHLY" | "YEARLY";

export type PackageLimitKey =
  | "MAX_MEDIAS"
  | "MAX_PRODUCTS"
  | "MAX_EMPLOYEES"
  | "MAX_BUSINESSES"
  | "MAX_WEBSITES";

export type PackageSubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export type PackageSubscriptionAddonStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

export type PackagePaymentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export type PackagePaymentType = "PLAN_CHANGE" | "ADDON_PURCHASE";

export type PackagePlanLimit = {
  id?: ApiId;
  packageId?: ApiId;
  limitKey: PackageLimitKey;
  limitValue: number;
  resetCycle?: PackageResetCycle;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PackageFeature = {
  id: string;
  packageId?: string;
  title: string;
  description: string | null;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
};

export type PackagePlan = {
  id: ApiId;
  name: string;
  description?: string | null;
  price: number | string;
  billingCycle: PackageBillingCycle;
  currencyCode: string;
  freeTrialDays: number;
  isDefault: boolean;
  status: PackageStatus;
  sortOrder: number;
  limits?: PackagePlanLimit[];
  features?: PackageFeature[];
  _count?: {
    subscriptions?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type PackageAddon = {
  id: ApiId;
  name: string;
  description?: string | null;
  price: number | string;
  billingCycle: PackageBillingCycle;
  currencyCode: string;
  limitKey: PackageLimitKey;
  limitValue: number;
  resetCycle?: PackageResetCycle;
  status: PackageStatus;
  sortOrder: number;
  createdBy?: ApiId | null;
  updatedBy?: ApiId | null;
  _count?: {
    subscriptions?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type PackagePlanPayload = {
  name: string;
  description?: string;
  price: number;
  billingCycle: PackageBillingCycle;
  currencyCode?: string;
  freeTrialDays?: number;
  isDefault?: boolean;
  status?: PackageStatus;
  sortOrder?: number;
  limits?: PackagePlanLimit[];
  features: PackageFeature[];
};

export type PackageAddonPayload = {
  name: string;
  description?: string;
  price: number;
  billingCycle: PackageBillingCycle;
  currencyCode?: string;
  limitKey: PackageLimitKey;
  limitValue: number;
  resetCycle?: PackageResetCycle;
  status?: PackageStatus;
  sortOrder?: number;
};

export type PackageQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: PackageStatus;
};

export type TenantSubscriptionQuery = {
  page?: number;
  limit?: number;
  status?: PackageSubscriptionStatus;
  tenantId?: ApiId;
};

export type PackageSubscriptionAddon = {
  id: ApiId;
  subscriptionId: ApiId;
  addonId: ApiId;
  quantity: number;
  status: PackageSubscriptionAddonStatus;
  price: number | string;
  currencyCode: string;
  addon?: PackageAddon;
  createdAt?: string;
  updatedAt?: string;
};

export type PackageUsageCounter = {
  id: ApiId;
  subscriptionId: ApiId;
  limitKey: PackageLimitKey;
  usedValue: number;
  periodStart: string;
  periodEnd: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PackageMockPayment = {
  id: ApiId;
  tenantId: ApiId;
  subscriptionId?: ApiId | null;
  planId?: ApiId | null;
  addonId?: ApiId | null;
  type: PackagePaymentType;
  status: PackagePaymentStatus;
  amount: number | string;
  currencyCode: string;
  quantity: number;
  metadata?: unknown;
  expiresAt: string;
  confirmedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  plan?: PackagePlan;
  addon?: PackageAddon;
};

export type TenantSubscription = {
  id: ApiId;
  tenantId: ApiId;
  packageId: ApiId;
  status: PackageSubscriptionStatus;
  billingCycle: PackageBillingCycle;
  price: number | string;
  currencyCode: string;
  startedAt: string;
  trialEndsAt?: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  endedAt?: string | null;
  endReason?: string | null;
  autoRenew: boolean;
  tenant?: Pick<SystemUser, "id" | "name" | "email" | "status">;
  package?: PackagePlan;
  addons?: PackageSubscriptionAddon[];
  usageCounters?: PackageUsageCounter[];
  mockPayments?: PackageMockPayment[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTenantSubscriptionPayload = {
  tenantId: ApiId;
  planId: ApiId;
};

export type ChangeTenantSubscriptionPlanPayload = {
  planId: ApiId;
};

export type CancelPackageSubscriptionPayload = {
  reason?: string;
};

export type CheckoutPackageAddonPayload = {
  quantity?: number;
};

export type PackageUsageSummaryItem = {
  limitKey: PackageLimitKey;
  allowed: number;
  liveUsed: number;
  consumed: number;
  used: number;
  remaining: number;
};

export type ConfirmPackagePaymentResult =
  | {
      payment: PackageMockPayment;
      subscription: TenantSubscription;
    }
  | {
      payment: PackageMockPayment;
      subscriptionAddon: PackageSubscriptionAddon;
    };
