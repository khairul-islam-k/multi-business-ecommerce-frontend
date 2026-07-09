"use client";

import { Tabs, TabsProps } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

import ChangeEmailForm from "./_components/change-email-form";
import EditProfile from "./_components/edit-profile";
import ResetPassword from "./_components/reset-password";
import UserProfilePage from "./_components/user-profilepage";

const Profile = () => {
  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      children: <UserProfilePage />,
    },
    {
      key: "edit profile",
      label: "Edit Profile",
      children: <EditProfile />,
    },
    {
      key: "password Reset",
      label: "Reset Password",
      children: <ResetPassword />,
    },
    {
      key: "change email",
      label: "Change Email",
      children: <ChangeEmailForm />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Profile"
        subtitle="Your account and active business details."
        breadcrumb={adminBreadcrumb}
      />
      <Tabs defaultActiveKey="profile" items={items} onChange={onChange} />
    </div>
  );
};

export default Profile;
