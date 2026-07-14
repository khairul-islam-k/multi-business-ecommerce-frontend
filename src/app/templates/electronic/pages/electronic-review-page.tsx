"use client";

import { useTemplateProductReviewQuery } from "@/lib/api/hooks/template-product-review";
import React from "react";

const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <span
                        key={index}
                        className={`text-base sm:text-lg ${index < rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                    >
                        ★
                    </span>
                ))}
            </div>

            <span className="ml-1 text-xs font-medium text-gray-600 sm:text-sm">
                {rating}/5
            </span>
        </div>
    );
};

const getStatusClassName = (status: string) => {
    switch (status) {
        case "APPROVED":
            return "bg-green-50 text-green-700 ring-green-200";
        case "REJECTED":
            return "bg-red-50 text-red-700 ring-red-200";
        default:
            return "bg-yellow-50 text-yellow-700 ring-yellow-200";
    }
};

const ElectronicReviewPage = () => {
    const { data: review, isLoading, isError } = useTemplateProductReviewQuery();

    const reviews = review?.items ?? [];

    if (isLoading) {
        return (
            <section className="min-h-screen bg-[var(--store-bg-3)] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6">
                        <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                            >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                                </div>

                                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                                    <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center sm:p-8">
                        <h2 className="text-base font-semibold text-red-700 sm:text-lg">
                            Failed to load reviews
                        </h2>
                        <p className="mt-1 text-sm text-red-600">
                            Please try again later.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[var(--store-bg-3)] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-5 rounded-2xl bg-[var(--store-bg-1)] p-4 shadow-sm sm:mb-8 sm:p-6">
                    <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                        My Reviews
                    </h1>

                    <p className="mt-1 text-sm leading-6 sm:text-base">
                        View all product reviews you have submitted.
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-[var(--store-bg-1)] px-4 py-10 text-center shadow-sm sm:px-8 sm:py-14">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--store-bg-3)] text-2xl sm:size-16">
                            ★
                        </div>

                        <h2 className="text-base font-semibold sm:text-lg">
                            No reviews found
                        </h2>

                        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                            You have not submitted any reviews yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                        {reviews.map((item) => (
                            <article
                                key={item.id}
                                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-[var(--store-bg-1)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                            >
                                <div className="mb-4 flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between sm:flex-col sm:items-start lg:flex-row lg:items-center lg:justify-between">
                                    <RatingStars rating={item.rating} />

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClassName(
                                            item.status
                                        )}`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                <h2 className="line-clamp-2 text-base font-semibold leading-6 sm:text-lg">
                                    {item.title}
                                </h2>

                                <div className='h-20 overflow-y-auto'>
                                    <p className="mt-3 line-clamp-5 flex-1 text-sm leading-6 sm:line-clamp-4">
                                        {item.comment}
                                    </p>
                                </div>

                                <div className="mt-5 border-t border-gray-100 pt-4">
                                    <p className="text-xs leading-5 text-gray-400 sm:text-sm">
                                        Submitted on{" "}
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "N/A"}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ElectronicReviewPage;