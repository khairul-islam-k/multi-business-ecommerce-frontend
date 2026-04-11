// components/BusinessSmarter.tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import user_2 from "@/assets/shipping.jpg";
import products from "@/assets/products.jpg";
import chartImage from "@/assets/analitics.jpg";
import inventory from "@/assets/inventory.jpg";

const businessData = [
  {
    id: 1,
    title: "Shipping Made Simple",
    description:
      "Shipping doesn’t have to be complicated. Connect with top delivery services.",
    photo: user_2,
  },
  {
    id: 2,
    title: "Inventory & Order Management",
    description:
      "Forget about stock shortages or overselling. Track inventory in real-time.",
    photo: inventory,
  },
  {
    id: 3,
    title: "Real-Time Analytics & Insights",
    description:
      "Stay ahead with real-time analytics. Monitor sales and customer behavior.",
    photo: chartImage,
  },
  {
    id: 4,
    title: "Perfect on Every Screen",
    description: "Your store looks stunning on desktop, tablet, or mobile.",
    photo: products,
  },
  {
    id: 5,
    title: "Manage Your Store Anytime",
    description:
      "Easily build, customize, and manage your store with our mobile app.",
    photo: user_2,
  },
  {
    id: 6,
    title: "Customize Your Store",
    description:
      "Choose from beautifully crafted themes and personalize every detail.",
    photo: user_2,
  },
];

export default function BusinessSmarter() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart tools that make your business smarter
          </h2>
          <p className="text-xl text-gray-600">
            Your Complete Ecommerce Toolkit — Manage Shipping, Inventory,
            Orders, and More From One Platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="relative h-52">
                <Image
                  src={item.photo}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="font-semibold text-xl mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
