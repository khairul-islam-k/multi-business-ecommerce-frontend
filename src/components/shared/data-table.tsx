"use client";

import { Table, Input, Select, Space, TableProps, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  filterOptions?: string[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  toolbarEnd?: React.ReactNode;
  searchKeys?: string[];
  actions?: (row: T) => React.ReactNode;

  loading?: boolean;
  pageSize?: number;
  rowSelection?: TableProps<T>["rowSelection"];
  extra?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  toolbarEnd,
  searchKeys,
  actions,
  loading = false,
  pageSize = 10,
  rowSelection,
  extra,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filtering
  const filteredData = useMemo(() => {
    let result = [...data];

    if (debouncedSearch && searchKeys?.length) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }

    Object.entries(filters).forEach(([key, val]) => {
      if (val) {
        result = result.filter((row) => String(row[key]) === val);
      }
    });

    return result;
  }, [data, debouncedSearch, searchKeys, filters]);

  // Safer sorter
  const getSorter = (key: string) => (a: any, b: any) => {
    const av = a[key];
    const bv = b[key];

    if (typeof av === "number" && typeof bv === "number") {
      return av - bv;
    }

    return String(av).localeCompare(String(bv));
  };

  // Columns
  const antdColumns: TableProps<T>["columns"] = [
    ...columns.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
      sorter: col.sortable ? getSorter(col.key) : undefined,
      filters: col.filterOptions?.map((opt) => ({
        text: opt,
        value: opt,
      })),
      onFilter: col.filterOptions
        ? (value: any, record: T) => record[col.key] === value
        : undefined,
      render: (_: any, row: T) => (col.render ? col.render(row) : row[col.key]),
    })),
    ...(actions
      ? [
          {
            title: "Actions",
            key: "actions",
            fixed: "right" as const,
            render: (_: any, row: T) => actions(row),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/*  Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <Space wrap>
          {searchKeys?.length && (
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="w-64"
            />
          )}

          {columns
            .filter((c) => c.filterOptions)
            .map((col) => (
              <Select
                key={col.key}
                placeholder={col.label}
                allowClear
                className="w-40"
                onChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    [col.key]: val,
                  }))
                }
                options={col.filterOptions?.map((o) => ({
                  label: o,
                  value: o,
                }))}
              />
            ))}

          {/* extra slot */}
          {extra}
        </Space>

        {toolbarEnd}
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={antdColumns}
        dataSource={filteredData}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          pageSize,
          showSizeChanger: true,
        }}
        locale={{
          emptyText: <Empty description="No data found" />,
        }}
        scroll={{ x: "max-content" }}
        sticky
      />
    </div>
  );
}
