"use client";

import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
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
import api, { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import OtpVerifyDialog from "../_components/otp-verify-dialog";
import { toast } from "sonner";

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
    businessName: z
      .string()
      .trim()
      .max(80, "Store name cannot be longer than 80 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must be same",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

type CheckEmailResponse = {
  success: boolean;
  message: string;
  data: {
    exists: boolean;
    available: boolean;
  };
};

const inputClassName =
  "h-10 sm:h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const registerAccount = useAuthStore((state) => state.register);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessName: "",
    },
  });


  const emailValue = watch("email");
  const [debouncedEmail] = useDebounce(emailValue, 600);

  // Email validation
  useEffect(() => {
    const checkEmail = async () => {
      const email = debouncedEmail?.trim().toLowerCase();

      setIsEmailAvailable(false);

      if (!email) return;

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValidEmail) return;

      try {
        setIsEmailChecking(true);

        const response = await api.get(
          `/auth/validate-email?email=${email}`,
        );

        const result = response.data as CheckEmailResponse;

        if (result.data.exists) {
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });

          setIsEmailAvailable(false);
          return;
        }

        clearErrors("email");
        setIsEmailAvailable(true);
      } catch {
        setError("email", {
          type: "manual",
          message: "Could not validate email",
        });

        setIsEmailAvailable(false);
      } finally {
        setIsEmailChecking(false);
      }
    };

    checkEmail();
  }, [debouncedEmail, setError, clearErrors]);

  const onSubmit = async (data: SignUpFormValues) => {
    if (isEmailChecking) {
      toast.error("Please wait. Email checking is running.");
      return;
    }


    const { name, email, password, businessName } = data;

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      businessName: businessName?.trim() || undefined,
    };

    try {
      await registerAccount(payload);
      toast.success("Registration successfully")

      setVerifyEmail(payload.email);
      setOtpOpen(true);

    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <main className="min-h-dvh bg-background px-3 py-4 text-foreground sm:p-5">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card shadow-lg lg:max-w-5xl lg:grid-cols-2">
          <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-center lg:gap-5">
            <div>
              <Logo collapsed />

              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase text-primary-foreground/70">
                  Start selling smarter
                </p>

                <h1 className="max-w-md text-3xl font-bold tracking-tight">
                  Create your ecommerce workspace in minutes.
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-primary-foreground/80">
                  Add a default store now or skip it and create stores later
                  from your dashboard.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 p-5">
              <p className="text-sm leading-6 text-primary-foreground/80">
                Onecomm helps teams manage products, stock, customers, orders,
                payments and courier operations from one clean system.
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15 text-sm font-semibold">
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

          <section className="px-4 py-5 sm:px-6 sm:py-6 lg:p-10">
            <div className="mx-auto w-full">
              <div className="mb-5">
                <Link
                  href="/"
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to home
                </Link>

                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Create account
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  Set up your account and optionally create your first store.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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

                  {isEmailChecking && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Checking email...
                    </p>
                  )}

                  {!isEmailChecking && isEmailAvailable && !errors.email && (
                    <p className="mt-1 text-xs text-green-600">
                      Email is available
                    </p>
                  )}

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Default store name{" "}
                    <span className="font-normal text-muted-foreground">
                      optional
                    </span>
                  </label>

                  <div className="relative">
                    <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      className={`${inputClassName} pl-9 pr-9`}
                      {...register("confirmPassword")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isEmailChecking}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>

              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>

      <OtpVerifyDialog
        open={otpOpen}
        email={verifyEmail}
        onClose={() => setOtpOpen(false)}
        onVerified={() => router.push("/sign-in")}
      />
    </main>
  );
}