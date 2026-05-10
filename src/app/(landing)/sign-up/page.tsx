"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Store,
  User,
} from "lucide-react";
import Logo from "@/components/shared/logo";
import api from "@/lib/axios";
import successMessage from "@/hooks/succes-message";
import { useRouter } from "next/navigation";
import errorMessage from "@/hooks/error-message";

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z
    .string()
    .trim()
    .max(80, "Store name cannot be longer than 80 characters")
    .optional(),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const inputClassName =
  "h-10 sm:h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      businessName: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const payload = {
      ...data,
      businessName: data.businessName?.trim() || undefined,
    };

    console.log("SIGN_UP_DATA:", payload);
    api.post('/auth/register', payload)
    .then(res => {
      successMessage('Register successfully');
      router.push('/sign-in');
    })
    .catch(error => {
      errorMessage();
      console.log(error);
    })
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_right,#ecfeff,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff)] px-3 py-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-60 w-60 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-primary-glow/20 blur-3xl animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-accent/30 blur-3xl animate-blob [animation-delay:4s]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60 backdrop-blur lg:max-w-5xl lg:grid-cols-2 lg:rounded-3xl">
          {/* Left Side */}
          <section className="hidden bg-slate-800 p-6 text-white lg:flex lg:flex-col lg:justify-center lg:gap-5">
            <div>
              <Logo collapsed />

              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                  Start selling smarter
                </p>

                <h1 className="max-w-md text-3xl font-bold tracking-tight">
                  Create your ecommerce workspace in minutes.
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                  Add a default store now or skip it and create stores later
                  from your dashboard.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm leading-6 text-slate-300">
                “Onecomm helps teams manage products, stock, customers, orders,
                payments and courier operations from one clean system.”
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/20" />

                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Onecomm</p>
                  <p className="text-xs text-slate-400">Ecommerce Platform</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Side */}
          <section className="px-4 py-5 sm:px-6 sm:py-6 lg:p-10">
            <div className="mx-auto w-full">
              <div className="mb-5">
                <Link
                  href="/"
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to home
                </Link>

                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Create account
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                  Set up your account and optionally create your first store.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      className={`${inputClassName} pl-9`}
                      {...register("name")}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={`${inputClassName} pl-9`}
                      {...register("email")}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="defaultStoreName"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Default store name{" "}
                    <span className="font-normal text-slate-400">optional</span>
                  </label>

                  <div className="relative">
                    <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="businessName"
                      type="text"
                      placeholder="Example: Onecomm Store"
                      className={`${inputClassName} pl-9`}
                      {...register("businessName")}
                    />
                  </div>

                  {errors.businessName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className={`${inputClassName} pl-9 pr-9`}
                      {...register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-primary shadow-soft hover:shadow-elevated flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-slate-950 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
