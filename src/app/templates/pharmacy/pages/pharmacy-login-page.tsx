"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Pill,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation";

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

export default function PharmacyLoginPage() {
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

  return (
    <main className="min-h-screen bg-[var(--store-bg-3)] text-[var(--store-text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        {/* Image section */}
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=85"
            alt="Modern pharmacy with medicine shelves"
            fill
            priority
            unoptimized
            sizes="55vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/85" />

          <div className="absolute left-10 top-10 z-10">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 border border-white/25 bg-black/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-gray-950"
            >
              <ArrowLeft className="size-4" />
              Back to store
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-950">
                <Pill className="size-4" />
                Trusted pharmacy
              </div>

              <h1 className="text-4xl font-bold leading-[1.15] text-white xl:text-5xl">
                Your health and wellness come first.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
                Sign in to order medicines, manage prescriptions, track deliveries
                and enjoy a safe pharmacy shopping experience.
              </p>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <Truck className="size-5 text-white" />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Fast delivery
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Track your orders
                  </p>
                </div>

                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <ShieldCheck className="size-5 text-white" />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Secure account
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Protected information
                  </p>
                </div>

                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <ShoppingBag className="size-5 text-white" />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Quality products
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Trusted medicines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login section */}
        <section className="relative flex min-h-screen flex-col">
          {/* Mobile top navigation */}
          <div className="flex items-center justify-between border-b border-[var(--store-border)] px-5 py-4 lg:hidden">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--store-text-primary)]"
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
            <div className="w-full max-w-[470px]">
              {/* Mobile heading */}
              <div className="mb-8 lg:hidden">
                <div className="mb-4 flex size-12 items-center justify-center bg-[var(--store-primary)] text-white">
                  <Pill className="size-6" />
                </div>

                <h1 className="text-3xl font-bold">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--store-text-secondary)]">
                  Sign in to continue shopping and manage your account.
                </p>
              </div>

              <div className="border border-[var(--store-border)] bg-[var(--store-bg-1)] p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="mb-8 hidden lg:block">
                  <div className="mb-5 flex size-12 items-center justify-center bg-[var(--store-primary)] text-white">
                    <Pill className="size-6" />
                  </div>

                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--store-primary)]">
                    Customer account
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--store-text-secondary)]">
                    Enter your email and password to access your account.
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
                  {/* Email field */}
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
                        autoComplete="email"
                        placeholder="customer@example.com"
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

                  {/* Password field */}
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
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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
                          setShowPassword((previous) => !previous);
                        }}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
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
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--store-text-secondary)]">
                      <input
                        type="checkbox"
                        className="size-4 cursor-pointer border-[var(--store-border)] accent-[var(--store-primary)]"
                      />

                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleForget}
                      className="text-sm font-semibold text-[var(--store-primary)] transition hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center bg-[var(--store-accent)] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Logging in..." : "Login to account"}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[var(--store-border)]" />

                  <span className="text-xs uppercase tracking-wider text-[var(--store-text-secondary)]">
                    New customer
                  </span>

                  <div className="h-px flex-1 bg-[var(--store-border)]" />
                </div>

                <Link
                  href="/store/register"
                  className="flex h-12 w-full items-center justify-center border border-[var(--store-border)] px-5 text-sm font-semibold text-[var(--store-text-primary)] transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
                >
                  Create a new account
                </Link>

                <p className="mt-6 text-center text-sm text-[var(--store-text-secondary)]">
                  Haven&apos;t verified your email?{" "}
                  <button
                    type="button"
                    onClick={() => setOtpOpen(true)}
                    className="font-semibold text-[var(--store-primary)] hover:underline"
                  >
                    Verify email
                  </button>
                </p>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-[var(--store-text-secondary)]">
                By signing in, you agree to our terms of service and privacy
                policy.
              </p>
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