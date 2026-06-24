"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  GitCompareArrows,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { StorefrontProduct } from "@/types/template/template-product";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";



type Props = {
  product: StorefrontProduct;
  viewMode?: "grid" | "list";
  activeId?: string;
};

const ProductCard = ({ product, viewMode = "grid", activeId }: Props) => {
  const thumbnail =
    product.images.find((image) => image.isThumbnail)?.imageUrl ||
    product.images[0]?.imageUrl;


  const { store } = useParams<{ store: string }>();

  const isList = viewMode === "list";

  return (
    <div
      className={`group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isList ? "lg:flex lg:items-stretch" : ""
        }`}
    >
      {/* Image Area */}
      <div
        className={`relative overflow-hidden bg-[#f8f5f1] ${isList ? "h-[300px] lg:h-auto lg:min-h-[280px] lg:w-[320px] lg:shrink-0" : "h-[300px]"
          }`}
      >
        {thumbnail && (
          <Image
            src={imageUrlSet(thumbnail)}
            alt={product.name}
            fill
            sizes={
              isList
                ? "(max-width: 1024px) 100vw, 320px"
                : "(max-width: 768px) 100vw, 25vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Tag */}

        {
          product.tags?.map(singleData => {
            const activeTag = singleData.id === activeId;
            return <span
              key={singleData.id}
              className={`absolute left-4 top-4 rounded-full bg-[#f16d59] px-3 py-1 text-xs font-semibold text-white ${!activeTag && "hidden"}`}>

              {singleData.name}

            </span>
          })
        }

        {/* Heart Icon */}
        <button
          type="button"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Bottom Icons */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-8 items-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            aria-label="Compare"
          >
            <GitCompareArrows className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>

          <Link
            href={`/store/${store}/products/details/${product.id}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:bg-[#f16d59] hover:text-white"
            aria-label="View product"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div
        className={`p-5 ${isList
          ? "text-center lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-8 lg:text-left"
          : "text-center"
          }`}
      >
        <h3
          className={`line-clamp-1 font-semibold text-gray-950 transition group-hover:text-[#f16d59] ${isList ? "text-base lg:text-2xl" : "text-base"
            }`}
        >
          {product.name}
        </h3>

        {/* Description only for list view on large screen */}
        {isList && (
          <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-gray-500 lg:block">
            {product.description}
          </p>
        )}

        <div
          className={`mt-2 flex items-center gap-1 ${isList ? "justify-center lg:justify-start" : "justify-center"
            }`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${index < product.reviewSummary.averageRating
                ? "fill-[#f16d59] text-[#f16d59]"
                : "text-gray-300"
                }`}
            />
          ))}

          <span className="ml-1 text-xs text-gray-500">
            ({product.reviewSummary.reviewCount})
          </span>
        </div>

        <p className="mt-3 text-lg font-bold text-gray-950">
          ৳{product.price}
        </p>

        <p
          className={`mt-2 text-xs font-medium ${product.stockSummary.inStock ? "text-green-600" : "text-red-500"
            }`}
        >
          {product.stockSummary.inStock ? "In Stock" : "Out of Stock"}
        </p>

        {/* List view buttons only large screen */}
        {isList && (
          <div className="mt-5 hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f16d59] px-6 text-sm font-semibold text-white transition hover:bg-gray-950"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>

            <Link
              href={`/store/${store}/products/details/${product.id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-300 px-6 text-sm font-semibold text-gray-800 transition hover:border-[#f16d59] hover:text-[#f16d59]"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;