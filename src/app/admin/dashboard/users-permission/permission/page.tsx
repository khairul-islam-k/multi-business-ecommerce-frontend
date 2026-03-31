"use client";

import { useState } from "react";
import "antd/dist/reset.css";
import UsersPermission from "./_components/UsersPermission";
import { Button } from "antd";

// Define roles
const roles = [
  "Admin",
  "Manager",
  "Sales Associate",
  "Inventory Clerk",
  "Customer Support",
  "Viewer",
] as const;

// Define permissions
const permissions = [
  "View Users",
  "Create Users",
  "Edit Users",
  "Delete Users",
  "View Orders",
  "Edit Orders",
  "Delete Orders",
  "View Inventory",
  "Edit Inventory",
  "View Reports",
  "Manage Settings",
] as const;

// Type for roles and permissions
type Role = typeof roles[number];
type Permission = typeof permissions[number];
type RolePermissions = Record<Role, Permission[]>;

export default function PermissionsPage() {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
    Admin: [...permissions],
    Manager: ["View Users", "Edit Users", "View Orders", "Edit Orders", "View Reports"],
    "Sales Associate": ["View Users", "View Orders"],
    "Inventory Clerk": ["View Inventory", "Edit Inventory"],
    "Customer Support": ["View Users", "View Orders"],
    Viewer: ["View Users"],
  });

  console.log(rolePermissions)

  return (
    <div style={{ padding: 24 }}>
      <UsersPermission
        rolePermissions={rolePermissions}
        setRolePermissions={setRolePermissions}
      />

      <Button
        type="primary"
        style={{ marginTop: 16 }}
        onClick={() => console.log("Saved Permissions:", rolePermissions)}
      >
        Save Permissions
      </Button>
    </div>
  );
}