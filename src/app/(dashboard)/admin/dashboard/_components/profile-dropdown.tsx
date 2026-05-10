import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";

import { useSwal } from "@/hooks/use-swal";
import { useAuthStore } from "@/stores/auth.store";

const { Text } = Typography;

const ProfileDropdown = () => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const selectedBusiness = useAuthStore((s) => s.selectedBusiness);
  const router = useRouter();
  const swal = useSwal();
  const { token } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    swal.success("Logged out successfully.");
    router.push("/sign-in");
  };

  return (
    <div className="cursor-pointer">
      <Dropdown
        menu={{
          items: [
            {
              key: "profile",
              label: (
                <Link href="/admin/dashboard/profile">
                  <Flex align="center" gap={8}>
                    <ProfileOutlined />
                    <Text>Profile</Text>
                  </Flex>
                </Link>
              ),
            },
            {
              key: "account",
              label: (
                <Link href="/admin/dashboard/profile">
                  <Flex align="center" gap={8}>
                    <SettingOutlined />
                    <Text>Account Settings</Text>
                  </Flex>
                </Link>
              ),
            },
            {
              type: "divider" as const,
            },
            {
              key: "create",
              label: (
                <Button
                  icon={<LogoutOutlined />}
                  type="text"
                  style={{ width: "100%", textAlign: "left" }}
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              ),
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" style={{ height: 44, paddingInline: 8 }}>
          <Space size={10}>
            <Avatar style={{ background: token.colorPrimary }}>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>
            <div className="hidden min-w-0 text-left md:block">
              <Text strong ellipsis style={{ maxWidth: 140 }}>
                {user?.name ?? "User"}
              </Text>
              <div>
                <Tag color="blue">{user?.type ?? "USER"}</Tag>
              </div>
            </div>
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
