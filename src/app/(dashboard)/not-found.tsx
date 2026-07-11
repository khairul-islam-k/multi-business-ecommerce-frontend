"use client";

import { Button, Result } from "antd";
import { motion } from "framer-motion";
import { StepBack } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Result
            status="404"
            title="Page Not Found"
            subTitle="Sorry, the page you are looking for does not exist."
            extra={
              <Button
                type="primary"
                size="large"
                icon={<StepBack />}
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            }
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
