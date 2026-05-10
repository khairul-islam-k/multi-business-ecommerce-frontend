"use client";

import { Tree } from "antd";
import { useMemo } from "react";

import Loader from "@/components/shared/loader";
import { useAvailablePermissions, type PermissionItem } from "@/lib/api";

const toKey = (permission: PermissionItem) =>
  `${permission.feature}:${permission.action}`;

const fromKey = (key: string): PermissionItem | null => {
  const [feature, action] = key.split(":");
  if (!feature || !action) return null;

  return { feature, action };
};

export default function PermissionTree({
  value = [],
  onChange,
}: {
  value?: PermissionItem[];
  onChange?: (value: PermissionItem[]) => void;
}) {
  const { data = [], isLoading } = useAvailablePermissions();

  const treeData = useMemo(() => {
    const grouped = data.reduce<Record<string, PermissionItem[]>>(
      (acc, permission) => {
        acc[permission.feature] ??= [];
        acc[permission.feature].push(permission);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([feature, permissions]) => ({
      title: feature,
      key: `feature-${feature}`,
      children: permissions.map((permission) => ({
        title: permission.action,
        key: toKey(permission),
      })),
    }));
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <Tree
      checkable
      treeData={treeData}
      checkedKeys={value.map(toKey)}
      onCheck={(keys) => {
        const checkedKeys = Array.isArray(keys) ? keys : keys.checked;
        onChange?.(
          checkedKeys
            .map(String)
            .map(fromKey)
            .filter((permission): permission is PermissionItem =>
              Boolean(permission),
            ),
        );
      }}
    />
  );
}
