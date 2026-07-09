"use client";

import { Card, Empty, Skeleton, Tag } from "antd";
import React from "react";

import { ApiId } from "@/lib/api";
import { useAttribute } from "@/lib/api/hooks/product-attribute";
import { useAuthStore } from "@/stores/auth.store";

type ViewAttributeProps = {
  attributeId: ApiId;
};

const ViewAttribute = ({ attributeId }: ViewAttributeProps) => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: viewAttribute,
    isLoading,
    isFetching,
  } = useAttribute(businessId, attributeId);

  if (isLoading || isFetching) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!viewAttribute) {
    return (
      <Card>
        <Empty description="Attribute not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card title="Attribute Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Attribute Name" value={viewAttribute.name} />

          <InfoItem
            label="Status"
            value={
              <Tag color={viewAttribute.status === "ACTIVE" ? "green" : "red"}>
                {viewAttribute.status}
              </Tag>
            }
          />

          <InfoItem
            label="Total Values"
            value={viewAttribute.values?.length ?? 0}
          />

          <InfoItem
            label="Created At"
            value={
              viewAttribute.createdAt
                ? new Date(viewAttribute.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </div>
      </Card>

      <Card title="Attribute Values">
        {viewAttribute.values?.length ? (
          <div className="space-y-3">
            {viewAttribute.values.map((item) => (
              <div key={item.id} className="rounded-lg border bg-gray-50 p-3">
                <p className="m-0 font-medium">{item.value}</p>
                <p className="m-0 text-xs text-gray-500">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No attribute values found" />
        )}
      </Card>
    </div>
  );
};

export default ViewAttribute;

type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  );
};
