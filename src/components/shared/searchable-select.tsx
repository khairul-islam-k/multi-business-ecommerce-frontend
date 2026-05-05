"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin, type SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";

import api from "@/lib/axios";

type ValueType = string | number;
type ApiItem = Record<string, unknown>;

interface SearchableSelectProps extends Omit<
  SelectProps<ValueType | ValueType[]>,
  "options" | "onSearch" | "filterOption" | "showSearch"
> {
  endpoint: string;
  value?: ValueType | ValueType[];
  onChange?: (value: ValueType | ValueType[] | undefined) => void;

  labelKey?: string;
  valueKey?: string;

  params?: Record<string, unknown>;
  minSearchLength?: number;
}

function getNestedValue(item: ApiItem, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as ApiItem)[part];
    }

    return undefined;
  }, item);
}

function normalizeResponse(response: unknown): ApiItem[] {
  if (!response || typeof response !== "object") return [];

  const axiosResponse = response as { data?: unknown };
  const body = axiosResponse.data;

  if (Array.isArray(body)) return body;

  if (!body || typeof body !== "object") return [];

  const firstData = (body as { data?: unknown }).data;

  if (Array.isArray(firstData)) return firstData;

  if (!firstData || typeof firstData !== "object") return [];

  const secondData = (firstData as { data?: unknown }).data;

  if (Array.isArray(secondData)) return secondData;

  return [];
}

export default function SearchableSelect({
  endpoint,
  value,
  onChange,
  placeholder = "Search...",
  labelKey = "name",
  valueKey = "id",
  params,
  minSearchLength = 0,
  mode,
  disabled,
  ...selectProps
}: SearchableSelectProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 400);

  const shouldFetch = !disabled && debouncedSearch.length >= minSearchLength;

  const { data = [], isFetching } = useQuery({
    queryKey: ["searchable-select", endpoint, params, debouncedSearch],
    enabled: shouldFetch,
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      const res = await api.get(endpoint, {
        params: {
          ...params,
          search: debouncedSearch,
        },
      });

      return normalizeResponse(res);
    },
  });

  const options = useMemo<DefaultOptionType[]>(() => {
    return data.flatMap((item): DefaultOptionType[] => {
      const label = getNestedValue(item, labelKey);
      const optionValue = getNestedValue(item, valueKey);

      if (
        optionValue === undefined ||
        optionValue === null ||
        optionValue === ""
      ) {
        return [];
      }

      return [
        {
          label: String(label ?? optionValue),
          value: optionValue as ValueType,
        },
      ];
    });
  }, [data, labelKey, valueKey]);

  return (
    <Select<ValueType | ValueType[]>
      showSearch
      allowClear
      mode={mode}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      style={{ width: "100%" }}
      filterOption={false}
      onSearch={setSearch}
      onChange={onChange}
      options={options}
      loading={isFetching}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      {...selectProps}
    />
  );
}
