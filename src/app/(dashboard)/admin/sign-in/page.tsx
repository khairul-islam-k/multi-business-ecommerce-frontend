"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Logo from "@/components/shared/logo";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const inputClassName =
  "h-10 sm:h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    console.log("SIGN_IN_DATA:", data);
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_right,#ecfeff,transparent_35%),linear-gradient(135deg,#f8fafc,#ffffff)] p-6 sm:p-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-60 w-60 animate-blob rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-64 w-64 animate-blob rounded-full bg-primary-glow/30 blur-3xl [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 animate-blob rounded-full bg-accent/40 blur-3xl [animation-delay:4s]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60 backdrop-blur lg:max-w-5xl lg:grid-cols-2 lg:rounded-3xl">
          {/* Left Side */}
          <section className="hidden bg-slate-800 p-12 text-white lg:flex lg:flex-col lg:justify-center lg:gap-6">
            <div>
              <Logo collapsed />

              <div className="mt-6">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
                  Welcome back
                </p>

                <h1 className="max-w-md text-4xl font-bold tracking-tight">
                  Continue managing your ecommerce operations.
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                  Access your dashboard to manage stores, orders, inventory,
                  customers, payments and courier workflows.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-sm leading-6 text-slate-300">
                “Onecomm gives your team one clean control center for daily
                ecommerce operations.”
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20" />

                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Onecomm</p>
                  <p className="text-xs text-slate-400">Ecommerce Platform</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Side */}
          <section className="px-4 py-5 my-auto sm:px-6 sm:py-6 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-5">
                <Link
                  href="/"
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to home
                </Link>

                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Sign in
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                  Enter your credentials to continue to your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-slate-600 underline-offset-4 transition hover:text-slate-950 hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
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
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/admin/sign-up"
                  className="font-semibold text-slate-950 underline-offset-4 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
