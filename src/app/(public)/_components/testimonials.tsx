"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const customers = [
  {
    id: 1,
    name: "DATACENTERHAWK",
    logo: "https://images.unsplash.com/photo-1602934445884-da0fa1c9d3b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "MLB",
    logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG9nb3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    name: "CVS HEALTH",
    logo: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 4,
    name: "RETAILCO",
    logo: "https://images.unsplash.com/photo-1615915468538-0fbd857888ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxvZ298ZW58MHx8MHx8fDA%3D",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const visibleCount = 3;
  const maxIndex = customers.length - visibleCount;

  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleCardClick = (id: number) => {
    router.push(`/review/${id}`);
  };

  return (
    <section className="relative bg-linear-to-br from-blue-900 to-blue-950 text-white py-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none">
        <div className="absolute -bottom-20 -left-32 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              What Our
              <br />
              Customers Say
            </h2>

            <p className="text-lg text-blue-100 max-w-md">
              Discover what you can achieve with Broadleaf and transform from
              case studies with Broadleaf customers across every industry.
            </p>

            <button className="border border-blue-400 hover:bg-blue-600 hover:border-blue-600 px-8 py-3.5 rounded-full font-medium transition-all duration-300">
              All Customer Stories
            </button>
          </div>

          {/* Logo Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: `-${currentIndex * (100 / visibleCount)}%`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {customers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    onClick={() => handleCardClick(customer.id)}
                    whileHover={{ scale: 0.98 }}
                    className="group relative bg-white min-w-65 h-45 rounded-3xl flex items-center justify-center p-8 cursor-pointer overflow-hidden border border-white/10 shadow-sm"
                  >
                    {/* Initial State - Only Logo */}
                    <div className="flex items-center justify-center h-full w-full transition-all duration-300 group-hover:opacity-0">
                      <div className="w-28 h-28 bg-linear-to-br from-slate-100 to-zinc-200 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                        <Image
                          src={customer.logo}
                          alt={customer.name}
                          width={90}
                          height={90}
                          className="drop-shadow-md w-full h-auto object-cover rounded-full"
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Hover State - Image Background */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl overflow-hidden">
                      {/* Image-style Background */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(15,23,42,0.75)), url('https://picsum.photos/id/${40 + customer.id}/600/400')`,
                        }}
                      />

                      {/* Overlay Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <p className="text-white font-semibold text-2xl tracking-wide m-0!">
                          {customer.name}
                        </p>
                        <Eye className="w-10 h-10 text-white drop-shadow-md" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4 mt-0 md:mt-10 justify-center md:justify-end">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full border border-blue-400/60 flex items-center justify-center hover:bg-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                className="w-12 h-12 rounded-full border border-blue-400/60 flex items-center justify-center hover:bg-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
