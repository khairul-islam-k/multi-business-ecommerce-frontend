"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

import view_1 from "@/assets/template/view-1.jpg";
import view_2 from "@/assets/template/view-2.jpg";
import view_3 from "@/assets/template/view-3.jpg";
import view_4 from "@/assets/template/view-4.jpg";
import view_5 from "@/assets/template/view-5.jpg";
import view_6 from "@/assets/template/view-6.jpg";

type ViewProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  photo: StaticImageData;
};

const viewProducts: ViewProduct[] = [
  {
    id: 1,
    title: "Premium Headphone",
    description: "High-quality wireless headphone for everyday use.",
    price: 349,
    photo: view_1,
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Track your health, activity, and notifications.",
    price: 299,
    photo: view_2,
  },
  {
    id: 3,
    title: "Wireless Speaker",
    description: "Powerful sound with long-lasting battery backup.",
    price: 129,
    photo: view_3,
  },
  {
    id: 4,
    title: "Gaming Keyboard",
    description: "Mechanical keys with smooth wireless performance.",
    price: 189,
    photo: view_4,
  },
  {
    id: 5,
    title: "Action Camera",
    description: "Capture every moment with sharp 4K quality.",
    price: 899,
    photo: view_5,
  },
  {
    id: 6,
    title: "USB-C Hub",
    description: "Multi-port hub for laptop and desktop setup.",
    price: 159,
    photo: view_6,
  },
  {
    id: 7,
    title: "Air Buds Pro",
    description: "Compact earbuds with clear sound and deep bass.",
    price: 199,
    photo: view_2,
  },
  {
    id: 8,
    title: "Fitness Ring",
    description: "Smart ring for sleep and heart-rate tracking.",
    price: 249,
    photo: view_3,
  },
  {
    id: 9,
    title: "Mini Speaker",
    description: "Portable Bluetooth speaker for outdoor music.",
    price: 119,
    photo: view_4,
  },
  {
    id: 10,
    title: "Camera Lens",
    description: "Professional lens for better mobile photography.",
    price: 449,
    photo: view_5,
  },
  {
    id: 11,
    title: "Power Dock",
    description: "Fast charging dock with multiple USB ports.",
    price: 89,
    photo: view_6,
  },
  {
    id: 12,
    title: "Noise Cancelling Buds",
    description: "True wireless earbuds with active noise cancelling.",
    price: 229,
    photo: view_1,
  },
];

function chunkArray<T>(array: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size));
  }

  return chunks;
}

const slideVariants = {
  enter: {
    opacity: 0,
    x: 80,
  },
  center: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -80,
  },
};

const RecentlyViewProduct = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(6);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else {
        setItemsPerSlide(6);
      }
    };

    updateItemsPerSlide();

    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  const slides = useMemo(() => {
    return chunkArray(viewProducts, itemsPerSlide);
  }, [itemsPerSlide]);

  const handleNext = () => {
    setActiveSlide((prev) => {
      if (prev === slides.length - 1) {
        return 0;
      }

      return prev + 1;
    });
  };

  const handlePrevious = () => {
    setActiveSlide((prev) => {
      if (prev === 0) {
        return slides.length - 1;
      }

      return prev - 1;
    });
  };

  useEffect(() => {
    setActiveSlide(0);
  }, [itemsPerSlide]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      {/* Section top */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Recently Viewed
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Recently viewed products
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Continue browsing your latest viewed products and add your favorite
            items to cart.
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={handlePrevious}
            className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          >
            {slides[activeSlide]?.map((product) => (
              <motion.article
                key={product.id}
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                {/* Title and description on top */}
                <div className="mb-4">
                  <h3 className="line-clamp-1 text-base font-bold text-gray-900">
                    {product.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                    {product.description}
                  </p>
                </div>

                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={product.photo}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Price left, shopping icon right */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>

                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-gray-900 text-white transition hover:opacity-90"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile arrows */}
      <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={handlePrevious}
          className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="text-sm font-medium text-gray-500">
          {activeSlide + 1} / {slides.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-2 rounded-full transition-all ${
              activeSlide === index
                ? "w-8 bg-gray-900"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewProduct;