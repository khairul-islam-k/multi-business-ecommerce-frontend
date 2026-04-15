"use client";

import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";

const products = [
  {
    id: 1,
    image: "https://picsum.photos/id/1015/600/800",
    title: "Premium Sneakers",
    likes: "2.4k",
  },
  {
    id: 2,
    image: "https://picsum.photos/id/201/600/800",
    title: "Matte Nail Polish",
    likes: "1.8k",
  },
  {
    id: 3,
    image: "https://picsum.photos/id/106/600/800",
    title: "Modern Dining Chair",
    likes: "3.1k",
  },
  {
    id: 4,
    image: "https://picsum.photos/id/292/600/800",
    title: "Ceramic Bowl Set",
    likes: "964",
  },
  {
    id: 5,
    image: "https://picsum.photos/id/1074/600/800",
    title: "Minimalist Vase",
    likes: "1.2k",
  },
];

export default function SocialCommerceWave() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-tight">
            What is Social Commerce?
            <br />
            Trends and Key Insights for 2025
          </h1>
          <p className="mt-6 text-xl text-zinc-600 max-w-3xl mx-auto">
            The statistics, trends, and strategies that will shape social
            commerce in 2025.
          </p>
        </div>

        {/* Single Row Wave Layout */}
        <div className="relative bg-linear-to-br from-blue-500 via-teal-500 to-cyan-500 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide md:overflow-visible md:justify-center">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`group shrink-0 w-70 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 snap-center
                  ${index === 0 ? "-mt-8" : ""}
                  ${index === 1 ? "mt-4" : ""}
                  ${index === 2 ? "-mt-10" : ""}
                  ${index === 3 ? "mt-6" : ""}
                  ${index === 4 ? "-mt-5" : ""}
                `}
              >
                <div className="relative aspect-[4/4.2] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Hover Social Icons */}
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                    <button className="bg-white p-3 rounded-2xl shadow hover:bg-zinc-100">
                      <Heart className="w-4 h-4 text-zinc-700" />
                    </button>
                    <button className="bg-white p-3 rounded-2xl shadow hover:bg-zinc-100">
                      <MessageCircle className="w-4 h-4 text-zinc-700" />
                    </button>
                    <button className="bg-white p-3 rounded-2xl shadow hover:bg-zinc-100">
                      <Bookmark className="w-4 h-4 text-zinc-700" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-xl text-zinc-900 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-6 text-sm text-zinc-500">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {product.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" /> 142
                      </div>
                    </div>
                    <Share2 className="w-4 h-4 cursor-pointer hover:text-zinc-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
