"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import axios from "axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { DataTable } from "@/components/shared/data-table";
import Pagination from "@/components/shared/Pagination";

const { Title, Text } = Typography;
const { Search } = Input;

/* ================= TYPES ================= */

export interface TCompany {
  id: number;
  uuid: string;
  name: string;
  code?: string;
  domain?: string;
  subdomain?: string;
  website_id?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  country?: string;
  logo_url?: string;
  default_currency?: string;
  status: "Active" | "Inactive";
  tenant_id?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/* ================= COMPONENT ================= */

export default function CompaniesPage() {
  const router = useRouter();
  // ✅ LIST STATE
  const [companies, setCompanies] = useState<TCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [totalCompany, setTotalCompany] = useState<number>(0);
  const limit = 5;
  const totalPages = Math.ceil(totalCompany / limit);


  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  /* ================= FETCH ================= */
// length
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await axios.get(
        `http://localhost:5002/onecomm/api/v1/companies?page=${page}&limit=${limit}&sortOrder=DESC`
      );
      setCompanies(res.data.data.data);
    };

    fetchCompanies();
  }, [page, limit]);


  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await axios.get(
        `http://localhost:5002/onecomm/api/v1/companies?sortOrder=DESC`
      );
      setTotalCompany(res.data.data.data.length);
    };

    fetchCompanies();
  }, [statusFilter]);


  useEffect(() => {
    if (!Search || !statusFilter) {
      setCompanies([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5002/onecomm/api/v1/companies?search=${searchText}&status=${statusFilter}&sortOrder=DESC`);
        setCompanies(res.data.data.data);
      } finally {
        setLoading(false);
      }
    }, 500); // ⏱ debounce delay

    return () => clearTimeout(timer); // cancel previous
  }, [searchText, statusFilter]);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:5002/onecomm/api/v1/companies/${id}`
        );

        // ✅ Remove from UI instantly
        setCompanies((prev) => prev.filter((c) => c.id !== id));

        Swal.fire("Deleted!", "Company has been deleted.", "success");
      }
    });
  };


  const columns = [
    {
      label: "Company",
      key: "name",
      render: (row: TCompany) => <Text strong>{row.name}</Text>,
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "Domain",
      key: "domain",
    },
    {
      label: "Country",
      key: "country",
    },
    {
      label: "Status",
      key: "status",
      render: (row: TCompany) =>
        row.status === "Active" ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="default" text="Inactive" />
        ),
    },
    {
      label: "Actions",
      key: "actions",
      render: (record: TCompany) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              router.push(
                `/admin/dashboard/companies/detail/${record.uuid}`
              )
            }}
          />

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/companies/edit/${record.uuid}`
              )
            }
          />

          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" breadcrumb={adminBreadcrumb} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-3">
          <Search
            placeholder="Search companies"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
          />

          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            onChange={(v) => setStatusFilter(v)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            router.push("/admin/dashboard/companies/create")
          }
        >
          Add Company
        </Button>
      </div>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>List of Companies</Title>

            <DataTable
              data={companies}
              columns={columns}
            />
            
          </Card>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Col>
      </Row>

    </div>
  );
}
