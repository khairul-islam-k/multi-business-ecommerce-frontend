"use client";

import { Typography, Flex } from "antd";
import { CloudOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
  return (
    <Flex
      align="center"
      gap={collapsed ? 0 : 10}
      className="overflow-hidden transition-all duration-300"
      style={{ transition: "all 0.3s ease" }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#6366f1",
          display: collapsed ? "none" : "flex",
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
        }}
      >
        {!collapsed && "OneComm"}
      </Text>
    </Flex>
  );
}
