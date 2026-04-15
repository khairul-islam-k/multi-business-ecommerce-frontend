"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="bg-blue-700 py-24 rounded-3xl mx-4 my-12 overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Explore the Full Demo and
          <br />
          Discover What&apos;s Possible
        </motion.h2>
        <p className="text-emerald-100 text-sm sm:text-xl mb-10">
          Step inside the OneComm experience and preview how your store will
          look, function, and grow.
        </p>

        <motion.button
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-blue-600! hover:bg-emerald-50 font-semibold px-10 py-4 rounded-full text-lg shadow-lg"
        >
          Explore Demo
        </motion.button>
      </div>
    </section>
  );
}
