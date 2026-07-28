"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    Heart,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
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

export default function ShoesRegisterPage() {
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
        "w-full rounded-xl bg-[var(--store-bg-1)] border border-[#d9d9d2] py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition placeholder:text-[#9b9b92] hover:border-[#a6a69d] focus:border-[#171717] focus:ring-4 focus:ring-[#b8ff35]/35 dark:border-white/10  dark:hover:border-white/25 dark:focus:border-[#b8ff35] dark:focus:ring-[#b8ff35]/15";

    return (
        <main className="min-h-screen dark:bg-[#080808]">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.96fr_1.04fr]">
                {/* Left Form Side */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
                    {/* Decorative sneaker background */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -left-24 -top-24 size-80 rounded-full border-[42px] border-[#b8ff35]/35 dark:border-[#b8ff35]/10" />
                        <div className="absolute -bottom-36 -right-24 size-[430px] rounded-full border-[70px] border-black/[0.035] dark:border-white/[0.025]" />
                        <div className="absolute left-0 top-[22%] h-px w-32 bg-black/10 dark:bg-white/10" />
                        <div className="absolute right-8 top-12 text-[150px] font-black leading-none text-black/[0.025] dark:text-white/[0.018] sm:text-[210px]">
                            01
                        </div>
                    </div>

                    <div className="relative z-10 w-full max-w-[570px]">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <Link
                                href="/store"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#5f5f58] transition hover:text-black dark:text-white/55 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-4" />
                                Back to store
                            </Link>

                            <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#42423d] backdrop-blur sm:flex dark:border-white/10 dark:bg-white/5 dark:text-white/55">
                                <ShieldCheck className="size-3.5" />
                                Secure sign up
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[28px] border border-black/[0.08] bg-[var(--store-card)] shadow-[0_35px_90px_-45px_rgba(0,0,0,0.42)] dark:border-white/10 dark:bg-[#111111] dark:shadow-[0_35px_90px_-45px_rgba(0,0,0,0.95)]">
                            <div className="grid grid-cols-[1fr_auto] border-b border-black/[0.08] dark:border-white/10">
                                <div className="flex items-center gap-2 px-6 py-4 sm:px-8">
                                    <span className="size-2 rounded-full bg-[#b8ff35] shadow-[0_0_0_5px_rgba(184,255,53,0.18)]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#55554e] dark:text-white/50">
                                        New member access
                                    </span>
                                </div>

                                <div className="border-l border-black/[0.08] bg-[#b8ff35] px-5 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-black dark:border-black/10">
                                    Step 01
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 lg:p-10">
                                <div className="mb-8">
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#383832] dark:border-white/10 dark:bg-white/5 dark:text-white/65">
                                        <Sparkles className="size-3.5 text-[#76a800] dark:text-[#b8ff35]" />
                                        Fresh drops start here
                                    </div>

                                    <h1 className="max-w-lg text-4xl font-black uppercase leading-[0.98] tracking-[-0.055em] text-[#111111] sm:text-[48px] dark:text-white">
                                        Create your
                                        <span className="block text-[#76a800] dark:text-[#b8ff35]">
                                            sneaker account
                                        </span>
                                    </h1>

                                    <p className="mt-4 max-w-md text-sm leading-6 text-[#6d6d65] dark:text-white/50">
                                        Save favourite pairs, track every order
                                        and get early access to the latest shoe
                                        releases.
                                    </p>
                                </div>

                                {serverError && (
                                    <div
                                        role="alert"
                                        className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
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
                                            className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] dark:text-white/70"
                                        >
                                            Full Name
                                        </label>

                                        <div className="relative">
                                            <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 dark:text-white/35" />

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
                                            className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] dark:text-white/70"
                                        >
                                            Email Address
                                        </label>

                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c8c83] dark:text-white/35" />

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
                                            className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] dark:text-white/70"
                                        >
                                            Phone Number
                                            <span className="ml-1 font-medium normal-case tracking-normal text-[#8b8b83] dark:text-white/35">
                                                (Optional)
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c8c83] dark:text-white/35" />

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
                                            className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] dark:text-white/70"
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c8c83] dark:text-white/35" />

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
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#84847c] transition hover:text-black dark:text-white/35 dark:hover:text-[#b8ff35]"
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
                                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#161616] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_-18px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-[0_22px_42px_-18px_rgba(0,0,0,0.95)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-[#b8ff35] dark:text-black dark:hover:bg-[#c7ff62]"
                                    >
                                        {isSubmitting
                                            ? "Creating account..."
                                            : "Create Shoe Account"}
                                        {!isSubmitting && (
                                            <ShoppingBag className="size-4 transition-transform group-hover:-rotate-6" />
                                        )}
                                    </button>
                                </form>

                                <div className="my-7 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#888880] dark:text-white/35">
                                        Already registered?
                                    </span>
                                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                                </div>

                                <p className="text-center text-sm text-[#66665f] dark:text-white/50">
                                    Already have an account?{" "}
                                    <Link
                                        href="/store/login"
                                        className="font-bold text-[#111111] underline decoration-[#b8ff35] decoration-2 underline-offset-4 transition hover:text-[#628d00] dark:text-[#b8ff35] dark:hover:text-white"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Shoes Image Side */}
                <section className="relative hidden min-h-screen overflow-hidden bg-[#131313] lg:block">
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=90"
                        alt="Modern red sneaker"
                        fill
                        priority
                        unoptimized
                        sizes="(min-width: 1024px) 52vw, 0vw"
                        className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/85" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/10" />

                    <div className="absolute right-[-100px] top-[15%] size-[430px] rounded-full border-[70px] border-white/10" />
                    <div className="absolute right-10 top-[30%] size-24 rounded-full border border-white/30" />
                    <div className="absolute left-0 top-[42%] h-px w-40 bg-white/35" />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-9 xl:p-12">
                        <Link
                            href="/store"
                            className="inline-flex items-center gap-3 text-xl font-black uppercase tracking-[-0.02em] text-white"
                        >
                            <span className="flex size-12 items-center justify-center rounded-xl border border-white/20 bg-black/20 backdrop-blur-md">
                                <ShoppingBag className="size-5" />
                            </span>

                            Sole District
                        </Link>

                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                            <ShieldCheck className="size-4 text-[#b8ff35]" />
                            Secure registration
                        </div>
                    </div>

                    <div className="absolute left-9 top-1/2 -translate-y-1/2 xl:left-12">
                        <div className="flex flex-col gap-2">
                            {["01", "02", "03"].map((item, index) => (
                                <span
                                    key={item}
                                    className={`h-1 rounded-full transition-all ${
                                        index === 0
                                            ? "w-10 bg-[#b8ff35]"
                                            : "w-5 bg-white/35"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-9 text-white xl:p-12">
                        <div className="max-w-2xl">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="rounded-full bg-[#b8ff35] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                                    Members get more
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                                    New season / 2026
                                </span>
                            </div>

                            <h2 className="max-w-xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] xl:text-7xl">
                                Find your next
                                <span className="block text-[#b8ff35]">
                                    perfect pair.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
                                Join the store for faster checkout, saved
                                favourites and first access to limited sneaker
                                drops.
                            </p>

                            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                                {[
                                    {
                                        label: "New releases",
                                        icon: Sparkles,
                                    },
                                    {
                                        label: "Save favourites",
                                        icon: Heart,
                                    },
                                    {
                                        label: "Track orders",
                                        icon: CheckCircle2,
                                    },
                                ].map(({ label, icon: Icon }) => (
                                    <div
                                        key={label}
                                        className="flex min-h-24 flex-col justify-between rounded-2xl border border-white/15 bg-black/20 p-4 text-xs font-semibold backdrop-blur-md"
                                    >
                                        <Icon className="size-5 text-[#b8ff35]" />
                                        <span>{label}</span>
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