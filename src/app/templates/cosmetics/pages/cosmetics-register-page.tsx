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

export default function CosmeticsRegisterPage() {
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
        "w-full rounded-2xl border border-[#eadde2] bg-[var(--store-bg-1)] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#a9969e] hover:border-[#d9bcc7] focus:border-[#bd6f8c] focus:ring-4 focus:ring-[#bd6f8c]/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:hover:border-white/20 dark:focus:border-[#e6a7bd] dark:focus:bg-white/[0.07]";

    return (
        <main className="min-h-screen bg-[var(--store-bg-2)] dark:bg-[#160f13]">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.02fr_0.98fr]">
                {/* Left Form Side */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
                    {/* Decorative cosmetics background */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-[#e8b8c9]/30 blur-3xl dark:bg-[#8d3d5a]/15" />
                        <div className="absolute -bottom-28 right-0 size-80 rounded-full bg-[#f3d8c9]/45 blur-3xl dark:bg-[#9d5d3f]/10" />
                        <div className="absolute left-[45%] top-[16%] size-32 rounded-full bg-white/80 blur-3xl dark:bg-white/5" />
                    </div>

                    <div className="relative z-10 w-full max-w-[560px]">
                        <Link
                            href="/store"
                            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#7f6770] transition hover:text-[#a94f70] dark:text-white/55 dark:hover:text-[#efb5ca]"
                        >
                            <ArrowLeft className="size-4" />
                            Back to store
                        </Link>

                        <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[var(--store-bg-1)] shadow-[0_30px_90px_-42px_rgba(87,39,57,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_30px_90px_-42px_rgba(0,0,0,0.8)]">
                            <div className="h-1.5 bg-gradient-to-r from-[#8f3f5d] via-[#d08aa3] to-[#efd0bb]" />

                            <div className="p-6 sm:p-8 lg:p-10">
                                <div className="mb-8">
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ecd6de] bg-[var(--store-bg-1)] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a4f6b] dark:border-white/10 dark:bg-white/5 dark:text-[#efb5ca]">
                                        <Sparkles className="size-4" />
                                        Beauty begins here
                                    </div>

                                    <h1 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-[44px] dark:text-white">
                                        Create your beauty
                                        <span className="block italic text-[#a94f70] dark:text-[#efb5ca]">
                                            account
                                        </span>
                                    </h1>

                                    <p className="mt-4 max-w-md text-sm leading-6 dark:text-white/55">
                                        Join our beauty community to save your
                                        favourites, track orders and discover
                                        products selected for you.
                                    </p>
                                </div>

                                {serverError && (
                                    <div
                                        role="alert"
                                        className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
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
                                            className="mb-2 block text-sm font-semibold dark:text-white/80"
                                        >
                                            Full Name
                                        </label>

                                        <div className="relative">
                                            <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b18c9a] dark:text-white/35" />

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
                                            className="mb-2 block text-sm font-semibold  dark:text-white/80"
                                        >
                                            Email Address
                                        </label>

                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b18c9a] dark:text-white/35" />

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
                                            className="mb-2 block text-sm font-semibold dark:text-white/80"
                                        >
                                            Phone Number
                                            <span className="ml-1 font-normal text-[#a49098] dark:text-white/35">
                                                (Optional)
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b18c9a] dark:text-white/35" />

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
                                            className="mb-2 block text-sm font-semibold dark:text-white/80"
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b18c9a] dark:text-white/35" />

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
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a98a96] transition hover:text-[#7f3d56] dark:text-white/35 dark:hover:text-white/80"
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
                                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8f3f5d] px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_-15px_rgba(143,63,93,0.75)] transition hover:-translate-y-0.5 hover:bg-[#7d344f] hover:shadow-[0_20px_40px_-16px_rgba(143,63,93,0.9)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-[#c57794] dark:text-[#1c1015] dark:hover:bg-[#d58da8]"
                                    >
                                        {isSubmitting
                                            ? "Creating account..."
                                            : "Create Beauty Account"}
                                        {!isSubmitting && (
                                            <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
                                        )}
                                    </button>
                                </form>

                                <div className="my-7 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-[#eadde2] dark:bg-white/10" />
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a08b93] dark:text-white/35">
                                        Already a member?
                                    </span>
                                    <div className="h-px flex-1 bg-[#eadde2] dark:bg-white/10" />
                                </div>

                                <p className="text-center text-sm text-[#78656d] dark:text-white/55">
                                    Already have an account?{" "}
                                    <Link
                                        href="/store/login"
                                        className="font-semibold text-[#9f4b69] transition hover:text-[#7d344f] hover:underline dark:text-[#efb5ca] dark:hover:text-[#ffd4e2]"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Cosmetics Image Side */}
                <section className="relative hidden min-h-screen overflow-hidden lg:block">
                    <Image
                        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=88"
                        alt="Luxury cosmetics and beauty products"
                        fill
                        priority
                        unoptimized
                        sizes="(min-width: 1024px) 49vw, 0vw"
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-[#2b111b]/25 via-[#32141f]/20 to-[#241017]/85" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#461d2b]/20 via-transparent to-transparent" />

                    <div className="absolute left-10 top-10 size-40 rounded-full border border-white/15 xl:left-14 xl:top-14" />
                    <div className="absolute left-24 top-24 size-10 rounded-full border border-white/20 xl:left-28 xl:top-28" />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-10 xl:p-14">
                        <Link
                            href="/store"
                            className="inline-flex items-center gap-3 text-xl font-semibold tracking-wide text-white"
                        >
                            <span className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                                <ShoppingBag className="size-5" />
                            </span>

                            Beauty Store
                        </Link>

                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                            <ShieldCheck className="size-4" />
                            Secure registration
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
                        <div className="max-w-xl">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="h-px w-12 bg-white/65" />
                                <span className="text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
                                    Your daily beauty ritual
                                </span>
                            </div>

                            <h2 className="max-w-lg font-serif text-5xl font-medium leading-[1.02] tracking-[-0.03em] xl:text-6xl">
                                Reveal the beauty
                                <span className="block italic text-[#f4c8d7]">
                                    within you.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-base leading-7 text-white/72">
                                Create your account to explore skincare,
                                makeup and beauty essentials made to elevate
                                every part of your routine.
                            </p>

                            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                                {[
                                    {
                                        label: "Clean beauty",
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
                                        className="flex min-h-20 flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-3.5 text-xs font-medium backdrop-blur-md"
                                    >
                                        <Icon className="size-5 text-[#f4c8d7]" />
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