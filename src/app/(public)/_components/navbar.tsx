// components/Navbar.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/shared/logo";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const navLinks = [
  "Home",
  "Pricing",
  "Experts",
  "Funding",
  "Learn",
  "Affiliates",
  "About Us",
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link}
              href="#"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 hover:bg-blue-700 text-white! px-6 py-3 rounded-full font-semibold text-lg flex items-center gap-3 transition-all hover:scale-scale-[1.01]"
            onClick={() => router.push("/admin/sign-in")}
          >
            Create Your Store
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-lg font-medium text-gray-700 hover:text-gray-900"
                >
                  {link}
                </a>
              ))}
              <div className="pt-6 border-t flex flex-col gap-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white! px-6 py-3 rounded-full font-semibold text-lg flex items-center gap-3 transition-all hover:scale-105"
                  onClick={() => router.push("/admin/sign-in")}
                >
                  Create Your Store
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
