"use client";

import { Select, Spin } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import api from "@/lib/axios";

const { Option } = Select;

type ValueType = string | number;

interface Props {
  value?: ValueType | ValueType[];
  onChange: (value: any) => void;

  placeholder?: string;
  endpoint: string;

  labelKey?: string;
  valueKey?: string;

  /** ✅ NEW: supports single or multiple */
  mode?: "multiple" | undefined;
}

export default function SearchableSelect({
  value,
  onChange,
  placeholder,
  endpoint,
  labelKey = "name",
  valueKey = "id",
  mode,
}: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  const { data = [], isFetching } = useQuery({
    queryKey: [endpoint, debouncedSearch],
    queryFn: async () => {
      const res = await api.get(endpoint, {
        params: { search: debouncedSearch },
      });

      return res.data?.data?.data ?? res.data?.data ?? [];
    },
  });

  return (
    <Select
      showSearch
      mode={mode} // ✅ key change
      value={value}
      placeholder={placeholder}
      style={{ width: "100%" }}
      filterOption={false}
      onSearch={(val) => setSearch(val)}
      onChange={onChange}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      allowClear
    >
      {data.map((item: any) => (
        <Option key={item[valueKey]} value={item[valueKey]}>
          {item[labelKey]}
        </Option>
      ))}
    </Select>
  );
}
