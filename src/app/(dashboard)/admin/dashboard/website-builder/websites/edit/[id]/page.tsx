"use client";

import Loader from "@/components/shared/loader";
import { useSwal } from "@/hooks/use-swal";
import { useWebsite, useWebsiteMutation } from "@/lib/api/hooks/website";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import WebsiteTemplateForm from "../../_components/website-template-form";
import { WebsiteTemplatePayload } from "@/types/website/website";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function EditWebsite() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { data: website, isLoading, isFetching } = useWebsite(businessId, id);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const swal = useSwal();

  const { updateWebsite } = useWebsiteMutation(businessId);

  const handleSubmit = async (values: WebsiteTemplatePayload) => {
    setIsSubmitting(true);

    try {
      await updateWebsite.mutateAsync({
        websiteId: id,
        payload: values
      });
      router.push('/admin/dashboard/website-builder/websites');
      swal.success("Website updated successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false)
    }
  };

  if (isLoading || isFetching) return <Loader />

  return (
    <div className='space-y-6'>

      <PageHeader
        title="Update Website"
        subtitle="Update your website template, header slides, footer content, theme settings, SEO information, media assets, and publishing status."
        breadcrumb={adminBreadcrumb}
      />

      <WebsiteTemplateForm
        mode='update'
        initialData={website}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
