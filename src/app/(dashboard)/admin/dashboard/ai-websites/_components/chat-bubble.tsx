"use client";

import { Avatar, Typography, Button } from "antd";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import type { ChatMessage } from "../types";

const { Paragraph } = Typography;

export function ChatMessageBubble({
  message,
  onPreviewJob,
}: {
  message: ChatMessage;
  onPreviewJob?: (jobId: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      {!isUser && <Avatar icon={<RobotOutlined />} />}
      <div style={{ maxWidth: "70%", margin: "0 8px" }}>
        <Paragraph>{message.content}</Paragraph>

        {message.job?.status === "completed" && (
          <Button type="link" onClick={() => onPreviewJob?.(message.job!.id)}>
            Preview →
          </Button>
        )}
      </div>
      {isUser && <Avatar icon={<UserOutlined />} />}
    </div>
  );
}
