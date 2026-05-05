"use client";

import { Card, Tabs } from "antd";

import {
  SettingOutlined,
  SafetyOutlined,
  BellOutlined,
  ApiOutlined,
  LinkOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  MailOutlined,
} from "@ant-design/icons";

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
                  <SettingOutlined /> General
                </>
              ),
              children: <GeneralSettingsForm />,
            },
            {
              key: "security",
              label: (
                <>
                  <SafetyOutlined /> Security
                </>
              ),
              children: <SecuritySettingsForm />,
            },
            {
              key: "notifications",
              label: (
                <>
                  <BellOutlined /> Notifications
                </>
              ),
              children: <NotificationSettingsForm />,
            },
            {
              key: "api",
              label: (
                <>
                  <ApiOutlined /> API Keys
                </>
              ),
              children: <ApiKeysForm />,
            },
            {
              key: "webhooks",
              label: (
                <>
                  <LinkOutlined /> Webhooks
                </>
              ),
              children: <WebhooksForm />,
            },
            {
              key: "branding",
              label: (
                <>
                  <BgColorsOutlined /> Branding
                </>
              ),
              children: <BrandingForm />,
            },
            {
              key: "language",
              label: (
                <>
                  <GlobalOutlined /> Language
                </>
              ),
              children: <LanguageForm />,
            },
            {
              key: "theme",
              label: (
                <>
                  <BgColorsOutlined /> Appearance
                </>
              ),
              children: <ThemeForm />,
            },
            {
              key: "email",
              label: (
                <>
                  <MailOutlined /> Email
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
