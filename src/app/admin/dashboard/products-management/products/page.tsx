"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import api from '@/lib/axios';
import { EyeOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, Grid, Input, Pagination, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export interface TProduct {
  id: string;
  uuid: string;

  name: string;
  slug: string;
  sku: string;
  barcode: string;

  status: 'Active' | 'Inactive' | 'Deleted';

  is_featured: boolean;

  sale_price: number | null;
  compare_price: number | null;
  cost_price: number | null;

  tax_type: string | null;
  tax_amount: number | null;

  short_description: string | null;
  long_description: string | null;

  brand_id: string | null;
  category_id: string | null;
  company_id: string | null;
  tenant_id: string | null;

  published_at: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}


const ProductsList = () => {
    const screens = Grid.useBreakpoint();
    const router = useRouter();
    const [allProduct, setAllProduct] = useState<TProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const [searchText, setSearchText] = useState<string>("");


    // pagination
    const [page, setPage] = useState<number>(1);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const limit = 5;
  const totalPages = Math.ceil(totalProduct / limit);


  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await api.get(
        `/companies?page=${page}&limit=${limit}&sortOrder=DESC`
      );
      setTotalProduct(res.data.data.data);
    };

    fetchCompanies();
  }, [page, limit]);


//   useEffect(() => {
//     const fetchCompanies = async () => {
//       const res = await api.get(
//         `/products?sortOrder=DESC`
//       );
//       setTotalProduct(res.data.data.data.length);
//     };

//     fetchCompanies();
//   }, []);


//   useEffect(() => {
//     if (!searchText) {
//       setAllProduct([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/products?search=${searchText}&sortOrder=DESC`);
//         setAllProduct(res.data.data.data);
//       } finally {
//         setLoading(false);
//       }
//     }, 500); // ⏱ debounce delay

//     return () => clearTimeout(timer); // cancel previous
//   }, [searchText);

    // use
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await api.get(`/products?sortOrder=DESC`);
    //         setAllProduct(res.data.data.data);
    //     }
    //     fetchData();
    // }, [])

    const productColumns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Cost Price", dataIndex: "cost_price", key: "cost_price" },
        { title: "Sale Price", dataIndex: "sale_price", key: "sale_price" },
        { title: "Compare Price", dataIndex: "compare_price", key: "compare_price" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
            ),
        },
        {
            title: "Featured",
            dataIndex: "is_featured",
            key: "is_featured",
            render: (featured: boolean) => (featured ? "Yes" : "No"),
        },
        { title: "Published At", dataIndex: "published_at", key: "published_at" },
        {
            title: "",
            render: (_: any, record: any) => (
                <Flex>
                    <Link href={`/admin/dashboard/products-management/products/detail/${record.id}`}>
                        <Button type="text" icon={<EyeOutlined />} />
                    </Link>

                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "edit",
                                    label: "Edit",
                                    onClick: () => router.push(`/admin/dashboard/products-management/products/edit/${record.id}`),
                                },
                                {
                                    key: "delete",
                                    danger: true,
                                    label: "Delete",
                                },
                            ],
                        }}
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Flex>
            ),
        },
    ];

    const handleSearch = (searchData: string) => {
        console.log("search", searchData);
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Products List' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>All Products here</p>

            {/* Search field */}
            <Flex
                justify="space-between"
                wrap="wrap"
                style={{ marginBottom: '10px' }}
            >
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        style={{
                            width: screens.lg ? "330px" : "100%"
                        }}
                        prefix={<SearchOutlined />}
                        placeholder="Search packages..."
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/admin/dashboard/products-management/products/create')}
                >
                    New Product
                </Button>
            </Flex>


            <Card style={{ overflow: 'auto' }}>
                <Table
                    rowKey="id"
                    columns={productColumns}
                    dataSource={allProduct}
                    bordered
                    pagination={false}
                />
            </Card>
            {/* <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          /> */}

        </div>
    );
};

export default ProductsList;