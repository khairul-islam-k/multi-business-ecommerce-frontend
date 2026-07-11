// src/app/store/register/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import z from "zod";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { CustomerRegisterPayload } from "@/types/template/auth";
import { templateAuthApi } from "@/lib/api/template-auth";
import OtpVerifyModal from "@/app/store/_components/otp-verify-modal";

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
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
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
        message: "Please enter a valid Bangladeshi phone number",
      },
    ),
});

export default function FashionRegisterPage() {
  const router = useRouter();
  const message = useMessage();

  // otp
  const [openOtpModal, setOpenOtpModal] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerRegisterPayload>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (data: CustomerRegisterPayload) => {
    try {
      setServerError(null);

      const response = await templateAuthApi.register(data);
      setOtpEmail(response?.customer?.email);
      setOpenOtpModal(true);
      message.success("Registered successfully");

      // reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again.";

        setServerError(message);
        return;
      }

      setServerError("Registration failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Image Side */}
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
            alt="Register background"
            fill
            priority
            className="object-cover"
            unoptimized
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <h1 className="max-w-xl text-4xl font-bold leading-tight">
              Create your shopping account
            </h1>

            <p className="mt-4 max-w-lg text-base text-white/80">
              Register now to track your orders, save your wishlist, and enjoy a
              better shopping experience.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-950">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your information to create a new account
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Jane Doe"
                    {...register("name")}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#f16d59] focus:ring-2 focus:ring-[#f16d59]/20"
                  />
                </div>

                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    placeholder="jene@example.com"
                    {...register("email")}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#f16d59] focus:ring-2 focus:ring-[#f16d59]/20"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    placeholder="+8801712345678"
                    {...register("phone")}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#f16d59] focus:ring-2 focus:ring-[#f16d59]/20"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="StrongPass123!"
                    {...register("password")}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#f16d59] focus:ring-2 focus:ring-[#f16d59]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#f16d59] px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/store/login"
                className="font-semibold text-[#f16d59] hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <OtpVerifyModal
        open={openOtpModal}
        email={otpEmail}
        onClose={() => setOpenOtpModal(false)}
        onVerified={() => {
          router.push("/store/login");
        }}
      />
    </main>
  );
}
