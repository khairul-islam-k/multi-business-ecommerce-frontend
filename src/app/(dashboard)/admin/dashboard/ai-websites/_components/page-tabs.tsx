"use client";

import { Tabs } from "antd";
import type { GeneratedPage } from "../types";

interface Props {
  pages: GeneratedPage[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export function PageTabs({ pages, activeSlug, onSelect }: Props) {
  return (
    <Tabs
      activeKey={activeSlug}
      onChange={onSelect}
      items={pages.map((p) => ({
        key: p.slug,
        label: p.title,
      }))}
      size="small"
    />
  );
}
