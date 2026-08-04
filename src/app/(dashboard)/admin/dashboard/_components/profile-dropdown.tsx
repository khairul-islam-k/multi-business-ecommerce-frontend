import {
  App,
  Avatar,
  Button,
  Dropdown,
  Flex,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getUserAvatarSeed, getUserAvatarUrl } from "@/lib/auth/avatar";
import { useAuthStore } from "@/stores/auth.store";

import { imageUrlSet } from "../product-catalog/products/_components/image-url";

const { Text } = Typography;

const ProfileDropdown = () => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const avatarSeed = getUserAvatarSeed(user);
  const avatarSrc = getUserAvatarUrl(user);

  const imageUrl = user?.profile?.imageUrl ?? "";

  const imageAvatar = imageUrlSet(imageUrl);

  const handleLogout = () => {
    modal.confirm({
      title: "Log out?",
      content: "You will need to sign in again to continue.",
      okText: "Log out",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        await logout();

        message.success("Logged out successfully.");

        router.push("/sign-in");
      },
    });
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
                  <Flex
                    align="center"
                    gap={8}
                    style={{ color: token.colorText }}
                  >
                    <FileText />
                    <Text style={{ color: token.colorText }}>Profile</Text>
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
                  icon={<LogOut />}
                  type="text"
                  style={{
                    color: token.colorText,
                    width: "100%",
                    textAlign: "left",
                  }}
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
        
        <Tooltip
          title={
            <div className="flex flex-col gap-1">
              <span className="font-semibold">
                {user?.name ?? "User"}
              </span>

              <span className="text-xs opacity-80">
                {user?.type ?? "USER"}
              </span>
            </div>
          }
        >
          <Button
            type="text"
            style={{
              height: 44,
              paddingInline: 8,
            }}
          >
            <Space size={10}>
              {imageAvatar ? (
                <Avatar
                  alt={user?.name ?? "User"}
                  src={imageAvatar}
                />
              ) : (
                <Avatar
                  alt={avatarSeed}
                  src={avatarSrc}
                />
              )}
            </Space>
          </Button>
        </Tooltip>

      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
