"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm , useWatch} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useSwal } from "@/hooks/use-swal";
import Logo from "@/components/shared/logo";
import api, { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { getDashboardPath, isSafeInternalPath } from "@/lib/auth/permissions";
import ForgerOtpVerify from "./forget-otp";
import OtpVerifyDialog from "../../_components/otp-verify-dialog";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

type SignInClientProps = {
  redirectTo?: string;
};

const inputClassName =
  "h-10 sm:h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function SignInClient({ redirectTo }: SignInClientProps) {
  const [showPassword, setShowPassword] = useState(false);

  // verify
  const [otpOpen, setOtpOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verificationId, setVerificationId] = useState<string>("");

  const [forgetOpen, setForgetOpen] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const swal = useSwal();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = useWatch({name: "email", control});

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const result = await login(data.email, data.password);

      console.log('result', result);

        swal.success("Signed in successfully!");

        const fallbackPath = getDashboardPath(result.user.type);

        const redirectPath =
          redirectTo && isSafeInternalPath(redirectTo)
            ? redirectTo
            : fallbackPath;

      router.push(redirectPath);
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const handleForget = async () => {
    const email = emailValue?.trim().toLowerCase();

    if (!email) return;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      swal.error("Invalid Email");
      return;
    }

    console.log(email, 'email');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setVerifyEmail(email)
      setForgetOpen(true);

    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  }

  return (
    <main className="min-h-dvh bg-background px-3 py-4 text-foreground sm:p-5">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card shadow-lg lg:max-w-5xl lg:grid-cols-2">
          <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-center lg:gap-6">
            <div>
              <Logo collapsed />

              <div className="mt-6">
                <p className="mb-3 text-sm font-medium uppercase text-primary-foreground/70">
                  Welcome back
                </p>

                <h1 className="max-w-md text-4xl font-bold tracking-tight">
                  Continue managing your ecommerce operations.
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground/80">
                  Access your dashboard to manage stores, orders, inventory,
                  customers, payments and courier workflows.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 p-6">
              <p className="text-sm leading-6 text-primary-foreground/80">
                Onecomm gives your team one clean control center for daily
                ecommerce operations.
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/15 text-sm font-semibold">
                  OC
                </div>

                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Onecomm</p>
                  <p className="text-xs text-primary-foreground/70">
                    Ecommerce Platform
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="my-auto px-4 py-5 sm:px-6 sm:py-6 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-5">
                <Link
                  href="/"
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to home
                </Link>

                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Sign in
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  Enter your credentials to continue to your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                      className="block text-xs font-medium text-foreground"
                    >
                      Password
                    </label>

                    <p
                      onClick={handleForget}
                      className="text-xs cursor-pointer font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
                    >
                      Forgot?
                    </p>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  Create account
                </Link>
              </p>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                If your email is not verified.?{" "}
                <span
                  onClick={() => setOtpOpen(true)}
                  className="font-semibold text-foreground underline-offset-4 hover:underline cursor-pointer"
                >
                  Verify
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>

      <ForgerOtpVerify
        open={forgetOpen}
        email={verifyEmail}
        onClose={() => setForgetOpen(false)}
        onVerified={() => router.push("/sign-in")}
      />

      <OtpVerifyDialog
        open={otpOpen}
        email={''}
        onClose={() => setOtpOpen(false)}
        onVerified={() => router.push("/sign-in")}
      />
    </main>
  );
}
