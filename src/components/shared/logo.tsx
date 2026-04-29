"use client";

import { Typography, Flex } from "antd";
import { useRouter } from "next/navigation";
import { CloudOutlined } from "@ant-design/icons";

import { cn } from "@/lib/utils";

const { Text } = Typography;

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  white?: boolean;
}

export default function Logo({
  collapsed = false,
  className = "",
  white = false,
}: LogoProps) {
  const router = useRouter();

  return (
    <Flex
      align="center"
      gap={collapsed ? 0 : 10}
      className={cn(
        "overflow-hidden transition-all duration-300 cursor-pointer",
        className,
      )}
      style={{ transition: "all 0.3s ease" }}
      onClick={() => router.push("/")}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
          transition: "all 0.3s ease",
        }}
      >
        <CloudOutlined />
      </div>

      <Text
        style={{
          fontSize: collapsed ? 0 : 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          transition: "all 0.3s ease",
          color: white ? "white" : "inherit",
        }}
      >
        {!collapsed && "OneComm"}
      </Text>
    </Flex>
  );
}
