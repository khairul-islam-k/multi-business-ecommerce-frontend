"use client";

import { motion } from "framer-motion";

import analytics from "./_assets/analytics.jpg";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="py-10 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-widest text-sm">
            ABOUT US
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Empowering merchants worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Founded in 2026, OneComm has helped over 50,000 businesses launch
            and grow their online presence.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Gradient Visual */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(90deg, #10b981, #14b8a6)",
                "linear-gradient(90deg, #14b8a6, #0ea5e9)",
                "linear-gradient(90deg, #0ea5e9, #10b981)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="hidden lg:block h-105 rounded-3xl relative overflow-hidden shadow-2xl"
          >
            <Image
              src={analytics}
              width={500}
              height={500}
              alt=""
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-sm uppercase tracking-widest">Since 2020</p>
              <p className="text-4xl font-bold mt-2">120+ Countries</p>
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Our Story</h3>

            <div className="text-lg text-gray-600 leading-relaxed space-y-6">
              <p>
                We started OneComm because we believed selling online should be
                simple, affordable, and beautiful.
              </p>
              <p>
                Our platform combines powerful technology with intuitive design
                to help anyone build a successful online store. Today, we serve
                merchants in 120+ countries and process over $2B in annual
                transactions.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-gray-500">
                    Businesses Empowered
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">$2B+</div>
                  <div className="text-sm text-gray-500">
                    Processed Annually
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
