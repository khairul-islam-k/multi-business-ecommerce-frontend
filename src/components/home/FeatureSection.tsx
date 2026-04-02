'use client';

import React from "react";
import {
  ShoppingCartOutlined,
  LineChartOutlined,
  BgColorsOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { theme } from "antd";

const totals = [
  {
    title: "Smart Cart",
    description:
      "Intelligent cart with upsells, cross-sells, and abandoned cart recovery.",
    icon: <ShoppingCartOutlined />,
  },
  {
    title: "Analytics",
    description:
      "Real-time dashboards with conversion funnels and customer insights.",
    icon: <LineChartOutlined />,
  },
  {
    title: "Custom Themes",
    description:
      "Drag-and-drop theme builder with 100+ premium templates.",
    icon: <BgColorsOutlined />,
  },
  {
    title: "Secure Payments",
    description:
      "PCI-compliant with 50+ payment gateways worldwide.",
    icon: <SafetyOutlined />,
  },
  {
    title: "Lightning Fast",
    description:
      "Global CDN with edge caching for sub-second page loads.",
    icon: <ThunderboltOutlined />,
  },
  {
    title: "Multi-language",
    description:
      "Sell globally with auto-translation in 40+ languages.",
    icon: <GlobalOutlined />,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const FeatureSection = () => {
    const { token } = theme.useToken();

  return (
    <section
    style={{color: token.colorTextHeading}}
    className="px-4 py-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h3 className="text-orange-500 font-semibold">Features</h3>
        <h1 style={{fontSize: '20px',
            fontWeight: 'bold'
        }}>
          Everything you need to sell online
        </h1>
        <p className=" mt-2">
          Powerful tools designed to help you launch, manage, and scale your
          e-commerce business.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid mx-auto max-w-[1200px] grid-cols-1 md:grid-cols-3 gap-6"
      >
        {totals.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            style={{background: token.colorBgBase}}
            className="relative rounded-xl shadow-md p-6 hover:shadow-xl"
          >
            {/* Icon */}
            <div className="absolute top-4 right-4 text-2xl text-orange-500">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>

            {/* Description */}
            <p className="text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeatureSection;