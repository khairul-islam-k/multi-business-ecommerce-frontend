import { useState } from "react";

const industries = [
  {
    name: "Motor",
    image:
      "https://images.unsplash.com/photo-1659853700079-450e6a3663e7?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-primary",
  },
  {
    name: "Food & Beverages",
    image:
      "https://images.unsplash.com/photo-1688756164216-a19e07912376?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-emerald-500",
  },
  {
    name: "Pharma & Cosmetics",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-pink-500",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-amber-500",
  },
  {
    name: "Living",
    image:
      "https://images.unsplash.com/photo-1719464636416-97cbe2f8a172?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "bg-teal-500",
  },
];

export default function IndustriesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="industries" className="py-20 bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="w-10 h-1 bg-primary rounded mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-text-light mb-4">
            The best eCommerce platform adapts to{" "}
            <span className="text-primary">all industries</span>
          </h2>
          <p className="text-text-light-secondary max-w-2xl">
            Grow and adapt to market demands with ease of use, scalability,
            customization, integration, and efficient technical support to
            maximize your sales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {industries.map((ind, i) => (
            <div
              key={ind.name}
              className="relative group rounded-xl overflow-hidden cursor-pointer aspect-3/4"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={ind.image}
                alt={ind.name}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  hovered === i ? "scale-110" : "scale-100"
                }`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-text-light font-semibold text-sm sm:text-base">
                  {ind.name}
                </p>
                <div className={`h-0.5 w-10 mt-2 rounded ${ind.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
