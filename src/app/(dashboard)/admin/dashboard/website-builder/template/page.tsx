"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import GalleryCard from "./_components/gallery-card";

export default function Template() {
  return (
    <div className="space-y-6">
      <PageHeader title="Template Gallery" breadcrumb={adminBreadcrumb} />
      <GalleryCard />
    </div>
  );
}
