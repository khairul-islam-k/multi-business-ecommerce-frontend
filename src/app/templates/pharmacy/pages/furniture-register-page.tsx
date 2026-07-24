"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HeartPulse,
  PackageCheck,
  Pill,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import z from "zod";

import { useMessage } from "@/app/store/_components/message/message-hook";
import OtpVerifyModal from "@/app/store/_components/otp-verify-modal";
import { templateAuthApi } from "@/lib/api/template-auth";
import type { CustomerRegisterPayload } from "@/types/template/auth";

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

const pharmacySlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=85",
    title: "Healthcare essentials you can trust",
    description:
      "Create an account to order medicines, wellness products and everyday healthcare essentials with ease.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=85",
    title: "Find the medicines you need",
    description:
      "Browse trusted healthcare products, save your essentials and return whenever you need to reorder.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85",
    title: "Care delivered to your doorstep",
    description:
      "Track orders, manage your profile and enjoy a simple, secure pharmacy shopping experience.",
  },
];

export default function PharmacyRegisterPage() {
  const router = useRouter();
  const message = useMessage();

  const [activeSlide, setActiveSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide(
        (current) => (current + 1) % pharmacySlides.length,
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const onSubmit = async (
    data: CustomerRegisterPayload,
  ) => {
    try {
      setServerError(null);

      const payload: CustomerRegisterPayload = {
        ...data,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || "",
      };

      const response =
        await templateAuthApi.register(payload);

      setOtpEmail(
        response?.customer?.email ?? payload.email,
      );

      setOpenOtpModal(true);

      message.success(
        "Account created. Please verify your email.",
      );
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

  const currentSlide = pharmacySlides[activeSlide];

  return (
    <main className="min-h-screen bg-[var(--store-bg-3)] text-[var(--store-text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left pharmacy slider */}
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          {pharmacySlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                activeSlide === index
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-105 opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="55vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/90" />

          <div className="absolute left-10 top-10 z-10">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 border border-white/25 bg-black/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-gray-950"
            >
              <ArrowLeft className="size-4" />
              Back to store
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-10 text-white xl:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-950">
                <Pill className="size-4" />
                Trusted pharmacy
              </div>

              <div
                key={currentSlide.id}
                className="animate-in fade-in slide-in-from-bottom-3 duration-700"
              >
                <h1 className="mt-5 text-4xl font-bold leading-[1.15] xl:text-5xl">
                  {currentSlide.title}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
                  {currentSlide.description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2">
                {pharmacySlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show slide ${index + 1}`}
                    className={`h-2 transition-all duration-300 ${
                      activeSlide === index
                        ? "w-9 bg-[var(--store-primary)]"
                        : "w-2 bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <PackageCheck className="size-5" />

                  <p className="mt-3 text-sm font-semibold">
                    Medicine delivery
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Track every purchase
                  </p>
                </div>

                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <ShieldCheck className="size-5" />

                  <p className="mt-3 text-sm font-semibold">
                    Secure account
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Protected shopping
                  </p>
                </div>

                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <HeartPulse className="size-5" />

                  <p className="mt-3 text-sm font-semibold">
                    Healthcare essentials
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Shop with confidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right registration area */}
        <section className="relative flex min-h-screen flex-col">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-[var(--store-border)] px-5 py-4 lg:hidden">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>

            <div className="flex items-center gap-2 font-semibold">
              <Pill className="size-5 text-[var(--store-primary)]" />
              Pharmacy
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
            <div className="w-full max-w-[500px]">
              {/* Mobile heading */}
              <div className="mb-8 lg:hidden">
                <div className="mb-4 flex size-12 items-center justify-center bg-[var(--store-primary)] text-white">
                  <User className="size-6" />
                </div>

                <h1 className="text-3xl font-bold">
                  Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--store-text-secondary)]">
                  Register to save medicines, manage orders and
                  enjoy a convenient pharmacy shopping experience.
                </p>
              </div>

              <div className="border border-[var(--store-border)] bg-[var(--store-bg-1)] p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="mb-8 hidden lg:block">
                  <div className="mb-5 flex size-12 items-center justify-center bg-[var(--store-primary)] text-white">
                    <User className="size-6" />
                  </div>

                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--store-primary)]">
                    Customer registration
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Create your account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--store-text-secondary)]">
                    Enter your information to start shopping for healthcare essentials.
                  </p>
                </div>

                {serverError && (
                  <div
                    role="alert"
                    className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                  >
                    {serverError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-text-secondary)]" />

                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        {...register("name")}
                        className={`h-12 w-full border bg-[var(--store-bg-1)] pl-12 pr-4 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-gray-400 focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/10 ${
                          errors.name
                            ? "border-red-400"
                            : "border-[var(--store-border)]"
                        }`}
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
                      className="mb-2 block text-sm font-semibold"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-text-secondary)]" />

                      <input
                        id="email"
                        type="email"
                        placeholder="customer@example.com"
                        autoComplete="email"
                        {...register("email")}
                        className={`h-12 w-full border bg-[var(--store-bg-1)] pl-12 pr-4 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-gray-400 focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/10 ${
                          errors.email
                            ? "border-red-400"
                            : "border-[var(--store-border)]"
                        }`}
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
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold"
                      >
                        Phone number
                      </label>

                      <span className="text-xs text-[var(--store-text-secondary)]">
                        Optional
                      </span>
                    </div>

                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-text-secondary)]" />

                      <input
                        id="phone"
                        type="tel"
                        placeholder="01712345678"
                        autoComplete="tel"
                        {...register("phone")}
                        className={`h-12 w-full border bg-[var(--store-bg-1)] pl-12 pr-4 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-gray-400 focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/10 ${
                          errors.phone
                            ? "border-red-400"
                            : "border-[var(--store-border)]"
                        }`}
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
                      className="mb-2 block text-sm font-semibold"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-text-secondary)]" />

                      <input
                        id="password"
                        type={
                          showPassword ? "text" : "password"
                        }
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        {...register("password")}
                        className={`h-12 w-full border bg-[var(--store-bg-1)] pl-12 pr-12 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-gray-400 focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/10 ${
                          errors.password
                            ? "border-red-400"
                            : "border-[var(--store-border)]"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setShowPassword(
                            (previous) => !previous,
                          );
                        }}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--store-text-secondary)] transition hover:text-[var(--store-primary)]"
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

                    {!errors.password && (
                      <p className="mt-2 text-xs leading-5 text-[var(--store-text-secondary)]">
                        Use at least 8 characters with uppercase,
                        lowercase, a number and a special
                        character.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center bg-[var(--store-accent)] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Creating account..."
                      : "Create account"}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[var(--store-border)]" />

                  <span className="text-xs uppercase tracking-wider text-[var(--store-text-secondary)]">
                    Already registered
                  </span>

                  <div className="h-px flex-1 bg-[var(--store-border)]" />
                </div>

                <Link
                  href="/store/login"
                  className="flex h-12 w-full items-center justify-center border border-[var(--store-border)] px-5 text-sm font-semibold transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
                >
                  Login to your account
                </Link>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-[var(--store-text-secondary)]">
                By creating an account, you agree to our terms
                of service and privacy policy.
              </p>
            </div>
          </div>
        </section>
      </div>

      <OtpVerifyModal
        open={openOtpModal}
        email={otpEmail}
        onClose={() => setOpenOtpModal(false)}
        onVerified={() => {
          setOpenOtpModal(false);
          router.push("/store/login");
        }}
      />
    </main>
  );
}