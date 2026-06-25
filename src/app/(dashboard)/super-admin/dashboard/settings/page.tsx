"use client";

import {
  Bell,
  Cable,
  Globe,
  Link as LinkIcon,
  Mail,
  Palette,
  Settings,
  Shield
} from "lucide-react";


import { Card, Tabs } from "antd";


import ThemeForm from "./_components/theme-form";
import ApiKeysForm from "./_components/api-keys-form";
import WebhooksForm from "./_components/webhooks-form";
import BrandingForm from "./_components/branding-form";
import LanguageForm from "./_components/language-form";
import PageHeader from "@/components/shared/page-header";
import EmailSettingsForm from "./_components/email-settings-form";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import GeneralSettingsForm from "./_components/general-settings-form";
import SecuritySettingsForm from "./_components/security-settings-form";
import NotificationSettingsForm from "./_components/notification-settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" breadcrumb={superAdminBreadcrumb} />

      <Card>
        <Tabs
          defaultActiveKey="general"
          items={[
            {
              key: "general",
              label: (
                <>
                  <Settings /> General
                </>
              ),
              children: <GeneralSettingsForm />,
            },
            {
              key: "security",
              label: (
                <>
                  <Shield /> Security
                </>
              ),
              children: <SecuritySettingsForm />,
            },
            {
              key: "notifications",
              label: (
                <>
                  <Bell /> Notifications
                </>
              ),
              children: <NotificationSettingsForm />,
            },
            {
              key: "api",
              label: (
                <>
                  <Cable /> API Keys
                </>
              ),
              children: <ApiKeysForm />,
            },
            {
              key: "webhooks",
              label: (
                <>
                  <LinkIcon /> Webhooks
                </>
              ),
              children: <WebhooksForm />,
            },
            {
              key: "branding",
              label: (
                <>
                  <Palette /> Branding
                </>
              ),
              children: <BrandingForm />,
            },
            {
              key: "language",
              label: (
                <>
                  <Globe /> Language
                </>
              ),
              children: <LanguageForm />,
            },
            {
              key: "theme",
              label: (
                <>
                  <Palette /> Appearance
                </>
              ),
              children: <ThemeForm />,
            },
            {
              key: "email",
              label: (
                <>
                  <Mail /> Email
                </>
              ),
              children: <EmailSettingsForm />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
