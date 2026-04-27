"use client";

import { Tree } from "antd";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loader from "@/components/shared/loader";

export default function PermissionTree({
  value = [],
  onChange,
}: {
  value?: number[];
  onChange?: (v: number[]) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["permission-tree"],
    queryFn: async () => {
      const res = await api.get("/permissions/tree");
      return res.data?.data;
    },
  });

  if (isLoading) return <Loader />;

  /* ================= TRANSFORM ================= */
  const treeData =
    data?.map((module: any) => ({
      title: module.module_key,
      key: `module-${module.module_key}`,
      children: module.features.map((feature: any) => ({
        title: feature.feature_key,
        key: `feature-${feature.feature_key}`,
        children: feature.permissions.map((p: any) => ({
          title: p.label || p.action_key,
          key: p.id,
        })),
      })),
    })) || [];

  return (
    <Tree
      checkable
      treeData={treeData}
      checkedKeys={value}
      onCheck={(keys) => onChange?.(keys as number[])}
    />
  );
}
