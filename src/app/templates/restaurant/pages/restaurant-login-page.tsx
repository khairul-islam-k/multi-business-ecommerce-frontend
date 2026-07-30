"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Clock3,
  Eye,
  EyeOff,
  Heart,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  UtensilsCrossed,
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

export default function RestaurantLoginPage() {
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
    "h-12 w-full rounded-xl border bg-[var(--store-bg-1)] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a99b92] hover:border-[#d9c6b7] focus:border-[var(--store-primary)] focus:ring-4 focus:ring-[var(--store-primary)]/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-white/30 dark:hover:border-white/20 dark:focus:border-[var(--store-primary)]";

  return (
    <main className="min-h-screen dark:bg-[#15110f]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Restaurant image section */}
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=90"
            alt="Freshly prepared restaurant meal"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 52vw, 0vw"
            className="object-cover"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/90" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#2b1a12]/75 via-[#2b1a12]/20 to-transparent" />

          {/* Decorative elements */}
          <div className="absolute -left-28 top-1/3 size-80 rounded-full bg-[#f59e0b]/20 blur-3xl" />

          <div className="absolute right-8 top-20 size-64 rounded-full bg-[var(--store-primary)]/20 blur-3xl" />

          <Star className="absolute right-[13%] top-[17%] size-8 rotate-12 fill-[#fbbf24] text-[#fbbf24]" />

          <div className="absolute left-[11%] top-[28%] size-3 rounded-full bg-[#fbbf24]" />

          <div className="absolute right-[20%] top-[37%] size-3 rounded-full bg-[#fb7185]" />

          {/* Top brand */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-10 xl:p-14">
            <Link
              href="/store"
              className="inline-flex items-center gap-3 text-xl font-black tracking-tight text-white"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-[var(--store-primary)] text-white shadow-xl">
                <UtensilsCrossed className="size-5" />
              </span>

              Restaurant
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl">
              <ShieldCheck className="size-4 text-[#fbbf24]" />
              Secure login
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-10 text-white xl:p-14">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-xl">
                <Sparkles className="size-4 text-[#fbbf24]" />
                Welcome back
              </div>

              <h2 className="max-w-xl text-5xl font-black leading-[1.04] tracking-[-0.04em] xl:text-6xl">
                Your favourite meals
                <span className="block text-[#fbbf24]">
                  are waiting for you.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
                Sign in to explore our menu,
                reorder favourite dishes and track
                every restaurant order from one place.
              </p>

              <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
                {[
                  {
                    label: "Fresh dishes",
                    description:
                      "Prepared with care",
                    icon: ChefHat,
                    iconClass:
                      "text-[#fbbf24]",
                  },
                  {
                    label: "Saved favourites",
                    description:
                      "Order again quickly",
                    icon: Heart,
                    iconClass:
                      "text-[#fb7185]",
                  },
                  {
                    label: "Quick updates",
                    description:
                      "Track your orders",
                    icon: Clock3,
                    iconClass:
                      "text-[#7dd3fc]",
                  },
                ].map(
                  ({
                    label,
                    description,
                    icon: Icon,
                    iconClass,
                  }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
                    >
                      <Icon
                        className={`mb-5 size-5 ${iconClass}`}
                      />

                      <p className="text-sm font-bold">
                        {label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/50">
                        {description}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Login form section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-10 xl:px-16">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-28 -top-28 size-80 rounded-full bg-[var(--store-primary)]/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#f59e0b]/15 blur-3xl dark:bg-[#f59e0b]/5" />

            <div className="absolute left-[12%] top-[12%] size-3 rounded-full bg-[#fb7185]/50" />

            <div className="absolute bottom-[15%] right-[12%] size-4 rounded-full bg-[#fbbf24]/60" />

            <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.04]">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,#8b735f_1px,transparent_1px)] [background-size:26px_26px]" />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[600px]">
            {/* Mobile brand */}
            <Link
              href="/store"
              className="mb-6 inline-flex items-center gap-3 font-black text-[#30251f] dark:text-white lg:hidden"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--store-primary)] text-white">
                <UtensilsCrossed className="size-5" />
              </span>

              Restaurant
            </Link>

            {/* Back link */}
            <Link
              href="/store"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8b7b71] transition hover:text-[var(--store-primary)] dark:text-white/45 dark:hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to restaurant
            </Link>

            {/* Login card */}
            <div className="overflow-hidden rounded-[28px] border bg-[var(--store-card)] border-white shadow-[0_30px_80px_-35px_rgba(78,52,35,0.35)] dark:border-white/10 dark:bg-[#211a17] dark:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)]">
              {/* Accent line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[var(--store-primary)]" />

              <div className="p-6 sm:p-8 xl:p-10">
                {/* Heading */}
                <div className="mb-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--store-primary)]/10 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--store-primary)] dark:bg-white/5">
                    <ChefHat className="size-4" />
                    Customer login
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#fbbf24] text-[#30251f] shadow-[0_14px_30px_-15px_rgba(251,191,36,0.9)]">
                      <LogIn className="size-7" />
                    </span>

                    <div>
                      <h1 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl dark:text-white">
                        Welcome back
                      </h1>

                      <p className="mt-2 max-w-md text-sm leading-6 text-[#8b7b71] dark:text-white/45">
                        Sign in to order delicious food,
                        manage favourites and follow your
                        restaurant orders.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Server error */}
                {serverError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
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
                      className="mb-2 block text-sm font-bold dark:text-white/75"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a99b92] dark:text-white/30" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        className={`${inputBaseClass} ${
                          errors.email
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                            : "border-[#eadfd5] dark:border-white/10"
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
                        className="block text-sm font-bold dark:text-white/75"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={handleForget}
                        className="text-sm font-bold text-[var(--store-primary)] transition hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a99b92] dark:text-white/30" />

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
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                            : "border-[#eadfd5] dark:border-white/10"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a99b92] transition hover:text-[var(--store-primary)] dark:text-white/30 dark:hover:text-white"
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
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-[#6f6057] dark:text-white/55">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer rounded border-[#d9c6b7] accent-[var(--store-primary)] dark:border-white/20"
                    />

                    <span>Remember me</span>
                  </label>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--store-primary)] px-5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isSubmitting
                      ? "Logging in..."
                      : "Login to Restaurant"}

                    {!isSubmitting && (
                      <LogIn className="size-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>

                {/* Register divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#eadfd5] dark:bg-white/10" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a99b92] dark:text-white/30">
                    New customer?
                  </span>

                  <div className="h-px flex-1 bg-[#eadfd5] dark:bg-white/10" />
                </div>

                {/* Register link */}
                <Link
                  href="/store/register"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e0d1c4] bg-[#fffaf5] px-5 text-sm font-bold text-[var(--store-primary)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)]/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-[var(--store-primary)]"
                >
                  <UserPlus className="size-4" />
                  Create a Restaurant Account
                </Link>

                {/* Verify email */}
                <p className="mt-6 text-center text-sm text-[#8b7b71] dark:text-white/50">
                  Haven&apos;t verified your email?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      setOtpOpen(true)
                    }
                    className="font-bold text-[var(--store-primary)] transition hover:underline"
                  >
                    Verify email
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-[#a99b92] dark:text-white/25">
              <ShieldCheck className="size-4" />

              <span>
                Your account information is secure
                and protected.
              </span>
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