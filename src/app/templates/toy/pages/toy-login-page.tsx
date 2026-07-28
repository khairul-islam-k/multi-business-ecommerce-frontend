"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Blocks,
  CheckCircle2,
  Eye,
  EyeOff,
  Gift,
  Lock,
  Mail,
  Puzzle,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
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

export default function ToyLoginPage() {
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
    "h-12 w-full rounded-2xl border bg-white py-3 pl-12 pr-4 text-sm text-[#241f3a] outline-none transition placeholder:text-[#aaa4bb] hover:border-[#c9bee5] focus:border-[#6c4ce5] focus:ring-4 focus:ring-[#6c4ce5]/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/35 dark:hover:border-white/20 dark:focus:border-[#9b86ff] dark:focus:ring-[#9b86ff]/10";

  return (
    <main className="min-h-screen bg-[#fffaf0] dark:bg-[#121022]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.96fr_1.04fr]">
        {/* Login form section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          {/* Playful background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-[#ffd84d]/35 blur-3xl dark:bg-[#ffd84d]/10" />

            <div className="absolute -bottom-24 right-0 size-80 rounded-full bg-[#ff83b5]/25 blur-3xl dark:bg-[#ff83b5]/10" />

            <div className="absolute left-[42%] top-[12%] size-52 rounded-full bg-[#69d6ff]/20 blur-3xl dark:bg-[#69d6ff]/10" />

            <Star className="absolute left-[8%] top-[18%] size-7 rotate-12 fill-[#ffd84d]/30 text-[#e9bb00]/40 dark:text-[#ffd84d]/20" />

            <Puzzle className="absolute bottom-[16%] left-[8%] size-8 -rotate-12 text-[#ff83b5]/30" />

            <Blocks className="absolute right-[9%] top-[22%] size-8 rotate-12 text-[#6c4ce5]/20" />

            <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.06]">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,#6c4ce5_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[560px]">
            <Link
              href="/store"
              className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#756d87] transition hover:text-[#6c4ce5] dark:text-white/55 dark:hover:text-[#b4a7ff]"
            >
              <ArrowLeft className="size-4" />
              Back to toy store
            </Link>

            <div className="overflow-hidden rounded-[32px] border border-white bg-white/95 shadow-[0_30px_90px_-40px_rgba(74,50,136,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_30px_90px_-40px_rgba(0,0,0,0.85)]">
              {/* Color ribbon */}
              <div className="grid h-2 grid-cols-4">
                <span className="bg-[#ffd84d]" />
                <span className="bg-[#ff83b5]" />
                <span className="bg-[#69d6ff]" />
                <span className="bg-[#6c4ce5]" />
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Heading */}
                <div className="mb-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eee8ff] bg-[#f8f5ff] px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#6c4ce5] dark:border-white/10 dark:bg-white/5 dark:text-[#b4a7ff]">
                    <Sparkles className="size-4" />
                    Welcome back
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#ffd84d] text-[#241f3a] shadow-[0_12px_28px_-14px_rgba(255,216,77,0.9)]">
                      <User className="size-7" />
                    </span>

                    <div>
                      <h1 className="text-3xl font-black tracking-[-0.03em] text-[#241f3a] sm:text-[40px] dark:text-white">
                        Continue your
                        <span className="block text-[#6c4ce5] dark:text-[#a996ff]">
                          playtime journey
                        </span>
                      </h1>

                      <p className="mt-3 max-w-md text-sm leading-6 text-[#7d768c] dark:text-white/50">
                        Sign in to revisit favourite toys,
                        manage your orders and discover more
                        joyful picks.
                      </p>
                    </div>
                  </div>
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
                      className="mb-2 block text-sm font-bold text-[#3c3651] dark:text-white/80"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9d91bb] dark:text-white/35" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="customer@example.com"
                        {...register("email")}
                        className={`${inputBaseClass} ${
                          errors.email
                            ? "border-red-400 dark:border-red-400"
                            : "border-[#e8e3f4] dark:border-white/10"
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
                        className="block text-sm font-bold text-[#3c3651] dark:text-white/80"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={handleForget}
                        className="text-sm font-bold text-[#6c4ce5] transition hover:text-[#4f31bc] hover:underline dark:text-[#b4a7ff] dark:hover:text-white"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9d91bb] dark:text-white/35" />

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
                            ? "border-red-400 dark:border-red-400"
                            : "border-[#e8e3f4] dark:border-white/10"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9d91bb] transition hover:text-[#6c4ce5] dark:text-white/35 dark:hover:text-white"
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
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-[#7d768c] dark:text-white/50">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer rounded border-[#c9bee5] accent-[#6c4ce5] dark:border-white/20 dark:bg-white/5"
                    />

                    <span>Remember me</span>
                  </label>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#6c4ce5] px-5 text-sm font-extrabold text-white shadow-[0_18px_35px_-16px_rgba(108,76,229,0.75)] transition hover:-translate-y-0.5 hover:bg-[#5c3dd4] hover:shadow-[0_22px_42px_-16px_rgba(108,76,229,0.9)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isSubmitting
                      ? "Logging in..."
                      : "Enter the Toy Store"}

                    {!isSubmitting && (
                      <Rocket className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>

                {/* Register divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#ece7f5] dark:bg-white/10" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#aaa4bb] dark:text-white/35">
                    New playmate?
                  </span>

                  <div className="h-px flex-1 bg-[#ece7f5] dark:bg-white/10" />
                </div>

                <Link
                  href="/store/register"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ddd4f5] bg-[#faf8ff] px-5 text-sm font-bold text-[#6c4ce5] transition hover:border-[#6c4ce5] hover:bg-[#f2edff] dark:border-white/10 dark:bg-white/5 dark:text-[#b4a7ff] dark:hover:border-[#9b86ff]/50 dark:hover:bg-white/[0.08]"
                >
                  <Gift className="size-4" />
                  Create a Toy Store Account
                </Link>

                {/* Verify email */}
                <p className="mt-6 text-center text-sm text-[#7d768c] dark:text-white/55">
                  Haven&apos;t verified your
                  email?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      setOtpOpen(true)
                    }
                    className="font-bold text-[#6c4ce5] transition hover:text-[#4f31bc] hover:underline dark:text-[#b4a7ff] dark:hover:text-white"
                  >
                    Verify email
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#aaa4bb] dark:text-white/30">
              By signing in, you agree to our terms of
              service and privacy policy.
            </p>
          </div>
        </section>

        {/* Toy image section */}
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=88"
            alt="Colorful toys and building blocks"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 52vw, 0vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#241f3a]/10 via-[#241f3a]/15 to-[#17132e]/90" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#291f55]/25 via-transparent to-transparent" />

          {/* Decorative shapes */}
          <div className="absolute left-12 top-28 size-28 rotate-12 rounded-[30px] border border-white/20 bg-white/5 backdrop-blur-sm" />

          <div className="absolute right-14 top-40 size-16 -rotate-12 rounded-full border border-white/25 bg-[#ffd84d]/15 backdrop-blur-sm" />

          <Star className="absolute right-20 top-24 size-8 fill-[#ffd84d]/30 text-[#ffd84d]/70" />

          {/* Top brand */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-10 xl:p-14">
            <Link
              href="/store"
              className="inline-flex items-center gap-3 text-xl font-black tracking-wide text-white"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffd84d] text-[#241f3a] shadow-lg">
                <ShoppingBag className="size-5" />
              </span>

              Toy Store
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <ShieldCheck className="size-4 text-[#ffd84d]" />
              Secure login
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
            <div className="max-w-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#ffd84d]" />

                <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/75">
                  More fun is waiting
                </span>
              </div>

              <h2 className="max-w-lg text-5xl font-black leading-[1.02] tracking-[-0.04em] xl:text-6xl">
                Return to your
                <span className="block text-[#ffd84d]">
                  happy place.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/72">
                Sign in to continue exploring exciting
                toys, saved favourites and every order
                made for joyful playtime.
              </p>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[
                  {
                    label: "Safe toys",
                    icon: ShieldCheck,
                    iconClass:
                      "text-[#ffd84d]",
                  },
                  {
                    label: "Saved favourites",
                    icon: Gift,
                    iconClass:
                      "text-[#ff9bc2]",
                  },
                  {
                    label: "Order updates",
                    icon: CheckCircle2,
                    iconClass:
                      "text-[#7bddff]",
                  },
                ].map(
                  ({
                    label,
                    icon: Icon,
                    iconClass,
                  }) => (
                    <div
                      key={label}
                      className="flex min-h-24 flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-xs font-bold backdrop-blur-md"
                    >
                      <Icon
                        className={`size-5 ${iconClass}`}
                      />

                      <span>{label}</span>
                    </div>
                  ),
                )}
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