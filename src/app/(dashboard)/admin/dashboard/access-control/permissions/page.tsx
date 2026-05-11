"use client";

import { useMemo } from "react";
import { Card, Empty, Flex, Space, Tag, Typography } from "antd";

import type { PermissionItem } from "@/lib/api";
import { useAvailablePermissions } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import Loader from "@/components/shared/loader";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

const actionColors: Record<string, string> = {
  CREATE: "cyan",
  READ: "blue",
  UPDATE: "gold",
  DELETE: "red",
};

export default function PermissionsPage() {
  const { data = [], isLoading, isError, isFetching } = useAvailablePermissions();

  const groupedPermissions = useMemo(() => {
    const grouped = new Map<string, PermissionItem[]>();

    data.forEach((permission) => {
      const current = grouped.get(permission.feature) ?? [];
      current.push(permission);
      grouped.set(permission.feature, current);
    });

    return Array.from(grouped.entries()).sort(([first], [second]) =>
      first.localeCompare(second),
    );
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissions"
        subtitle="Review the available business permissions grouped by feature and action."
        breadcrumb={adminBreadcrumb}
      />

      <Card title={`Available Permissions (${data.length})`}>
        {isError ? (
          <Empty description="Failed to load permissions" />
        ) : isLoading || isFetching ? (
          <Loader
            label="Loading permissions"
            description="Grouping permission actions by feature."
          />
        ) : groupedPermissions.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groupedPermissions.map(([feature, permissions]) => (
              <Card
                key={feature}
                size="small"
                title={
                  <Flex align="center" justify="space-between" gap={12}>
                    <Text strong ellipsis>
                      {feature.replaceAll("_", " ")}
                    </Text>
                    <Tag bordered={false}>{permissions.length}</Tag>
                  </Flex>
                }
              >
                <Space wrap size={[6, 8]}>
                  {permissions
                    .slice()
                    .sort((first, second) =>
                      first.action.localeCompare(second.action),
                    )
                    .map((permission) => (
                      <Tag
                        key={`${permission.feature}-${permission.action}`}
                        color={actionColors[permission.action] ?? "default"}
                      >
                        {permission.action}
                      </Tag>
                    ))}
                </Space>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="No permissions found" />
        )}
      </Card>
    </div>
  );
}
