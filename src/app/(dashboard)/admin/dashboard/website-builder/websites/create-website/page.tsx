"use client";
import React, { useState } from 'react';
import WebsiteTemplateForm from '../_components/website-template-form';
import { WebsiteTemplatePayload } from '@/types/website/website';
import { useAuthStore } from '@/stores/auth.store';
import { useWebsiteMutation } from '@/lib/api/hooks/website';
import { useSwal } from '@/hooks/use-swal';
import { getApiErrorMessage } from '@/lib/axios';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import PageHeader from '@/components/shared/page-header';

const CreateWebSite = () => {
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const swal = useSwal()

  const { createWebsite } = useWebsiteMutation(businessId);

  const handleSubmit = async (values: WebsiteTemplatePayload) => {
    setIsSubmitting(true);
    try {
      await createWebsite.mutateAsync(values);

      swal.success("Website template created successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div className="space-y-6">

      <PageHeader
        title="Create Website"
        subtitle="Create and configure your website template, header slides, footer content, theme settings, SEO information, and media assets."
        breadcrumb={adminBreadcrumb}
      />

      <WebsiteTemplateForm
        mode='create'
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreateWebSite;