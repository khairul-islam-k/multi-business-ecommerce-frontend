import type {
  BusinessQuery,
  EmployeeQuery,
  PermissionQuery,
  RoleAssignmentQuery,
  RoleQuery,
} from "@/lib/api/types";

export const apiQueryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  businesses: {
    all: ["businesses"] as const,
    list: (query?: BusinessQuery) => ["businesses", "list", query] as const,
    detail: (businessId: number) =>
      ["businesses", "detail", businessId] as const,
  },
  employees: {
    all: (businessId: number) => ["employees", businessId] as const,
    list: (businessId: number, query?: EmployeeQuery) =>
      ["employees", businessId, "list", query] as const,
    detail: (businessId: number, employeeId: number) =>
      ["employees", businessId, "detail", employeeId] as const,
  },
  roles: {
    all: (businessId: number) => ["roles", businessId] as const,
    list: (businessId: number, query?: RoleQuery) =>
      ["roles", businessId, "list", query] as const,
    detail: (businessId: number, roleId: number) =>
      ["roles", businessId, "detail", roleId] as const,
    assignments: (businessId: number, query?: RoleAssignmentQuery) =>
      ["roles", businessId, "assignments", query] as const,
  },
  permissions: {
    available: ["permissions", "available"] as const,
    list: (businessId: number, query?: PermissionQuery) =>
      ["permissions", businessId, "list", query] as const,
    role: (businessId: number, roleId: number) =>
      ["permissions", businessId, "role", roleId] as const,
  },
};
