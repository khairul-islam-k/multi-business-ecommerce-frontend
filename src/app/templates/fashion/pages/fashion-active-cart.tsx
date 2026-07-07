"use client";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useAddActiveCArt, useAddCartMutation } from "@/lib/api/hooks/add-cart";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { CartImage, CartItem } from "@/types/template/add-cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import PaymentModal from "../_components/payment/payment-modal";
import PaymentGatewayModal from "../_components/payment/payment-gateway-modal";
import { PaymentMethodStatus } from "@/types/template/template-payment";
import CourierSellectModal from "../_components/payment/courier-sellect-modal";
import { CourierDeliveryPayload } from "@/types/courier/courier";



const getItemPrice = (item: CartItem) => {
    if (item.variant) {
        return Number(item.variant.priceOverride);
    }

    return Number(item.product.price);
};

const getItemQuantity = (item: CartItem) => {
    return Number(item.quantity);
};

const getThumbnailImage = (images: CartImage[]) => {
    const thumbnailImage = images.find((image) => image.isThumbnail === true);

    return thumbnailImage?.imageUrl || null;
};

const FashionActiveCart = () => {
    const { data: cart, isLoading } = useAddActiveCArt();
    const message = useMessage();

    // payment
    const [openPayment, setOpenPayment] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string>('');

    const [open, setOpen] = useState<boolean>(false);

    // courier modal
    const [openCourierModal, setOpenCourierModal] = useState<boolean>(false);
    const [courierConfigId, setCourierConfigId] = useState<string>('');
    const [getCourierInfo, setGetCourierInfo] = useState<CourierDeliveryPayload>({
        deliveryAreaId: '',
        deliveryAreaName: '',
        deliveryPostCode: '',
        deliveryDivisionName: '',
        weight: 0
    });

    const { updateQuantity, removeActiveCartItem } = useAddCartMutation();

    const items: CartItem[] = cart?.items ?? [];

    const handleIncrease = async (item: CartItem) => {

        try {
            const payload = {
                quantity: Number(item.quantity) + 1
            };

            await updateQuantity.mutateAsync({
                itemId: item.id,
                payload,
            })
        } catch (error) {
            message.error(getWebErrorMessage(error));
        }

    };

    const handleDecrease = async (item: CartItem) => {
        try {
            const payload = {
                quantity: Number(item.quantity) - 1
            };

            await updateQuantity.mutateAsync({
                itemId: item.id,
                payload,
            })
        } catch (error) {
            message.error(getWebErrorMessage(error));
        }
    };

    const handleDelete = (itemId: string) => {
        message.confirm({
            title: "Remove cart item?",
            content: "Are you sure you want to remove this item from your cart?",
            okText: "Remove",
            cancelText: "Cancel",
            danger: true,

            onConfirm: async () => {
                try {
                    const res = await removeActiveCartItem.mutateAsync(itemId);

                    console.log("res", res);

                    message.success("Cart item removed successfully");
                } catch (error) {
                    message.error(getWebErrorMessage(error));
                }
            },
        });
    };

    const summary = useMemo(() => {
        const subtotal = items?.reduce((total, item) => {
            const price = getItemPrice(item);
            const quantity = getItemQuantity(item);

            return total + price * quantity;
        }, 0);

        const totalQuantity = items?.reduce((total, item) => {
            return total + getItemQuantity(item);
        }, 0);

        const total = subtotal;

        return {
            subtotal,
            totalQuantity,
            total,
        };
    }, [items]);

    const handleOrderModal = (id: string, method: PaymentMethodStatus) => {
        if (method !== 'COD') {
            setOpenPayment(true);
            setOrderId(id);
        }
    }

    if (isLoading) {
        return (
            <section className="bg-[#f8f5f1] px-4 py-10">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">Cart is loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f8f5f1] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-950">Shopping Cart</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Review your selected products before checkout.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-950">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Please add some products to your cart.
                        </p>

                        <Link
                            href="/store/products"
                            className="mt-6 inline-flex rounded-full bg-[#f16d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                            <div className="hidden grid-cols-[1fr_130px_160px_120px_60px] border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-500 lg:grid">
                                <div>Product</div>
                                <div>Price</div>
                                <div>Quantity</div>
                                <div>Total</div>
                                <div></div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {items?.map((item) => {
                                    const price = getItemPrice(item);
                                    const quantity = getItemQuantity(item);
                                    const itemTotal = price * quantity;

                                    const thumbnail = getThumbnailImage(item?.images);

                                    return (
                                        <div
                                            key={item.id}
                                            className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_130px_160px_120px_60px] lg:items-center"
                                        >
                                            <div className="flex gap-4">
                                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                                    {thumbnail ? (
                                                        <Image
                                                            src={imageUrlSet(thumbnail)}
                                                            fill
                                                            alt={item.product.name}
                                                            sizes="96px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <span className="text-2xl font-bold text-gray-400">
                                                                {item.product.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/store/products/details/${item.product.slug}`}
                                                        className="line-clamp-1 text-base font-bold text-gray-950 transition hover:text-[#f16d59]"
                                                    >
                                                        {item.product.name}
                                                    </Link>

                                                    {item.variant ? (
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Variant:{" "}
                                                            <span className="font-medium text-gray-700">
                                                                {item.variant.title}
                                                            </span>
                                                        </p>
                                                    ) : (
                                                        <p className="mt-1 text-sm text-gray-500">No Variant</p>
                                                    )}

                                                    <p className="mt-1 line-clamp-1 text-sm text-gray-400">
                                                        {item.product.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500 lg:hidden">
                                                    Price
                                                </p>
                                                <p className="font-semibold text-gray-950">
                                                    ৳{price.toLocaleString()}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-2 text-sm text-gray-500 lg:hidden">
                                                    Quantity
                                                </p>

                                                <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-200">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrease(item)}
                                                        className="grid h-10 w-10 place-items-center text-gray-600 transition hover:bg-[#f16d59] hover:text-white"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>

                                                    <span className="grid h-10 min-w-12 place-items-center border-x border-gray-200 px-3 text-sm font-semibold text-gray-950">
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleIncrease(item)}
                                                        className="grid h-10 w-10 place-items-center text-gray-600 transition hover:bg-[#f16d59] hover:text-white"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500 lg:hidden">
                                                    Total
                                                </p>
                                                <p className="font-bold text-gray-950">
                                                    ৳{itemTotal.toLocaleString()}
                                                </p>
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-950">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Total Items</span>
                                    <span className="font-semibold text-gray-950">
                                        {summary.totalQuantity}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-gray-950">
                                        ৳{summary.subtotal.toLocaleString()}
                                    </span>
                                </div>


                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-gray-950">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-[#f16d59]">
                                            ৳{summary.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpenCourierModal(true)}
                                className="mt-6 w-full rounded-full bg-[#f16d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                href="/store/products"
                                className="mt-3 inline-flex w-full justify-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#f16d59] hover:text-[#f16d59]"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* courier */}
            <CourierSellectModal
                setCourierConfigId={setCourierConfigId}
                weight={cart?.weight ?? '0'}
                open={openCourierModal}
                onClose={() => setOpenCourierModal(false)}
                onSuccess={(values) => {
                    setGetCourierInfo(values);
                    setOpen(true);
                }}
            />

            <PaymentModal
                open={open}
                getCourierInfo={getCourierInfo}
                courierConfigId={courierConfigId}
                onClose={() => setOpen(false)}
                handleOrderModal={handleOrderModal}
            />

            <PaymentGatewayModal
                open={openPayment}
                orderId={orderId}
                onClose={() => setOpenPayment(false)}
            />
        </section>
    );
};

export default FashionActiveCart;