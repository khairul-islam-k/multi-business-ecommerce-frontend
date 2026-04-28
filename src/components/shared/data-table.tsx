"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Empty,
  Grid,
  Input,
  Skeleton,
  Table,
  type TableProps,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "use-debounce";

import Pagination from "./Pagination";

const { useBreakpoint } = Grid;

export interface Column<T> {
  key: string;
  label: string;

  // Kept for old static pages/backward compatibility.
  sortable?: boolean;
  filterOptions?: string[];

  render?: (row: T) => React.ReactNode;
  type?: "primary" | "secondary" | "meta";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];

  toolbarEnd?: React.ReactNode;
  extra?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;

  loading?: boolean;
  pageSize?: number;
  searchKeys?: string[];

  rowSelection?: TableProps<T>["rowSelection"];

  onSearch?: (value: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;

  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function getRowKey<T extends Record<string, any>>(row: T): React.Key {
  return (
    (row.uuid as React.Key | undefined) ??
    (row.id as React.Key | undefined) ??
    JSON.stringify(row)
  );
}

function renderCell<T extends Record<string, any>>(row: T, column: Column<T>) {
  const value = column.render ? column.render(row) : row[column.key];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value as React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  toolbarEnd,
  actions,
  loading = false,
  rowSelection,
  extra,
  onSearch,
  pagination,
}: DataTableProps<T>) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 300);

  useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const primaryColumn = useMemo(
    () => columns.find((column) => column.type === "primary") ?? columns[0],
    [columns],
  );

  const secondaryColumn = useMemo(
    () => columns.find((column) => column.type === "secondary"),
    [columns],
  );

  const metaColumns = useMemo(
    () => columns.filter((column) => column.type === "meta"),
    [columns],
  );

  const cardColumns = useMemo(() => {
    if (!primaryColumn) return [];

    return columns.filter(
      (column) =>
        column.key !== primaryColumn.key &&
        column.key !== secondaryColumn?.key &&
        column.type !== "primary" &&
        column.type !== "secondary" &&
        column.type !== "meta",
    );
  }, [columns, primaryColumn, secondaryColumn]);

  const antdColumns = useMemo<TableProps<T>["columns"]>(() => {
    const mappedColumns: TableProps<T>["columns"] = columns.map((column) => ({
      title: column.label,
      dataIndex: column.key,
      key: column.key,
      render: (_, row) => renderCell(row, column),
    }));

    if (actions) {
      mappedColumns.push({
        title: "Actions",
        key: "actions",
        fixed: "right",
        render: (_, row) => actions(row),
      });
    }

    return mappedColumns;
  }, [columns, actions]);

  const renderCard = (row: T) => {
    if (!primaryColumn) return null;

    return (
      <Card
        key={getRowKey(row)}
        className="w-full rounded-2xl border border-gray-100 shadow-sm transition-shadow duration-200 hover:shadow-md"
        styles={{
          body: {
            padding: 14,
          },
        }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-gray-900">
                {renderCell(row, primaryColumn)}
              </div>

              {secondaryColumn && (
                <div className="mt-0.5 text-xs text-gray-500">
                  {renderCell(row, secondaryColumn)}
                </div>
              )}
            </div>

            {actions && (
              <div className="flex shrink-0 items-center gap-1">
                {actions(row)}
              </div>
            )}
          </div>

          {cardColumns.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gray-100 pt-2">
              {cardColumns.map((column) => (
                <div key={column.key} className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-gray-400">
                    {column.label}
                  </div>

                  <div className="truncate text-sm text-gray-700">
                    {renderCell(row, column)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {metaColumns.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {metaColumns.map((column) => (
                <div
                  key={column.key}
                  className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-600"
                >
                  {renderCell(row, column)}
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
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="w-64"
          />

          {extra}
        </div>

        {toolbarEnd}
      </div>

      {isMobile ? (
        loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="rounded-2xl border border-gray-100 shadow-sm"
                styles={{
                  body: {
                    padding: 14,
                  },
                }}
              >
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : data.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.map((row) => renderCard(row))}
          </div>
        ) : (
          <Empty description="No data found" />
        )
      ) : (
        <Table<T>
          rowKey={getRowKey}
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

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
