import Image from "next/image";
import React from "react";
import { policyData } from "../../fashion/_components/productData";

const PolicyLabel = () => {
  return (
    <section className="bg-[#111827] py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {policyData.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#f16d59] hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-14 w-14 shrink-0">
                <Image
                  src={item.photo}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-base font-bold">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicyLabel;