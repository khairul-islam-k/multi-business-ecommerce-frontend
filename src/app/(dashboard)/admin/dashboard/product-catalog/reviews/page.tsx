"use client";

import {
  CirclePlus,
  Trash2
} from "lucide-react";


import { useMemo, useState } from "react";
import { App, Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Tag } from "antd";

import PageHeader from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import {
  useProductReviewMutations,
  useProductReviewsQuery,
  useProductsQuery,
} from "@/lib/api";
import type {
  ProductReviewPayload,
  ProductReviewResponse,
  ProductReviewStatus,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";

const statusColor: Record<ProductReviewStatus, string> = {
  APPROVED: "green",
  PENDING: "blue",
  REJECTED: "red",
};

function objectName(value: unknown) {
  if (!value || typeof value !== "object") return "-";
  const record = value as { name?: unknown; title?: unknown; sku?: unknown };
  return String(record.name ?? record.title ?? record.sku ?? "-");
}

export default function ProductReviewsPage() {
  const businessId = useActiveBusinessId();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<ProductReviewPayload>();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ProductReviewStatus | undefined>();
  const [createOpen, setCreateOpen] = useState(false);

  const query = useMemo(
    () => ({ page, limit: 10, status }),
    [page, status],
  );

  const reviews = useProductReviewsQuery(businessId ?? "", query);
  const products = useProductsQuery(businessId ?? "", { page: 1, limit: 100 });
  const mutations = useProductReviewMutations(businessId ?? "");

  const submitReview = async (values: ProductReviewPayload) => {
    try {
      await mutations.createReview.mutateAsync(values);
      form.resetFields();
      setCreateOpen(false);
      message.success("Review created.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const updateStatus = async (
    reviewId: string,
    nextStatus: ProductReviewStatus,
  ) => {
    try {
      await mutations.updateReviewStatus.mutateAsync({
        reviewId,
        payload: { status: nextStatus },
      });
      message.success("Review status updated.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const deleteReview = (review: ProductReviewResponse) => {
    modal.confirm({
      title: "Delete review?",
      content: review.title ?? review.comment ?? review.reviewerName,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await mutations.removeReview.mutateAsync(review.id);
          message.success("Review deleted.");
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const columns: Column<ProductReviewResponse>[] = [
    {
      key: "reviewerName",
      label: "Reviewer",
      type: "primary",
      render: (review) => review.reviewerName,
    },
    {
      key: "product",
      label: "Product",
      render: (review) => objectName(review.product),
    },
    {
      key: "rating",
      label: "Rating",
      render: (review) => `${review.rating}/5`,
    },
    {
      key: "title",
      label: "Review",
      render: (review) => review.title ?? review.comment ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (review) => (
        <Tag color={statusColor[review.status]}>{review.status}</Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Reviews"
        subtitle="Moderate customer product reviews from the API."
        breadcrumb={adminBreadcrumb}
      />

      <DataTable
        data={reviews.data?.items ?? []}
        columns={columns}
        loading={reviews.isLoading || reviews.isFetching}
        extra={
          <Select
            allowClear
            placeholder="Status"
            value={status}
            style={{ width: 150 }}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={["PENDING", "APPROVED", "REJECTED"].map((item) => ({
              label: item,
              value: item,
            }))}
          />
        }
        toolbarEnd={
          <Button
            type="primary"
            icon={<CirclePlus />}
            onClick={() => setCreateOpen(true)}
          >
            Add review
          </Button>
        }
        actions={(review) => (
          <Space>
            <Select
              value={review.status}
              style={{ width: 130 }}
              onChange={(value) => updateStatus(review.id, value)}
              options={["PENDING", "APPROVED", "REJECTED"].map((item) => ({
                label: item,
                value: item,
              }))}
            />
            <Button
              danger
              icon={<Trash2 />}
              onClick={() => deleteReview(review)}
            />
          </Space>
        )}
        pagination={{
          currentPage: page,
          totalPages: reviews.data?.meta.totalPages ?? 1,
          onPageChange: setPage,
        }}
      />

      <Modal
        title="Add product review"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submitReview}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="productId"
                label="Product"
                rules={[
                  {
                    required: true,
                    message: "Product is required",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select product"
                  optionFilterProp="label"
                  options={(products.data?.items ?? []).map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="rating"
                label="Rating"
                rules={[
                  {
                    required: true,
                    message: "Rating is required",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={5}
                  placeholder="Enter rating"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="title" label="Title">
                <Input placeholder="Review title" maxLength={150} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="reviewerName"
                label="Reviewer name"
                rules={[
                  {
                    required: true,
                    message: "Reviewer name is required",
                  },
                ]}
              >
                <Input placeholder="Reviewer name" maxLength={150} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="reviewerEmail"
                label="Reviewer email"
                rules={[
                  {
                    type: "email",
                    message: "Enter a valid email address",
                  },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Reviewer email"
                  maxLength={150}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="comment" label="Comment">
                <Input.TextArea
                  rows={4}
                  placeholder="Write review comment"
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutations.createReview.isPending}
            >
              Save review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
    </div>
  );
}
