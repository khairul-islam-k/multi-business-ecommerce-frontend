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
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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

  password: z.string().min(1, "Password is required"),
});

export default function ShoesLoginPage() {
  const router = useRouter();
  const message = useMessage();

  const { LOginUser } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [forgetOpen, setForgetOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CustomerLoginPayload>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = useWatch({
    control,
    name: "email",
  });

  const onSubmit = async (data: CustomerLoginPayload) => {
    try {
      setServerError(null);

      const res = await templateAuthApi.login(data);

      const loginPayload = {
        id: res.customer.id,
        name: res.customer.name,
        email: res.customer.email,
        phone: res.customer.email,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      };

      LOginUser(loginPayload);

      message.success("Logged in successfully");

      router.push("/store");
    } catch {
      setServerError(
        "The email or password you entered is incorrect. Please try again.",
      );
    }
  };

  const handleForget = async () => {
    const email = emailValue?.trim().toLowerCase();

    if (!email) {
      message.error("Please enter your email address first");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      message.error("Please enter a valid email address");
      return;
    }

    try {
      await templateAuthApi.forgetOtpSend(email);

      setVerifyEmail(email);
      setForgetOpen(true);
    } catch {
      message.error("Something went wrong. Please try again.");
    }
  };

  const inputBaseClass =
    "w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-[#151515] outline-none transition placeholder:text-[#9b9b92] hover:border-[#a6a69d] focus:border-[#171717] focus:ring-4 focus:ring-[#b8ff35]/35 dark:bg-white/[0.055] dark:text-white dark:placeholder:text-white/35 dark:hover:border-white/25 dark:focus:border-[#b8ff35] dark:focus:ring-[#b8ff35]/15";

  return (
    <main className="min-h-screen bg-[#f1f1ec] dark:bg-[#080808]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.96fr_1.04fr]">
        {/* Left Login Form */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
          {/* Decorative sneaker background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 -top-24 size-80 rounded-full border-[42px] border-[#b8ff35]/35 dark:border-[#b8ff35]/10" />
            <div className="absolute -bottom-36 -right-24 size-[430px] rounded-full border-[70px] border-black/[0.035] dark:border-white/[0.025]" />
            <div className="absolute left-0 top-[22%] h-px w-32 bg-black/10 dark:bg-white/10" />
            <div className="absolute right-8 top-12 text-[150px] font-black leading-none text-black/[0.025] dark:text-white/[0.018] sm:text-[210px]">
              02
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
                Secure login
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-black/[0.08] bg-[#fafaf7] shadow-[0_35px_90px_-45px_rgba(0,0,0,0.42)] dark:border-white/10 dark:bg-[#111111] dark:shadow-[0_35px_90px_-45px_rgba(0,0,0,0.95)]">
              <div className="grid grid-cols-[1fr_auto] border-b border-black/[0.08] dark:border-white/10">
                <div className="flex items-center gap-2 px-6 py-4 sm:px-8">
                  <span className="size-2 rounded-full bg-[#b8ff35] shadow-[0_0_0_5px_rgba(184,255,53,0.18)]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#55554e] dark:text-white/50">
                    Member access
                  </span>
                </div>

                <div className="border-l border-black/[0.08] bg-[#b8ff35] px-5 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-black dark:border-black/10">
                  Step 02
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Heading */}
                <div className="mb-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#383832] dark:border-white/10 dark:bg-white/5 dark:text-white/65">
                    <Sparkles className="size-3.5 text-[#76a800] dark:text-[#b8ff35]" />
                    Continue your rotation
                  </div>

                  <h1 className="max-w-lg text-4xl font-black uppercase leading-[0.98] tracking-[-0.055em] text-[#111111] sm:text-[48px] dark:text-white">
                    Welcome back to
                    <span className="block text-[#76a800] dark:text-[#b8ff35]">
                      your sneaker space
                    </span>
                  </h1>

                  <p className="mt-4 max-w-md text-sm leading-6 text-[#6d6d65] dark:text-white/50">
                    Sign in to view saved pairs, follow your orders and get back
                    to the latest footwear drops.
                  </p>
                </div>

                {/* Server error */}
                {serverError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                  >
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#383832] dark:text-white/75"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#84847c] dark:text-white/35" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="customer@example.com"
                        {...register("email")}
                        className={`${inputBaseClass} ${
                          errors.email
                            ? "border-red-400 dark:border-red-400"
                            : "border-[#d9d9d2] dark:border-white/10"
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
                        className="block text-xs font-bold uppercase tracking-[0.1em] text-[#383832] dark:text-white/75"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={handleForget}
                        className="text-xs font-bold uppercase tracking-[0.06em] text-[#5d8200] transition hover:text-black hover:underline dark:text-[#b8ff35] dark:hover:text-white"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#84847c] dark:text-white/35" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...register("password")}
                        className={`${inputBaseClass} pr-12 ${
                          errors.password
                            ? "border-red-400 dark:border-red-400"
                            : "border-[#d9d9d2] dark:border-white/10"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
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

                  {/* Remember me */}
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-[#66665f] dark:text-white/50">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer rounded border-[#bdbdb5] accent-[#161616] dark:border-white/20 dark:bg-white/5 dark:accent-[#b8ff35]"
                    />
                    <span>Remember me</span>
                  </label>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#161616] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_-18px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-[0_22px_42px_-18px_rgba(0,0,0,0.95)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-[#b8ff35] dark:text-black dark:hover:bg-[#c7ff62]"
                  >
                    {isSubmitting ? "Logging in..." : "Enter Shoe Store"}
                    {!isSubmitting && (
                      <ShoppingBag className="size-4 transition-transform group-hover:-rotate-6" />
                    )}
                  </button>
                </form>

                {/* Register divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#888880] dark:text-white/35">
                    New to the district?
                  </span>
                  <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>

                <Link
                  href="/store/register"
                  className="flex w-full items-center justify-center rounded-xl border border-black/15 bg-transparent px-5 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-[#171717] transition hover:border-[#171717] hover:bg-[#b8ff35] dark:border-white/15 dark:text-white dark:hover:border-[#b8ff35] dark:hover:bg-[#b8ff35] dark:hover:text-black"
                >
                  Create a Shoe Account
                </Link>

                {/* Verify email */}
                <p className="mt-6 text-center text-sm text-[#66665f] dark:text-white/50">
                  Haven&apos;t verified your email?{" "}
                  <button
                    type="button"
                    onClick={() => setOtpOpen(true)}
                    className="font-bold text-[#111111] underline decoration-[#b8ff35] decoration-2 underline-offset-4 transition hover:text-[#628d00] dark:text-[#b8ff35] dark:hover:text-white"
                  >
                    Verify email
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#85857d] dark:text-white/35">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </section>

        {/* Right Shoes Image */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#131313] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1800&q=90"
            alt="Premium casual sneakers"
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

          {/* Top area */}
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
              Secure login
            </div>
          </div>

          <div className="absolute left-9 top-1/2 -translate-y-1/2 xl:left-12">
            <div className="flex flex-col gap-2">
              {["01", "02", "03"].map((item, index) => (
                <span
                  key={item}
                  className={`h-1 rounded-full transition-all ${
                    index === 1 ? "w-10 bg-[#b8ff35]" : "w-5 bg-white/35"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom information */}
          <div className="absolute inset-x-0 bottom-0 p-9 text-white xl:p-12">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-full bg-[#b8ff35] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                  Member access
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                  Your collection / 2026
                </span>
              </div>

              <h2 className="max-w-xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] xl:text-7xl">
                Step back into
                <span className="block text-[#b8ff35]">your rotation.</span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
                Sign in for quicker checkout, saved favourites, order updates
                and first access to limited sneaker releases.
              </p>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                {[
                  {
                    label: "Latest drops",
                    icon: Sparkles,
                  },
                  {
                    label: "Saved pairs",
                    icon: Heart,
                  },
                  {
                    label: "Order updates",
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

      <ForgotOtpVerifyModal
        open={forgetOpen}
        email={verifyEmail}
        onClose={() => setForgetOpen(false)}
        onVerified={() => {
          setForgetOpen(false);
        }}
      />

      <OtpVerifyModal
        open={otpOpen}
        email={emailValue?.trim() ?? ""}
        onClose={() => setOtpOpen(false)}
        onVerified={() => {
          setOtpOpen(false);
          router.push("/store/login");
        }}
      />
    </main>
  );
}