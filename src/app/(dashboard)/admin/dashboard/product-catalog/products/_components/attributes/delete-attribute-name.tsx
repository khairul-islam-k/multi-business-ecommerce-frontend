"use client";

import { useAttributeMutation, useProductAttribute } from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { DeleteOutlined } from "@ant-design/icons";
import { App, Button, Card, Empty, Popconfirm, Skeleton, Tag } from "antd";

type AttributeStatus = "ACTIVE" | "INACTIVE";

type ProductAttribute = {
  id: string;
  businessId: string;
  productId: string;
  name: string;
  status: AttributeStatus;
};

interface DeleteAttributeNameProps {
  productId: string;
}

const DeleteAttributeName = ({ productId }: DeleteAttributeNameProps) => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const { message } = App.useApp();

  const {
    data: attributes,
    isLoading,
    isFetching,
  } = useProductAttribute(businessId, productId);

  const {removeAttributeName} = useAttributeMutation(businessId);

  const attributeList = (attributes ?? []) as ProductAttribute[];

  const handleDelete = async (attributeId: string) => {
    console.log("Delete attribute id:", attributeId);

    try {
        const res = await removeAttributeName.mutateAsync({
            productId,
            attributeId,
        })
        message.success("Attribute Name has been deleted");
    } catch (error) {
        message.error(getApiErrorMessage(error));
    }

    // await deleteAttribute.mutateAsync({
    //   productId,
    //   attributeId,
    // });
  };

  if (isLoading || isFetching) {
    return (
      <Card title="Delete Attribute">
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  if (!attributeList.length) {
    return (
      <Card title="Delete Attribute">
        <Empty description="No attributes found" />
      </Card>
    );
  }

  return (
    <Card title="Delete Attribute">
      <div className="space-y-3">
        {attributeList.map((attribute) => (
          <div
            key={attribute.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              <strong className="capitalize">{attribute.name}</strong>

              <Tag color={attribute.status === "ACTIVE" ? "green" : "red"}>
                {attribute.status}
              </Tag>
            </div>

            <Popconfirm
              title="Delete attribute?"
              description={`Are you sure you want to delete "${attribute.name}"?`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(attribute.id)}
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DeleteAttributeName;