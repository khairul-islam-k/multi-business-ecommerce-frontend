"use client";
import React from 'react';
import UserProfilePage from './_components/user-profilepage';
import { Tabs, TabsProps } from 'antd';
import EditProfile from './_components/edit-profile';
import ResetPassword from './_components/reset-password';
import ChangeEmailForm from './_components/change-email-form';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const Profile = () => {

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      children: <UserProfilePage />,
    },
    {
      key: 'edit profile',
      label: 'Edit Profile',
      children: <EditProfile />,
    },
    {
      key: 'password Reset',
      label: 'Reset Password',
      children: <ResetPassword />,
    },
    {
      key: 'change email',
      label: 'Change Email',
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