"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { templateAuthApi } from "@/lib/api/template-auth";
import { useMessage } from "@/app/store/_components/message/message-hook";
import OtpVerifyModal from "@/app/store/_components/otp-verify-modal";
import ForgotOtpVerifyModal from "@/app/store/_components/forgot-otp-verify-modal";
import { useCart } from "@/app/store/_components/contex/CartContex";

export type CustomerLoginPayload = {
  email: string;
  password: string;
};

export const customerLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export default function VehicleLoginPage() {
  const router = useRouter();
  const message = useMessage();

  const { LOginUser } = useCart();

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [forgetOpen, setForgetOpen] =
    useState(false);

  const [verifyEmail, setVerifyEmail] =
    useState("");

  const [otpOpen, setOtpOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CustomerLoginPayload>({
    resolver: zodResolver(
      customerLoginSchema,
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = useWatch({
    control,
    name: "email",
  });

  const onSubmit = async (
    data: CustomerLoginPayload,
  ) => {
    try {
      setServerError(null);

      const res =
        await templateAuthApi.login(data);

      const loginPayload = {
        id: res.customer.id,
        name: res.customer.name,
        email: res.customer.email,
        phone: res.customer.email,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      };

      LOginUser(loginPayload);

      message.success(
        "Logged in successfully",
      );

      router.push("/store");
    } catch {
      setServerError(
        "The email or password you entered is incorrect. Please try again.",
      );
    }
  };

  const handleForget = async () => {
    const email = emailValue
      ?.trim()
      .toLowerCase();

    if (!email) {
      message.error(
        "Please enter your email address first",
      );
      return;
    }

    const isValidEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      );

    if (!isValidEmail) {
      message.error(
        "Please enter a valid email address",
      );
      return;
    }

    try {
      await templateAuthApi.forgetOtpSend(
        email,
      );

      setVerifyEmail(email);
      setForgetOpen(true);
    } catch {
      message.error(
        "Something went wrong. Please try again.",
      );
    }
  };

  const inputBaseClass =
    "w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#f16d59] focus:ring-4 focus:ring-[#f16d59]/10";

  return (
    <main className="min-h-screen bg-[var(--store-bg-3)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left Login Form */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          {/* Background decorations */}
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
              {/* Heading */}
              <div className="mb-8">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#f16d59]/10 text-[#f16d59]">
                  <User className="size-6" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f16d59]">
                  Customer account
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Enter your email and password
                  to access your account.
                </p>
              </div>

              {/* Server error */}
              {serverError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                >
                  {serverError}
                </div>
              )}

              <form
                onSubmit={handleSubmit(
                  onSubmit,
                )}
                className="space-y-5"
              >
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
                      placeholder="customer@example.com"
                      {...register("email")}
                      className={`${inputBaseClass} ${
                        errors.email
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handleForget}
                      className="text-sm font-semibold text-[#f16d59] transition hover:text-[#df5e4b] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register("password")}
                      className={`${inputBaseClass} pr-12 ${
                        errors.password
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous,
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
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
                      {
                        errors.password
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    className="size-4 cursor-pointer rounded border-gray-300 accent-[#f16d59]"
                  />

                  <span>Remember me</span>
                </label>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-xl bg-[#f16d59] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#f16d59]/20 transition hover:-translate-y-0.5 hover:bg-[#df5e4b] hover:shadow-xl hover:shadow-[#f16d59]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSubmitting
                    ? "Logging in..."
                    : "Login to Account"}
                </button>
              </form>

              {/* Register divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  New customer?
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <Link
                href="/store/register"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#f16d59] hover:bg-[#f16d59]/5 hover:text-[#f16d59]"
              >
                Create a New Account
              </Link>

              {/* Verify email */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Haven&apos;t verified your
                email?{" "}
                <button
                  type="button"
                  onClick={() =>
                    setOtpOpen(true)
                  }
                  className="font-semibold text-[#f16d59] transition hover:text-[#df5e4b] hover:underline"
                >
                  Verify email
                </button>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-gray-400">
              By signing in, you agree to
              our terms of service and
              privacy policy.
            </p>
          </div>
        </section>

        {/* Right Vehicle Image */}
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
            alt="Modern sports vehicle"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 52vw, 0vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/80" />

          {/* Top area */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-10 xl:p-14">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-xl font-bold text-white"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <Car className="size-5" />
              </span>

              Vehicle Store
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
              <ShieldCheck className="size-4" />
              Secure login
            </div>
          </div>

          {/* Bottom information */}
          <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                Drive your dream
              </span>

              <h2 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
                Find the perfect vehicle
                <br />
                for every journey.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                Sign in to explore vehicles,
                save your favourites, manage
                orders and enjoy a faster
                shopping experience.
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur-md">
                  <Truck className="size-5" />

                  <p className="mt-3 text-xs font-semibold">
                    Fast delivery
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur-md">
                  <CheckCircle2 className="size-5" />

                  <p className="mt-3 text-xs font-semibold">
                    Verified vehicles
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur-md">
                  <ShoppingBag className="size-5" />

                  <p className="mt-3 text-xs font-semibold">
                    Easy shopping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ForgotOtpVerifyModal
        open={forgetOpen}
        email={verifyEmail}
        onClose={() =>
          setForgetOpen(false)
        }
        onVerified={() => {
          setForgetOpen(false);
        }}
      />

      <OtpVerifyModal
        open={otpOpen}
        email={
          emailValue?.trim() ?? ""
        }
        onClose={() =>
          setOtpOpen(false)
        }
        onVerified={() => {
          setOtpOpen(false);
          router.push("/store/login");
        }}
      />
    </main>
  );
}