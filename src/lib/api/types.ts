export type SortOrder = "asc" | "desc" | "ASC" | "DESC";
export type ApiId = string;

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
};

export type AuthBusiness = {
  id: ApiId;
  name: string;
  ownerUserId: ApiId;
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

export type PermissionAction = string;
export type RbacFeature = string;

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
