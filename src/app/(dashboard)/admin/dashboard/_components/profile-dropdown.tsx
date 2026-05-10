import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Flex, Typography } from "antd";
import { useAuthStore } from "@/stores/auth.store";
import successMessage from "@/hooks/succes-message";

const { Text } = Typography;

const ProfileDropdown = () => {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    successMessage("Logged out successfully.");
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
        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=utshomh" />
      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
