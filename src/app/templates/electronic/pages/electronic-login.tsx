"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { templateAuthApi } from "@/lib/api/template-auth";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useRouter } from "next/navigation";
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

const electronicSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=85",
    title: "Discover the latest electronics",
    description:
      "Shop smartphones, laptops, accessories, and smart devices from trusted brands.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1600&q=85",
    title: "Technology that fits your lifestyle",
    description:
      "Find powerful devices and essential accessories designed for work, entertainment, and everyday life.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=85",
    title: "Smart products, better experiences",
    description:
      "Log in to manage your orders, wishlist, profile, and complete your shopping experience.",
  },
];

export default function ElectronicLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Electronic image slider
  const [activeSlide, setActiveSlide] = useState(0);

  const message = useMessage();
  const router = useRouter();

  // Global state
  const { LOginUser } = useCart();

  // Forgot-password modal
  const [forgetOpen, setForgetOpen] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState<string>("");

  // Email verification modal
  const [otpOpen, setOtpOpen] = useState<boolean>(false);

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

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setActiveSlide(
        (currentSlide) => (currentSlide + 1) % electronicSlides.length,
      );
    }, 5000);

    return () => {
      window.clearInterval(slideInterval);
    };
  }, []);

  const onSubmit = async (data: CustomerLoginPayload) => {
    try {
      setServerError(null);

      const res = await templateAuthApi.login(data);

      const loginPayload = {
        id: res?.customer?.id,
        name: res.customer.name,
        email: res.customer.email,
        phone: res.customer.phone,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      };

      LOginUser(loginPayload);

      message.success("Login successfully");
      router.push("/store");
    } catch (error) {
      setServerError("Invalid email or password");
    }
  };

  const handleForget = async () => {
    const email = emailValue?.trim().toLowerCase();

    if (!email) {
      message.error("Please enter your email address");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      message.error("Invalid email address");
      return;
    }

    try {
      await templateAuthApi.forgetOtpSend(email);

      setVerifyEmail(email);
      setForgetOpen(true);
    } catch (error) {
      message.error("Something went wrong");
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
                  : "scale-105 opacity-0"
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

              {/* Slider dots */}
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

        {/* Right login form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)] p-6 shadow-sm sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
                <Lock className="size-6" />
              </div>

              <h2 className="text-3xl font-bold">Welcome Back</h2>

              <p className="mt-2 text-sm text-[var(--store-muted)]">
                Enter your email and password to continue
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted)]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register("password")}
                    className="w-full rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] py-3 pl-12 pr-12 text-sm text-[var(--store-text)] outline-none transition placeholder:text-[var(--store-muted)] focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
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

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-[var(--store-muted)]">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-[var(--store-border)] accent-[var(--store-primary)]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={handleForget}
                  className="text-sm font-medium text-[var(--store-primary)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[var(--store-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--store-muted)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/store/register"
                className="font-semibold text-[var(--store-primary)] hover:underline"
              >
                Create account
              </Link>
            </p>

            <p className="mt-5 text-center text-sm text-[var(--store-muted)]">
              Email not verified?{" "}
              <button
                type="button"
                onClick={() => setOtpOpen(true)}
                className="font-semibold text-[var(--store-primary)] underline-offset-4 hover:underline"
              >
                Verify email
              </button>
            </p>
          </div>
        </div>
      </div>

      <ForgotOtpVerifyModal
        open={forgetOpen}
        email={verifyEmail}
        onClose={() => setForgetOpen(false)}
        onVerified={() => {}}
      />

      <OtpVerifyModal
        open={otpOpen}
        email=""
        onClose={() => setOtpOpen(false)}
        onVerified={() => {
          router.push("/store/login");
        }}
      />
    </main>
  );
}