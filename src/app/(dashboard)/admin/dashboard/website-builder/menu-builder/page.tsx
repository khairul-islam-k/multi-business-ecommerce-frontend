"use client";

import { useEffect, useState } from "react";
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
import Pagination from "@/components/shared/Pagination";

const { Option } = Select;

export default function WebsiteMenuBuilder() {
  const swal = useSwal();

  const [websiteId, setWebsiteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
     FETCH MENUS
  ========================= */
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["website-menus", websiteId, search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (websiteId) params.append("website_id", String(websiteId));
      if (currentPage) params.append("page", String(currentPage));

      const res = await api.get(`/menus?${params.toString()}`);
      return res.data?.data ?? {};
    },
    enabled: true,
  });

  /* =========================
     CREATE MENU
  ========================= */
  const handleCreate = async (values: any) => {
    if (!websiteId) {
      swal.error("Select a website first");
      return;
    }

    try {
      await api.post("/menus", {
        ...values,
        website_id: websiteId,
      });

      swal.success("Menu created");
      setOpen(false);
      form.resetFields();

      queryClient.invalidateQueries({
        queryKey: ["website-menus"],
      });
    } catch {
      swal.error("Failed to create menu");
    }
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Menu Name",
      type: "primary",
      render: (r) => r.name,
    },
    {
      key: "location",
      label: "Location",
      render: (r) => r.location,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => r.status,
    },
  ];

  useEffect(() => {
    console.log(currentPage, data);
  }, [currentPage, data]);

  return (
    <div className="space-y-6">
      <PageHeader title="Website Menu Builder" breadcrumb={adminBreadcrumb} />

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
        title={`Menus (${data?.data?.length || 0})`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!websiteId}
            onClick={() => setOpen(true)}
          >
            Add Menu
          </Button>
        }
      >
        {isError ? (
          <Empty description="Failed to load menus" />
        ) : (
          <DataTable
            data={data?.data || []}
            columns={columns}
            loading={isLoading || isFetching}
            onSearch={(q) => {
              setSearch(q);
              setCurrentPage(1);
            }}
          />
        )}
      </Card>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={data?.meta?.totalPages || 1}
      />

      {/* CREATE MODAL */}
      <Modal
        title="Create Menu"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="Menu Name"
            rules={[{ required: true, message: "Enter menu name" }]}
          >
            <Input placeholder="Main Menu / Footer Menu" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select location">
              <Option value="header">Header</Option>
              <Option value="body">Body</Option>
              <Option value="footer">Footer</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
