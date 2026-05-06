"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Typography, theme } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { TextArea } = Input;
const { Text } = Typography;

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Write a product description for a wireless speaker",
  "Create a promotional SMS for a flash sale",
  "Generate 5 slogan ideas for a fitness brand",
  "Draft an email subject line for a holiday campaign",
];

export default function AiMarketingChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Marketing Assistant. What would you like to create today?",
    },
  ]);
  const { token } = theme.useToken();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const send = (text: string) => {
    if (!text.trim()) return;

    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      {
        role: "assistant",
        content: `Here's a polished version:\n\n"${text}" — Experience the extraordinary. Designed for those who demand the best.`,
      },
    ]);

    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6">
      <PageHeader title="AI Marketing Chat" breadcrumb={adminBreadcrumb} />

      <Card
        style={{
          height: "calc(100vh - 164px)",
          display: "flex",
          flexDirection: "column",
        }}
        bodyStyle={{
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flexGrow: 1 }} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                }}
              >
                {m.role === "assistant" && <RobotOutlined />}

                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background:
                      m.role === "user"
                        ? token.colorPrimaryActive
                        : token.colorPrimaryBg,
                    color: m.role === "user" ? token.colorWhite : "inherit",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>

                {m.role === "user" && <UserOutlined />}
              </div>
            ))}

            <div ref={bottomRef} />
          </div>
        </div>

        {messages.length === 1 && (
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              Try one of these:
            </Text>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {suggestions.map((s) => (
                <Button
                  key={s}
                  size="small"
                  type="default"
                  style={{
                    borderRadius: 16,
                    padding: "4px 12px",
                  }}
                  onClick={() => send(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            padding: 12,
            background: token.colorBgBase,
            position: "sticky",
            bottom: 0,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              placeholder="Ask me to generate marketing content..."
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => send(input)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
