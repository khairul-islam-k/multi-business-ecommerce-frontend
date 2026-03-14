import { Typography, Flex } from "antd";
import { CloudOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Logo() {
  return (
    <Flex align="center" gap={10}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        <CloudOutlined />
      </div>

      <Text
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        OneComm
      </Text>
    </Flex>
  );
}
