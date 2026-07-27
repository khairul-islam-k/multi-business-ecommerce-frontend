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

export default function CosmeticsLoginPage() {
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
    "w-full rounded-2xl border bg-[var(--store-bg-1)] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#a9969e] hover:border-[#d9bcc7] focus:border-[#bd6f8c] focus:ring-4 focus:ring-[#bd6f8c]/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:hover:border-white/20 dark:focus:border-[#e6a7bd] dark:focus:bg-white/[0.07]";

  return (
    <main className="min-h-screen bg-[var(--store-bg-2)] dark:bg-[#160f13]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.02fr_0.98fr]">
        {/* Left Login Form */}
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
                {/* Heading */}
                <div className="mb-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ecd6de] bg-[var(--store-bg-1)] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a4f6b] dark:border-white/10 dark:bg-white/5 dark:text-[#efb5ca]">
                    <Sparkles className="size-4" />
                    Welcome to your beauty space
                  </div>

                  <h1 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-[44px] dark:text-white">
                    Welcome back,
                    <span className="block italic text-[#a94f70] dark:text-[#efb5ca]">
                      beautiful
                    </span>
                  </h1>

                  <p className="mt-4 max-w-md text-sm leading-6 dark:text-white/55">
                    Sign in to revisit your favourites, track your beauty orders
                    and continue discovering products made for you.
                  </p>
                </div>

                {/* Server error */}
                {serverError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                  >
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold dark:text-white/80"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b18c9a] dark:text-white/35" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="customer@example.com"
                        {...register("email")}
                        className={`${inputBaseClass} ${
                          errors.email
                            ? "border-red-400 dark:border-red-400"
                            : "border-[#eadde2] dark:border-white/10"
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
                        className="block text-sm font-semibold dark:text-white/80"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={handleForget}
                        className="text-sm font-semibold transition hover:text-[#7d344f] hover:underline dark:text-[#efb5ca] dark:hover:text-[#ffd4e2]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b18c9a] dark:text-white/35" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...register("password")}
                        className={`${inputBaseClass} pr-12 ${
                          errors.password
                            ? "border-red-400 dark:border-red-400"
                            : "border-[#eadde2] dark:border-white/10"
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

                  {/* Remember me */}
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-[#78656d] dark:text-white/55">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer rounded border-[#d9bcc7] accent-[#8f3f5d] dark:border-white/20 dark:bg-white/5 dark:accent-[#d68da7]"
                    />

                    <span>Remember me</span>
                  </label>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8f3f5d] px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_-15px_rgba(143,63,93,0.75)] transition hover:-translate-y-0.5 hover:bg-[#7d344f] hover:shadow-[0_20px_40px_-16px_rgba(143,63,93,0.9)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-[#c57794] dark:text-[#1c1015] dark:hover:bg-[#d58da8]"
                  >
                    {isSubmitting ? "Logging in..." : "Enter Beauty Store"}
                    {!isSubmitting && (
                      <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
                    )}
                  </button>
                </form>

                {/* Register divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#eadde2] dark:bg-white/10" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a08b93] dark:text-white/35">
                    New to our beauty community?
                  </span>

                  <div className="h-px flex-1 bg-[#eadde2] dark:bg-white/10" />
                </div>

                <Link
                  href="/store/register"
                  className="flex w-full items-center justify-center rounded-2xl border border-[#d9bcc7] bg-[var(--store-bg-1)] px-5 py-3.5 text-sm font-semibold transition hover:border-[#b66582] hover:bg-[#fff3f7] hover:text-[#74334b] dark:border-white/15 dark:bg-white/5 dark:text-[#efb5ca] dark:hover:border-[#e6a7bd]/50 dark:hover:bg-white/[0.08]"
                >
                  Create a Beauty Account
                </Link>

                {/* Verify email */}
                <p className="mt-6 text-center text-sm text-[#78656d] dark:text-white/55">
                  Haven&apos;t verified your email?{" "}
                  <button
                    type="button"
                    onClick={() => setOtpOpen(true)}
                    className="font-semibold text-[#9f4b69] transition hover:text-[#7d344f] hover:underline dark:text-[#efb5ca] dark:hover:text-[#ffd4e2]"
                  >
                    Verify email
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#9b878f] dark:text-white/35">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </section>

        {/* Right Cosmetics Image */}
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

          {/* Top area */}
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
              Secure login
            </div>
          </div>

          {/* Bottom information */}
          <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
            <div className="max-w-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-white/65" />
                <span className="text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
                  Your personal beauty edit
                </span>
              </div>

              <h2 className="max-w-lg font-serif text-5xl font-medium leading-[1.02] tracking-[-0.03em] xl:text-6xl">
                Return to the ritual
                <span className="block italic text-[#f4c8d7]">
                  you love.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                Sign in to continue exploring skincare, makeup and beauty
                essentials selected to make every day feel extraordinary.
              </p>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[
                  {
                    label: "Beauty picks",
                    icon: Sparkles,
                  },
                  {
                    label: "Saved favourites",
                    icon: Heart,
                  },
                  {
                    label: "Order updates",
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