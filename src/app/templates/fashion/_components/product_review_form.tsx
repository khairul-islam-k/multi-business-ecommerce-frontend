"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { CreateProductReviewPayload } from "@/types/template/product-review";
import { useTemplateProductReviewMutation } from "@/lib/api/hooks/template-product-review";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";

const productReviewDefaultData: CreateProductReviewPayload = {
  productId: "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913",
  variantId: "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913",
  rating: 5,
  title: "",
  comment: "",
};

type DetailsProps = {
  productId: string;
  slug: string;
}

const ProductReviewForm = ({ productId, slug }: DetailsProps) => {
  const [formData, setFormData] = useState<CreateProductReviewPayload>(
    productReviewDefaultData,
  );

  const message = useMessage();

  const { createReview } = useTemplateProductReviewMutation(slug);

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productId) {
      message.error("Product id is required");
      return;
    }

    if (!formData.rating) {
      message.error("Please select a rating");
      return;
    }

    try {
      const payload: CreateProductReviewPayload = {
        productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      };

      const res = await createReview.mutateAsync(payload);

      console.log("Review created successfully:", res);

      message.success("Review submitted successfully.");

      setFormData({
        rating: 0,
        title: "",
        comment: "",
        productId: ""
      });
    } catch (error) {
      message.error(getWebErrorMessage(error));
    }
  };

  return (
    <div className="lg:px-8 mx-auto max-w-[1220px] mt-8 border border-gray-200 bg-white p-5 shadow-sm lg:p-8">
      <h2 className="text-2xl font-bold text-gray-950">Write a Review</h2>

      <p className="mt-1 text-sm text-gray-500">
        Share your experience about this product.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            Rating
          </label>

          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const ratingValue = index + 1;
              const activeRating = hoverRating || formData.rating;

              return (
                <button
                  key={ratingValue}
                  type="button"
                  onClick={() => handleRatingChange(ratingValue)}
                  onMouseEnter={() => setHoverRating(ratingValue)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${ratingValue <= activeRating
                      ? "fill-[#f16d59] text-[#f16d59]"
                      : "text-gray-300"
                      }`}
                  />
                </button>
              );
            })}

            <span className="ml-2 text-sm font-medium text-gray-600">
              {formData.rating}/5
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-gray-900"
          >
            Review Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Great keyboard"
            className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-700 outline-none transition focus:border-[#f16d59]"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-semibold text-gray-900"
          >
            Comment
          </label>

          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Example: The build quality feels excellent."
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f16d59]"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#f16d59] px-8 text-sm font-bold text-white transition hover:bg-gray-950"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductReviewForm;