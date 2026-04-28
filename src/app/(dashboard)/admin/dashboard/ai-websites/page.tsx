"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Typography, theme } from "antd";
import { SendOutlined, BulbOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { ChatMessageBubble } from "./_components/chat-bubble";

const { TextArea } = Input;
const { Text, Title } = Typography;

const suggestions = [
  "Create a SaaS landing page",
  "Build a portfolio website",
  "Generate an e-commerce homepage",
  "Design a startup landing page",
];

export default function AiWebsiteChat() {
  const { token } = theme.useToken();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const send = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Nice! I'm generating a website with hero, features, and contact sections. You can preview it now.",
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="space-y-6">
      <PageHeader title="AI Website Generation" breadcrumb={adminBreadcrumb} />

      <Card
        style={{
          height: "calc(100vh - 160px)",
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
        {/* CHAT AREA */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Empty State */}
          {messages.length === 0 && (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                maxWidth: 420,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 12,
                  color: token.colorPrimary,
                }}
              >
                <BulbOutlined />
              </div>

              <Title level={4}>What do you want to build?</Title>
              <Text type="secondary">
                Describe your website and AI will generate it instantly.
              </Text>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {suggestions.map((s) => (
                  <Button
                    key={s}
                    block
                    onClick={() => send(s)}
                    style={{ textAlign: "left" }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => (
              <ChatMessageBubble key={i} message={msg} />
            ))}

            {/* CTA Button (only after assistant reply) */}
            {messages.length > 0 &&
              lastMessage?.role === "assistant" &&
              !loading && (
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  style={{ alignSelf: "flex-start" }}
                  onClick={() =>
                    router.push(
                      "/admin/dashboard/ai-websites/generated-preview",
                    )
                  }
                >
                  View Generated Website
                </Button>
              )}

            {/* Loading */}
            {loading && (
              <div
                style={{
                  fontSize: 12,
                  color: token.colorTextSecondary,
                }}
              >
                AI is generating...
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT */}
        <div
          style={{
            borderTop: `1px solid ${token.colorBorder}`,
            padding: 12,
            background: token.colorBgContainer,
            position: "sticky",
            bottom: 0,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              placeholder="Describe the website you want..."
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
              loading={loading}
              onClick={() => send(input)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
