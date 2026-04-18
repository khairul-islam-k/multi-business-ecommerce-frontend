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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (value: any, record: T) => record[col.key] === value
        : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: T) => (col.render ? col.render(row) : row[col.key]),
    })),
    ...(actions
      ? [
          {
            title: "Actions",
            key: "actions",
            fixed: "right" as const,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, row: T) => actions(row),
          },
        ]
      : []),
  ];

  const renderCard = (row: T) => {
    const primary = columns.find((c) => c.type === "primary") || columns[0];
    const secondary = columns.filter((c) => c.type === "secondary");
    const meta = columns.filter((c) => c.type === "meta");
    const rest = columns.filter(
      (c) => c.key !== primary.key && c.type !== "primary",
    );

    return (
      <Card
        key={row.id}
        className="w-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
        bodyStyle={{ padding: 14 }}
      >
        <div className="space-y-3">
          {/* 🔥 HEADER */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-gray-900 truncate">
                {primary.render ? primary.render(row) : row[primary.key]}
              </div>

              {/* Optional secondary line */}
              {secondary.length > 0 && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {secondary[0].render
                    ? secondary[0].render(row)
                    : row[secondary[0].key]}
                </div>
              )}
            </div>

            {/* ⚡ Actions (compact) */}
            {actions && (
              <div className="flex items-center gap-1 shrink-0">
                {actions(row)}
              </div>
            )}
          </div>

          {/* 📊 BODY */}
          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-gray-100">
              {rest.map((col) => (
                <div key={col.key} className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-gray-400">
                    {col.label}
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🧷 META ROW (badges/info) */}
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {meta.map((col) => (
                <div
                  key={col.key}
                  className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600"
                >
                  {col.render ? col.render(row) : String(row[col.key])}
                </div>
              ))}
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
