import Image from "next/image";
import Link from "next/link";

import dealOfTheDay from "@/assets/fashion/deal-of-day.png";

const DealOfDay = () => {
  return (
    <section className="bg-[var(--store-bg-1)] py-16">
      <div className="sm:px-6 lg:px-0">
        <div className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-3xl bg-[var(--store-bg-3)] lg:grid-cols-2">
          {/* Left Text */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">

            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Deal <br /> of the Day.
            </h2>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
              CLICK SHOP NOW FOR ALL DEAL OF THE PRODUCT
            </p>

            <p className="mt-6 max-w-xl text-base leading-8">
              Donec condimentum Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Cras cursus pretium sapien, in pulvinar ipsum
              molestie id. Aliquam erat volutpat. Duis quam tellus,
              ullamcorper.....
            </p>

            <p className="mt-6 text-xl font-bold text-[#f16d59]">
              Deal Expired!
            </p>

            <div className="mt-8">
              <Link
                href="/store/products"
                className="inline-flex rounded-full px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 bg-[#f16d59]"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Image - Full Section */}
          <div className="relative min-h-[420px] lg:min-h-full">
            <Image
              src={dealOfTheDay}
              alt="Deal of the day"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealOfDay;