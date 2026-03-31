"use client";

import { Table, Checkbox, Typography } from "antd";
import "antd/dist/reset.css";

const { Title } = Typography;

// Import types
type Role = "Admin" | "Manager" | "Sales Associate" | "Inventory Clerk" | "Customer Support" | "Viewer";
type Permission =
  | "View Users"
  | "Create Users"
  | "Edit Users"
  | "Delete Users"
  | "View Orders"
  | "Edit Orders"
  | "Delete Orders"
  | "View Inventory"
  | "Edit Inventory"
  | "View Reports"
  | "Manage Settings";

type RolePermissions = Record<Role, Permission[]>;

interface TPropsData {
  rolePermissions: RolePermissions;
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermissions>>;
}

const roles: Role[] = ["Admin", "Manager", "Sales Associate", "Inventory Clerk", "Customer Support", "Viewer"];
const permissions: Permission[] = [
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
];

const UsersPermission = ({ rolePermissions, setRolePermissions }: TPropsData) => {
  const handleChange = (role: Role, perm: Permission, checked: boolean) => {
    setRolePermissions((prev) => {
      const current = prev[role];
      const updated = checked
        ? [...current, perm]
        : current.filter((p) => p !== perm);
      return { ...prev, [role]: updated };
    });
  };

  const columns = [
    { title: "Permission", dataIndex: "permission", key: "permission" },
    ...roles.map((role) => ({
      title: role,
      key: role,
      render: (_: any, record: { permission: Permission }) => (
        <Checkbox
          checked={rolePermissions[role].includes(record.permission)}
          onChange={(e) => handleChange(role, record.permission, e.target.checked)}
        />
      ),
    })),
  ];

  const dataSource = permissions.map((perm, index) => ({
    key: index,
    permission: perm,
  }));

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Permissions Management</Title>
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
    </div>
  );
};

export default UsersPermission;