import { Typography } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

const { Text } = Typography;

export default function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <CheckCircleTwoTone twoToneColor="#52c41a" />
      <Text>{text}</Text>
    </div>
  );
}
