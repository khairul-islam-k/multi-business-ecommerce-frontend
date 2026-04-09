"use client";

import { useState } from "react";
import { Card, Typography, Row, Col, Button, Switch, Tag, theme } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

type Plan = {
  name: string;
  desc: string;
  monthly?: string;
  yearly?: string;
  custom?: boolean;
  included: string[];
  excluded?: string[];
  current?: boolean;
};

const { Title, Text } = Typography;

/* ------------------ DATA ------------------ */
export const mockPlans: Plan[] = [
  {
    name: "Starter",
    desc: "Best for small sellers.",
    monthly: "৳2,500",
    yearly: "৳25,000",
    included: [
      "1 company",
      "1 website",
      "2 users",
      "500 products",
      "1,500 orders/month",
      "1 warehouse",
      "basic order management",
      "basic inventory",
      "courier integration",
      "invoice system",
      "dashboard reports",
      "500 SMS/month",
      "email support",
    ],
  },
  {
    name: "Growth",
    desc: "Best for growing e-commerce brands.",
    monthly: "৳6,500",
    yearly: "৳65,000",
    included: [
      "3 companies",
      "3 websites",
      "10 users",
      "5,000 products",
      "15,000 orders/month",
      "5 warehouses",
      "product variants",
      "supplier module",
      "stock transfer",
      "SMS marketing",
      "promotion automation",
      "advanced reports",
      "basic finance",
      "5,000 SMS/month",
      "priority support",
    ],
  },
  {
    name: "Business",
    desc: "Best for established operators.",
    monthly: "৳12,000",
    yearly: "৳120,000",
    current: true,
    included: [
      "10 companies",
      "10 websites",
      "30 users",
      "25,000 products",
      "75,000 orders/month",
      "15 warehouses",
      "full finance module",
      "expense management",
      "role & permission matrix",
      "AI marketing assistant",
      "AI website generator",
      "API access",
      "multi-gateway config",
      "15,000 SMS/month",
      "phone support",
    ],
  },
];

/* ------------------ ANIMATION VARIANTS ------------------ */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/* ------------------ COMPONENT ------------------ */
export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const { token } = theme.useToken();

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "60px auto",
        padding: "0 8px",
        color: token.colorTextHeading
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Text style={{ fontSize: 15, color: "orange" }}>Pricing</Text>
        <h2 style={{ fontSize: 26, fontWeight: "bold" }}>
          Simple, transparent pricing
        </h2>

        <div className="flex justify-center items-center gap-2 mt-2">
          <Switch checked={yearly} onChange={setYearly} />
          <Text>Yearly</Text>
          <Tag color="green">Save 20%</Tag>
        </div>
      </div>

      {/* CARDS */}
      <Row gutter={[16, 16]}>
        {mockPlans.map((plan, i) => (
          <Col xs={24} md={12} lg={8} key={i}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: "easeOut",
              }}
              whileHover={{
                y: -10,
                scale: 1.03,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <Card
                className={`h-full rounded-2xl ${plan.current ? "border border-blue-500" : ""
                  }`}
              >
                {/* HEADER */}
                <div className="mb-3">
                  <div className="flex justify-between items-center">
                    <Title level={4} className="mb-0">
                      {plan.name}
                    </Title>
                    {plan.current && <Tag color="blue">Current</Tag>}
                  </div>
                  <Text type="secondary">{plan.desc}</Text>
                </div>

                {/* PRICE */}
                <div className="mb-4">
                  {plan.custom ? (
                    <Title level={4}>Custom</Title>
                  ) : (
                    <>
                      <Title level={3} className="mb-0">
                        {yearly ? plan.yearly : plan.monthly}
                      </Title>
                      <Text type="secondary">
                        /{yearly ? "year" : "month"}
                      </Text>
                    </>
                  )}
                </div>

                {/* FEATURES */}
                <div className="flex-1">
                  <Text strong>Includes:</Text>

                  <div className="mt-2">
                    {plan.included.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 mb-2"
                      >
                        <CheckOutlined className="text-green-500" />
                        <Text>{f}</Text>
                      </div>
                    ))}
                  </div>

                  {plan.excluded && (
                    <>
                      <div className="mt-4">
                        <Text strong>Not included:</Text>
                      </div>

                      <div className="mt-2">
                        {plan.excluded.map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 mb-2"
                          >
                            <CloseOutlined className="text-red-400" />
                            <Text type="secondary">{f}</Text>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ACTION */}
                {/* <div className="mt-6">
                  {plan.current ? (
                    <Button block disabled>
                      Current Plan
                    </Button>
                  ) : plan.custom ? (
                    <Button type="primary" block>
                      Contact Sales
                    </Button>
                  ) : (
                    <Button type="primary" block>
                      Upgrade
                    </Button>
                  )}
                </div> */}

                <Button type="primary" block>
                  Get started
                </Button>


              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}