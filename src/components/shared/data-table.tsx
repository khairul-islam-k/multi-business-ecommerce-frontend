"use client";

import {
  Table,
  Input,
  Select,
  TableProps,
  Empty,
  Card,
  Pagination,
  Grid,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";

const { useBreakpoint } = Grid;

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  filterOptions?: string[];

  // ✨ NEW (optional, no breaking change)
  type?: "primary" | "secondary" | "meta";
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
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  // 🔍 Filtering
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

  // 🔄 Reset page on filter/search change
  useMemo(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  // 📄 Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // 🔽 Sorter
  const getSorter = (key: string) => (a: any, b: any) => {
    const av = a[key];
    const bv = b[key];

    if (typeof av === "number" && typeof bv === "number") {
      return av - bv;
    }

    return String(av).localeCompare(String(bv));
  };

  // 📊 Table Columns
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

  // 🎴 Modern Card Renderer
  const renderCard = (row: T) => {
    const primary = columns.find((c) => c.type === "primary") || columns[0];
    const secondary = columns.filter((c) => c.type === "secondary");
    const meta = columns.filter((c) => c.type === "meta");

    return (
      <Card
        key={row.id}
        className="w-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
        bodyStyle={{ padding: 16 }}
      >
        <div className="space-y-3">
          {/* 🔥 Primary */}
          <div className="text-base font-semibold leading-tight">
            {primary.render ? primary.render(row) : row[primary.key]}
          </div>

          {/* 🧩 Secondary (grid) */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {secondary.map((col) => (
                <div key={col.key} className="flex flex-col">
                  <span className="text-[11px] text-gray-400 uppercase">
                    {col.label}
                  </span>
                  <span className="text-sm font-medium">
                    {col.render ? col.render(row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 🏷 Meta */}
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {meta.map((col) => (
                <span key={col.key} className="text-xs">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              ))}
            </div>
          )}

          {/* ⚡ Actions */}
          {actions && (
            <div className="pt-3 border-t flex justify-end gap-2">
              {actions(row)}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* 🔧 Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
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

          {extra}
        </div>

        {toolbarEnd}
      </div>

      {/* 📱 Mobile */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginatedData.length ? (
              paginatedData.map((row) => renderCard(row))
            ) : (
              <Empty description="No data found" />
            )}
          </div>

          <Pagination
            current={page}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={setPage}
            showSizeChanger
          />
        </div>
      ) : (
        /* 💻 Desktop */
        <Table
          rowKey="id"
          columns={antdColumns}
          dataSource={filteredData}
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: page,
            pageSize,
            total: filteredData.length,
            onChange: setPage,
            showSizeChanger: true,
          }}
          locale={{
            emptyText: <Empty description="No data found" />,
          }}
          scroll={{ x: "max-content" }}
          sticky
        />
      )}
    </div>
  );
}
