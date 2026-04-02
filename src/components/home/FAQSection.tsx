"use client";

import { Collapse, theme, Typography } from "antd";
import { motion } from "framer-motion";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const faqs = [
  {
    question: "How long does it take to set up a store?",
    answer:
      "You can launch your store within minutes. Our guided setup helps you add products, configure payments, and go live quickly.",
  },
  {
    question: "Do I need technical knowledge to use FleekStore?",
    answer:
      "No technical skills are required. FleekStore is built for non-technical users while still offering advanced features for developers.",
  },
  {
    question: "Can I use my own domain name?",
    answer:
      "Yes. You can connect your own custom domain or purchase one directly through FleekStore.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We support local and international gateways including cards, mobile wallets, bank transfers, and cash-on-delivery.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQSectionWithSpacing() {
    const { token } = theme.useToken();
  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 12px",
      }}
    >
      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <Text style={{ color: "orange", fontWeight: 500 }}>FAQ</Text>
        <Title level={2}>Frequently Asked Questions</Title>
        <Text type="secondary">
          Answers to the most common questions from our users.
        </Text>
      </motion.div>

      {/* FAQ List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Collapse
              accordion
              bordered={false}
              expandIconPlacement="end"
              style={{
                borderRadius: 12,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                background: token.colorBgElevated,
              }}
              expandIcon={({ isActive }) => (
                <motion.span
                  animate={{ rotate: isActive ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <PlusOutlined />
                </motion.span>
              )}
            >
              <Collapse.Panel
                header={<Text strong>{faq.question}</Text>}
                key={index}
                style={{ padding: "0 16px" }}
              >
                <Text type="secondary">{faq.answer}</Text>
              </Collapse.Panel>
            </Collapse>
          </motion.div>
        ))}
      </div>
    </section>
  );
}