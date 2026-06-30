import Image, { StaticImageData } from "next/image";

import partner_1 from "@/assets/fashion/partner/partner-1.jpg";
import partner_2 from "@/assets/fashion/partner/partner-2.jpg";
import partner_3 from "@/assets/fashion/partner/partner-3.jpg";
import partner_4 from "@/assets/fashion/partner/partner-4.jpg";
import partner_5 from "@/assets/fashion/partner/partner-5.jpg";
import partner_6 from "@/assets/fashion/partner/partner-6.jpg";
import partner_7 from "@/assets/fashion/partner/partner-7.jpg";
import partner_8 from "@/assets/fashion/partner/partner-8.jpg";
import partner_9 from "@/assets/fashion/partner/partner-9.jpg";
import partner_10 from "@/assets/fashion/partner/partner-10.jpg";
import partner_11 from "@/assets/fashion/partner/partner-11.jpg";
import partner_12 from "@/assets/fashion/partner/partner-12.jpg";

type Partner = {
  id: number;
  name: string;
  image: StaticImageData;
};

const partners: Partner[] = [
  {
    id: 1,
    name: "Partner 1",
    image: partner_1,
  },
  {
    id: 2,
    name: "Partner 2",
    image: partner_2,
  },
  {
    id: 3,
    name: "Partner 3",
    image: partner_3,
  },
  {
    id: 4,
    name: "Partner 4",
    image: partner_4,
  },
  {
    id: 5,
    name: "Partner 5",
    image: partner_5,
  },
  {
    id: 6,
    name: "Partner 6",
    image: partner_6,
  },
  {
    id: 7,
    name: "Partner 7",
    image: partner_7,
  },
  {
    id: 8,
    name: "Partner 8",
    image: partner_8,
  },
  {
    id: 9,
    name: "Partner 9",
    image: partner_9,
  },
  {
    id: 10,
    name: "Partner 10",
    image: partner_10,
  },
  {
    id: 11,
    name: "Partner 11",
    image: partner_11,
  },
  {
    id: 12,
    name: "Partner 12",
    image: partner_12,
  },
];

const PartnerSection = () => {
  return (
    <section className="bg-[var(--store-bg-1)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Our Partners
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            We work with trusted fashion brands and partners to bring you the
            best quality products and shopping experience.
          </p>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group flex h-20 items-center justify-center  border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#f16d59] hover:shadow-lg"
            >
              <div className="relative h-full w-full">
                <Image
                  src={partner.image}
                  alt={partner.name}
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