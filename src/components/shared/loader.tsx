"use client";

import { motion } from "framer-motion";
import { Typography, theme } from "antd";

const { Text } = Typography;

type LoaderProps = {
  label?: string;
  description?: string;
  fullPage?: boolean;
};

export default function Loader({
  label = "Loading workspace",
  description = "Preparing the latest business data.",
  fullPage = false,
}: LoaderProps) {
  const { token } = theme.useToken();

  return (
    <div
      className={`flex w-full items-center justify-center px-4 ${
        fullPage ? "min-h-screen" : "min-h-52"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm rounded-lg border border-black/10 bg-white/80 p-5 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/80"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <motion.div
            className="grid h-8 w-8 grid-cols-2 gap-1"
            initial="initial"
            animate="animate"
          >
            {[0, 1, 2, 3].map((item) => (
              <motion.span
                key={item}
                className="rounded-sm"
                style={{ backgroundColor: token.colorPrimary }}
                variants={{
                  initial: { opacity: 0.35, scale: 0.85 },
                  animate: { opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] },
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: item * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-4"
        >
          <Text strong className="block text-base">
            {label}
          </Text>
          <Text type="secondary" className="mt-1 block text-sm">
            {description}
          </Text>
        </motion.div>

        <motion.div className="mt-5 space-y-2" initial="initial" animate="animate">
          {[0, 1, 2].map((item) => (
            <motion.div
              key={item}
              className="h-2 rounded-full"
              style={{
                backgroundColor: token.colorFillSecondary,
                width: `${90 - item * 14}%`,
              }}
              variants={{
                initial: { opacity: 0.4 },
                animate: { opacity: [0.4, 0.9, 0.4] },
              }}
              transition={{
                duration: 1.35,
                repeat: Infinity,
                delay: item * 0.16,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
