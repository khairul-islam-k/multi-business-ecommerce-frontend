// components/Steps.tsx
"use client";
import {
  LineChartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create an Account",
    icon: <UserOutlined />,
    desc: "Welcome to OneComm! Sign up to launch your online store and access powerful tools.",
  },
  {
    number: "02",
    title: "Set Up Your Store",
    icon: <ShoppingCartOutlined />,
    desc: "Add your store name, select your country and category to launch in minutes.",
  },
  {
    number: "03",
    title: "Start Your Sales",
    icon: <LineChartOutlined />,
    desc: "Start selling by adding your product. Enter product details like name, price, and photos.",
  },
];

export default function StepsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Simple Steps to Make Your Website Live
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No need to learn design or development. We simplified everything.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl transition-all group"
            >
              <div className="text-5xl mb-6">{step.icon}</div>
              <div className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1 rounded-full mb-4">
                Step {step.number}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
