"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock3,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  UtensilsCrossed,
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
        message:
          "Please enter a valid Bangladeshi phone number",
      },
    ),
});

export default function RestaurantRegisterPage() {
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
    "h-12 w-full rounded-xl border border-[#eadfd5] bg-[var(--store-card)] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a99b92] hover:border-[#d9c6b7] focus:border-[var(--store-primary)] focus:ring-4 focus:ring-[var(--store-primary)]/10 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-white/30 dark:hover:border-white/20 dark:focus:border-[var(--store-primary)]";

  return (
    <main className="min-h-screen dark:bg-[#15110f]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Restaurant image section */}
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=90"
            alt="Beautiful restaurant dining table with delicious food"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 52vw, 0vw"
            className="object-cover"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/90" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#291b14]/70 via-[#291b14]/15 to-transparent" />

          {/* Decorative glow */}
          <div className="absolute -left-24 top-1/3 size-80 rounded-full bg-[#d97706]/20 blur-3xl" />

          <div className="absolute right-10 top-20 size-56 rounded-full bg-[#f59e0b]/15 blur-3xl" />

          <Star className="absolute right-[12%] top-[18%] size-8 rotate-12 fill-[#fbbf24] text-[#fbbf24]" />

          {/* Restaurant brand */}
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
              Secure registration
            </div>
          </div>

          {/* Bottom restaurant content */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-10 text-white xl:p-14">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-xl">
                <Sparkles className="size-4 text-[#fbbf24]" />
                Fresh flavours await
              </div>

              <h2 className="max-w-xl text-5xl font-black leading-[1.04] tracking-[-0.04em] xl:text-6xl">
                Delicious moments
                <span className="block text-[#fbbf24]">
                  begin at our table.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
                Create your account to explore our
                menu, save favourite dishes, place
                orders and enjoy a faster dining
                experience.
              </p>

              <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
                {[
                  {
                    label: "Fresh meals",
                    description: "Prepared with care",
                    icon: ChefHat,
                    iconClass: "text-[#fbbf24]",
                  },
                  {
                    label: "Save favourites",
                    description: "Order again easily",
                    icon: Heart,
                    iconClass: "text-[#fb7185]",
                  },
                  {
                    label: "Quick service",
                    description: "Fast order updates",
                    icon: Clock3,
                    iconClass: "text-[#7dd3fc]",
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

                      <p className="mt-1 text-xs text-white/50">
                        {description}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Registration form section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-10 xl:px-16">
          {/* Background decorations */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-28 -top-28 size-80 rounded-full bg-[var(--store-primary)]/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#f59e0b]/15 blur-3xl dark:bg-[#f59e0b]/5" />

            <div className="absolute left-[12%] top-[12%] size-3 rounded-full bg-[#fb7185]/60" />

            <div className="absolute bottom-[16%] right-[12%] size-4 rounded-full bg-[#fbbf24]/60" />

            <div className="absolute inset-0 opacity-[0.16] dark:opacity-[0.04]">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,#8b735f_1px,transparent_1px)] [background-size:26px_26px]" />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[620px]">
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

            {/* Back button */}
            <Link
              href="/store"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8b7b71] transition hover:text-[var(--store-primary)] dark:text-white/45 dark:hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to restaurant
            </Link>

            {/* Form card */}
            <div className="overflow-hidden rounded-[28px] border border-white shadow-[0_30px_80px_-35px_rgba(78,52,35,0.35)] dark:border-white/10 dark:bg-[#211a17] dark:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)]">
              {/* Top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[var(--store-primary)]" />

              <div className="p-6 sm:p-8 xl:p-10">
                {/* Header */}
                <div className="mb-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--store-primary)]/10 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--store-primary)] dark:bg-white/5">
                    <ChefHat className="size-4" />
                    Join our restaurant
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#fbbf24] text-[#30251f] shadow-[0_14px_30px_-15px_rgba(251,191,36,0.9)]">
                      <UtensilsCrossed className="size-7" />
                    </span>

                    <div>
                      <h1 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl dark:text-white">
                        Create an account
                      </h1>

                      <p className="mt-2 max-w-md text-sm leading-6 text-[#8b7b71] dark:text-white/45">
                        Register to order food, save
                        favourite dishes and manage your
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
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold dark:text-white/75"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a99b92] dark:text-white/30" />

                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        {...register("name")}
                        className={`${inputClassName} ${
                          errors.name
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                            : ""
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
                        className={`${inputClassName} ${
                          errors.email
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                            : ""
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
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold dark:text-white/75"
                    >
                      Phone Number

                      <span className="ml-1 font-medium text-[#a99b92] dark:text-white/30">
                        (Optional)
                      </span>
                    </label>

                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a99b92] dark:text-white/30" />

                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+8801712345678"
                        {...register("phone")}
                        className={`${inputClassName} ${
                          errors.phone
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                            : ""
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
                      className="mb-2 block text-sm font-bold dark:text-white/75"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a99b92] dark:text-white/30" />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        {...register("password")}
                        className={`${inputClassName} pr-12 ${
                          errors.password
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                            : ""
                        }`}
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
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--store-primary)] px-5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isSubmitting
                      ? "Creating account..."
                      : "Create Account"}

                    {!isSubmitting && (
                      <CheckCircle2 className="size-4 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                </form>

                {/* Login link */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#eadfd5] dark:bg-white/10" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a99b92] dark:text-white/30">
                    Already registered?
                  </span>

                  <div className="h-px flex-1 bg-[#eadfd5] dark:bg-white/10" />
                </div>

                <p className="text-center text-sm text-[#8b7b71] dark:text-white/50">
                  Already have an account?{" "}
                  <Link
                    href="/store/login"
                    className="font-bold text-[var(--store-primary)] transition hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-[#a99b92] dark:text-white/25">
              By creating an account, you agree to
              our terms and privacy policy.
            </p>
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