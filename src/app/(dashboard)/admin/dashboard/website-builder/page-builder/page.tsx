"use client";

import { useState } from "react";
import { Card, Button, Modal, Form, Input, Select, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import SearchableSelect from "@/components/shared/searchable-select";
import { useSwal } from "@/hooks/use-swal";
import { queryClient } from "@/providers/query-provider";
import Pagination from "@/components/shared/pagination";

export default function PageBuilder() {
  const swal = useSwal();

  const [websiteId, setWebsiteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
     FETCH PAGES
  ========================= */
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["website-pages", websiteId, search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (websiteId) params.append("website_id", String(websiteId));
      if (currentPage) params.append("page", String(currentPage));

      const res = await api.get(`/pages?${params.toString()}`);
      return res.data?.data || [];
    },
    enabled: true,
  });

  /* =========================
     CREATE PAGE
  ========================= */
  const handleCreate = async (values: any) => {
    try {
      await api.post("/pages", {
        ...values,
        website_id: websiteId,
      });

      swal.success("Page created");
      setOpen(false);
      form.resetFields();

      queryClient.invalidateQueries({
        queryKey: ["website-pages"],
      });
    } catch {
      swal.error("Failed to create page");
    }
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns: Column<any>[] = [
    {
      key: "title",
      label: "Title",
      type: "primary",
      render: (r) => r.title,
    },
    {
      key: "type",
      label: "Type",
      render: (r) => r.type,
    },
    {
      key: "slug",
      label: "Slug",
      render: (r) => r.slug,
    },
    {
      key: "seo_title",
      label: "SEO Title",
      render: (r) => r.seo_title || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (r) => r.status,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Page Builder" breadcrumb={adminBreadcrumb} />

      {/* WEBSITE SELECT */}
      <Card>
        <div className="max-w-sm">
          <label className="font-semibold">Select Website</label>

          <SearchableSelect
            endpoint="/websites"
            value={websiteId as any}
            onChange={(v) => setWebsiteId(v as any)}
            placeholder="Search website"
          />
        </div>
      </Card>

      {/* TABLE */}
      <Card
        title={`Pages (${data?.length || 0})`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!websiteId}
            onClick={() => setOpen(true)}
          >
            Add Page
          </Button>
        }
      >
        {isError ? (
          <Empty description="Failed to load pages" />
        ) : (
          <DataTable
            data={data?.data || []}
            columns={columns}
            onSearch={(q) => {
              setSearch(q);
              setCurrentPage(1);
            }}
            loading={isFetching || isLoading}
          />
        )}
      </Card>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={data?.meta?.totalPages || 1}
      />

      {/* CREATE MODAL */}
      <Modal
        title="Create Page"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="title"
            label="Page Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="page_type" label="Type" rules={[{ required: true }]}>
            <Select>
              <option value="home">Home</option>
              <option value="page">Page</option>
              <option value="product">Product</option>
            </Select>
          </Form.Item>

          <Form.Item name="slug" label="Slug">
            <Input placeholder="/about-us" />
          </Form.Item>

          <Form.Item name="seo_title" label="SEO Title">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <option value="Active">Published</option>
              <option value="Inactive">Draft</option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
