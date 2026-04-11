"use client";

import { motion } from "framer-motion";

export default function Hero({ onBookAppointment }: any) {
  return (
    <section className="min-h-screen bg-linear-to-br from-blue-100 via-white to-purple-200 flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-blue-200 mb-8"
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-700">
              No.1 Online Business Partner
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold text-gray-900 leading-tighter mb-4"
          >
            One Platform.
            <br />
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Thousands of Success Stories
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            More than 100,000 entrepreneurs trust OneComm.
            <br />
            Transform your idea into an online business — fast and easy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white! px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all hover:scale-105">
                Start for Free
                <span className="text-xl">→</span>
              </button>
              <button
                className="border border-blue-600 hover:bg-blue-600 hover:text-white! px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all hover:scale-105"
                onClick={onBookAppointment}
              >
                Book Appointment
                <span className="text-xl">→</span>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              (No credit card needed. No hidden fees.)
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
