import { LogoutOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Flex, Typography } from 'antd';
import React from 'react';

const {Text} = Typography;

const ProfileDropdown = () => {
    return (
        <div>
            <Dropdown
                menu={{
                    items: [
                        {
                            key: "profile",
                            label: (
                                <Flex align="center" gap={8}>
                                    <ProfileOutlined />
                                    <Text>Profile</Text>
                                </Flex>
                            ),
                        },
                        {
                            key: "account",
                            label: (
                                <Flex align="center" gap={8}>
                                    <SettingOutlined />
                                    <Text>Account Settings</Text>
                                </Flex>
                            ),
                        },

                        {
                            type: "divider" as const,
                        },
                        {
                            key: 'create',
                            label: <Button
                            icon={<LogoutOutlined />}
                            type="text" style={{ width: "100%", textAlign: "left" }}>
                                Log out
                            </Button>
                        }
                    ],
                }}
                trigger={['click']}
            >
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=utshomh" />
            </Dropdown>
        </div>
    );
};

export default ProfileDropdown;