"use client";

import { motion } from "framer-motion";
import { Spin, Typography } from "antd";

const { Text } = Typography;

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center gap-4"
      >
        {/* Spinner with animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
        >
          <Spin size="large" />
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Text className="text-base text-gray-500">
            Loading, please wait...
          </Text>
        </motion.div>

        {/* Subtle pulsing dots */}
        <motion.div
          className="flex gap-1 mt-2"
          initial="start"
          animate="animate"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              variants={{
                start: { opacity: 0.3 },
                animate: {
                  opacity: [0.3, 1, 0.3],
                },
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
