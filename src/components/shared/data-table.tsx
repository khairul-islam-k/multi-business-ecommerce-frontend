"use client";

import { Table, Input, TableProps, Empty, Card, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
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

  onSearch?: (value: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  toolbarEnd,
  actions,
  loading = false,
  rowSelection,
  extra,

  onSearch,
  onFilterChange,
}: DataTableProps<T>) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  // 🔥 Always emit search (debounced)
  useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // 📊 Table Columns (NO internal filtering)
  const antdColumns: TableProps<T>["columns"] = [
    ...columns.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-gray-900 truncate">
                {primary.render ? primary.render(row) : row[primary.key]}
              </div>

              {secondary.length > 0 && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {secondary[0].render
                    ? secondary[0].render(row)
                    : row[secondary[0].key]}
                </div>
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-1 shrink-0">
                {actions(row)}
              </div>
            )}
          </div>

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
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="w-64"
          />

          {extra}
        </div>

        {toolbarEnd}
      </div>

      {/* 📱 Mobile */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.length ? (
              data.map((row) => renderCard(row))
            ) : (
              <Empty description="No data found" />
            )}
          </div>
        </div>
      ) : (
        <Table
          rowKey="id"
          columns={antdColumns}
          dataSource={data}
          loading={loading}
          rowSelection={rowSelection}
          locale={{
            emptyText: <Empty description="No data found" />,
          }}
          pagination={false}
          scroll={{ x: "max-content" }}
          sticky
        />
      )}
    </div>
  );
}
