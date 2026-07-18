"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import electronicImg from "@/assets/template/electronic-template.png";
import fashionImg from "@/assets/template/fashion.png";
import groceryImg from "@/assets/template/electronic-template.png";

type TemplateItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  image: StaticImageData;
};

const templates: TemplateItem[] = [
  {
    id: 1,
    name: "Electronic Store",
    category: "Electronics",
    description: "Modern ecommerce template for electronics products.",
    image: electronicImg,
  },
  {
    id: 2,
    name: "Fashion Store",
    category: "Fashion",
    description: "Clean fashion template for clothing and lifestyle brands.",
    image: fashionImg,
  }
];

export default function GalleryCard() {
  return (
    <section className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Website Templates</h1>

        <p className="mt-2 text-sm text-gray-500">
          Hover on a template to preview the full landing page.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Preview */}

            <div className="relative h-[250px] overflow-hidden bg-gray-100">
              <motion.div
                className="w-full"
                initial={{ y: 0 }}
                whileHover={{ y: "-65%" }}
                transition={{
                  duration: 5,
                  ease: "linear",
                }}
              >
                <Image
                  src={template.image}
                  alt={template.name}
                  className="h-auto w-full"
                  priority={template.id === 1}
                />
              </motion.div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 opacity-0 shadow transition group-hover:opacity-100">
                  Preview Template
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--dashboard-primary-color)" }}
              >
                {template.category}
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                {template.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {template.description}
              </p>

              <div className="mt-5 flex gap-3">
                <Link href="/admin/dashboard/website-builder/websites/create-website">
                  <button
                    type="button"
                    className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Use Template
                  </button>
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
