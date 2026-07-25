// src/app/store/register/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    ShoppingBag,
    User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import z from "zod";

import { useMessage } from "@/app/store/_components/message/message-hook";
import OtpVerifyModal from "@/app/store/_components/otp-verify-modal";
import { templateAuthApi } from "@/lib/api/template-auth";
import { CustomerRegisterPayload } from "@/types/template/auth";

export const customerRegisterSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter",
        )
        .regex(
            /[a-z]/,
            "Password must contain at least one lowercase letter",
        )
        .regex(
            /[0-9]/,
            "Password must contain at least one number",
        )
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character",
        ),

    phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine(
            (value) => {
                if (!value) return true;

                return /^(\+8801|01)[3-9]\d{8}$/.test(value);
            },
            {
                message: "Please enter a valid Bangladeshi phone number",
            },
        ),
});

export default function VehicleRegisterPage() {
    const router = useRouter();
    const message = useMessage();

    const [openOtpModal, setOpenOtpModal] =
        useState<boolean>(false);
    const [otpEmail, setOtpEmail] =
        useState<string>("");
    const [showPassword, setShowPassword] =
        useState(false);
    const [serverError, setServerError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CustomerRegisterPayload>({
        resolver: zodResolver(customerRegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
        },
    });

    const onSubmit = async (
        data: CustomerRegisterPayload,
    ) => {
        try {
            setServerError(null);

            const response =
                await templateAuthApi.register(data);

            setOtpEmail(response?.customer?.email);
            setOpenOtpModal(true);
            message.success("Registered successfully");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Registration failed. Please try again.";

                setServerError(errorMessage);
                return;
            }

            setServerError(
                "Registration failed. Please try again.",
            );
        }
    };

    const inputClassName =
        "w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#f16d59] focus:ring-4 focus:ring-[#f16d59]/10";

    return (
        <main className="min-h-screen bg-[var(--store-bg-3)]">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
                {/* Left Form Side */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
                    {/* Background decoration */}
                    <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-[#f16d59]/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-0 size-72 rounded-full bg-orange-200/30 blur-3xl" />

                    <div className="relative z-10 w-full max-w-[520px]">
                        <Link
                            href="/store"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#f16d59]"
                        >
                            <ArrowLeft className="size-4" />
                            Back to store
                        </Link>

                        <div className="rounded-[28px] border border-gray-100 bg-[var(--store-bg-1)] p-6 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.25)] sm:p-8 lg:p-10">
                            <div className="mb-8">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#f16d59]/10 text-[#f16d59]">
                                    <User className="size-6" />
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                                    Create your account
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Enter your information below to create
                                    your shopping account.
                                </p>
                            </div>

                            {serverError && (
                                <div
                                    role="alert"
                                    className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                                >
                                    {serverError}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                {/* Full name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Full Name
                                    </label>

                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                                        <input
                                            id="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Jane Doe"
                                            {...register("name")}
                                            className={inputClassName}
                                        />
                                    </div>

                                    {errors.name && (
                                        <p className="mt-1.5 text-sm text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="jane@example.com"
                                            {...register("email")}
                                            className={inputClassName}
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-1.5 text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Phone Number
                                        <span className="ml-1 font-normal text-gray-400">
                                            (Optional)
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                                        <input
                                            id="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="+8801712345678"
                                            {...register("phone")}
                                            className={inputClassName}
                                        />
                                    </div>

                                    {errors.phone && (
                                        <p className="mt-1.5 text-sm text-red-500">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            placeholder="StrongPass123!"
                                            {...register("password")}
                                            className={`${inputClassName} pr-12`}
                                        />

                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) => !previous,
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-5" />
                                            ) : (
                                                <Eye className="size-5" />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center rounded-xl bg-[#f16d59] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#f16d59]/20 transition hover:-translate-y-0.5 hover:bg-[#df5e4b] hover:shadow-xl hover:shadow-[#f16d59]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                >
                                    {isSubmitting
                                        ? "Creating account..."
                                        : "Create Account"}
                                </button>
                            </form>

                            <div className="my-7 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Already registered?
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link
                                    href="/store/login"
                                    className="font-semibold text-[#f16d59] transition hover:text-[#df5e4b] hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Right Image Side */}
                <section className="relative hidden min-h-screen overflow-hidden lg:block">
                    <Image
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
                        alt="Modern vehicle"
                        fill
                        priority
                        unoptimized
                        sizes="(min-width: 1024px) 52vw, 0vw"
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/75" />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-10 xl:p-14">
                        <Link
                            href="/store"
                            className="inline-flex items-center gap-2 text-xl font-bold text-white"
                        >
                            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                                <ShoppingBag className="size-5" />
                            </span>

                            Store
                        </Link>

                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                            <ShieldCheck className="size-4" />
                            Secure registration
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
                        <div className="max-w-xl">
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                                Start shopping today
                            </span>

                            <h2 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
                                Everything you love,
                                <br />
                                all in one place.
                            </h2>

                            <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                                Create an account to manage orders,
                                save your favourite products and enjoy
                                a faster checkout experience.
                            </p>

                            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                                {[
                                    "Track orders",
                                    "Save favourites",
                                    "Faster checkout",
                                ].map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-xs font-medium backdrop-blur-md"
                                    >
                                        <CheckCircle2 className="size-4 shrink-0 text-white" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <OtpVerifyModal
                open={openOtpModal}
                email={otpEmail}
                onClose={() =>
                    setOpenOtpModal(false)
                }
                onVerified={() => {
                    router.push("/store/login");
                }}
            />
        </main>
    );
}