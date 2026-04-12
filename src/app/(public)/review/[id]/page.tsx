// components/CustomersReview.tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import userImage from "../_assets/user.jpg";

export default function CustomersReview() {
  return (
    <section className="py-5 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Selim Alom Sorkar
              </h3>
              <p className="text-2xl text-blue-600 font-medium mt-3">
                Founder & CEO, CarterTech
              </p>
            </div>

            <div className="text-lg text-gray-600 leading-relaxed">
              OneComm is a powerful platform built for modern businesses. Tenant
              and employee accounts are thoughtfully designed, enabling smooth
              operations, role-based access, and effortless team management.
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="h-px w-12 bg-blue-600" />
              <span className="uppercase text-xs tracking-widest font-medium text-gray-500">
                Real Voice from Our Community
              </span>
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-4/3 lg:aspect-square relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={userImage}
                alt="Selim Alom Sorkar - Founder & CEO of CarterTech"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-55">
              <div className="flex items-center gap-4">
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7-7 7M5 12h14"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    "Game changer for our business"
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    - Selim Alom Sorkar
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
