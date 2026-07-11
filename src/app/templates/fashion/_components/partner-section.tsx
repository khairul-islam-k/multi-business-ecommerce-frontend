import Image from "next/image";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

const PartnerSection = ({partners}:{partners: string[]}) => {
  return (
    <section className="bg-[var(--store-bg-1)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Our Partners
          </h2>

          <p className="mt-4 text-base leading-7">
            We work with trusted fashion brands and partners to bring you the
            best quality products and shopping experience.
          </p>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner}
              className="group flex h-20 items-center justify-center  border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#f16d59] hover:shadow-lg"
            >
              <div className="relative h-full w-full">
                <Image
                  src={imageUrlSet(partner)}
                  alt='partner'
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;