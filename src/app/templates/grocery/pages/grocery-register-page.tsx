"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
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

const electronicSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=85",
    title: "Create your electronics account",
    description:
      "Register to explore smartphones, laptops, accessories, and smart devices from trusted brands.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1600&q=85",
    title: "Save your favorite technology",
    description:
      "Build your wishlist, compare products, and keep your favorite electronic devices in one place.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=85",
    title: "Enjoy a smarter shopping experience",
    description:
      "Track orders, manage your profile, and receive a personalized electronic shopping experience.",
  },
];

export default function GroceryRegisterPage() {
  const router = useRouter();
  const message = useMessage();

  const [activeSlide, setActiveSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] =
    useState<string | null>(null);

  // OTP verification
  const [openOtpModal, setOpenOtpModal] =
    useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");

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
        (current) => (current + 1) % electronicSlides.length,
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

      setOtpEmail(response?.customer?.email ?? payload.email);
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

  const currentSlide = electronicSlides[activeSlide];

  return (
    <main className="min-h-screen bg-[var(--store-bg-3)] text-[var(--store-text)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left electronic image slider */}
        <div className="relative hidden overflow-hidden lg:block">
          {electronicSlides.map((slide, index) => (
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
                sizes="50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />

          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white xl:p-14">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
                Electronic Store
              </span>

              <div
                key={currentSlide.id}
                className="animate-in fade-in slide-in-from-bottom-3 duration-700"
              >
                <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
                  {currentSlide.title}
                </h1>

                <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
                  {currentSlide.description}
                </p>
              </div>

              {/* Slider navigation dots */}
              <div className="mt-8 flex items-center gap-2">
                {electronicSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Show slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? "w-9 bg-[var(--store-primary)]"
                        : "w-2.5 bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right registration form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)] p-6 shadow-sm sm:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
                <User className="size-6" />
              </div>

              <h2 className="text-3xl font-bold">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-[var(--store-muted)]">
                Enter your information to create a new account
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Full name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted)]" />

                  <input
                    type="text"
                    placeholder="MD Khairul Islam"
                    autoComplete="name"
                    {...register("name")}
                    className="w-full rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] py-3 pl-12 pr-4 text-sm text-[var(--store-text)] outline-none transition placeholder:text-[var(--store-muted)] focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20"
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-sm text-[var(--store-danger)]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted)]" />

                  <input
                    type="email"
                    placeholder="customer@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className="w-full rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] py-3 pl-12 pr-4 text-sm text-[var(--store-text)] outline-none transition placeholder:text-[var(--store-muted)] focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-sm text-[var(--store-danger)]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number{" "}
                  <span className="font-normal text-[var(--store-muted)]">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted)]" />

                  <input
                    type="tel"
                    placeholder="01712345678"
                    autoComplete="tel"
                    {...register("phone")}
                    className="w-full rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] py-3 pl-12 pr-4 text-sm text-[var(--store-text)] outline-none transition placeholder:text-[var(--store-muted)] focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1.5 text-sm text-[var(--store-danger)]">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted)]" />

                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    placeholder="StrongPass123!"
                    autoComplete="new-password"
                    {...register("password")}
                    className="w-full rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] py-3 pl-12 pr-12 text-sm text-[var(--store-text)] outline-none transition placeholder:text-[var(--store-muted)] focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--store-muted)] transition hover:text-[var(--store-text)]"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-sm text-[var(--store-danger)]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <p className="text-xs leading-5 text-[var(--store-muted)]">
                Password must contain at least 8 characters,
                including uppercase, lowercase, number, and
                special character.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[var(--store-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--store-muted)]">
              Already have an account?{" "}
              <Link
                href="/store/login"
                className="font-semibold text-[var(--store-primary)] hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
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