"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { templateAuthApi } from "@/lib/api/template-auth";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { useRouter } from "next/navigation";
import OtpVerifyModal from "@/app/store/_components/otp-verify-modal";
import ForgotOtpVerifyModal from "@/app/store/_components/forgot-otp-verify-modal";

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


export default function FashionLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const message = useMessage();
    const router = useRouter();

    // forget modal 
    const [forgetOpen, setForgetOpen] = useState<boolean>(false);
    const [verifyEmail, setVerifyEmail] = useState<string>('');

    // Email verified 
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

    const emailValue = useWatch({ control, name: "email" });

    const onSubmit = async (data: CustomerLoginPayload) => {
        try {
            setServerError(null);

            const res = await templateAuthApi.login(data);
            message.success('Login Successfully');

            console.log('res', res);

            router.push('/store')
        } catch (error) {
            console.log("login error", error);
            setServerError("Invalid email or password");
        }
    };

    const handleForget = async () => {

        const email = emailValue?.trim().toLowerCase();

        if (!email) return;

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isValidEmail) {
            message.error("Invalid Email");
            return;
        }

        console.log(email, 'email');

        try {
            const res = await templateAuthApi.forgetOtpSend(email);
            console.log('res', res);
            setVerifyEmail(email)
            setForgetOpen(true);

        } catch (error) {
            console.log(error);
            message.error('something went wrong');
        }
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                {/* Left Image Side */}
                <div className="relative hidden overflow-hidden lg:block">
                    <Image
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
                        alt="Login background"
                        fill
                        priority
                        className="object-cover"
                        unoptimized
                    />

                    <div className="absolute inset-0 bg-black/45" />

                    <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                        <h1 className="max-w-xl text-4xl font-bold leading-tight">
                            Welcome back to your store
                        </h1>

                        <p className="mt-4 max-w-lg text-base text-white/80">
                            Login to manage your orders, profile, wishlist, and shopping
                            experience.
                        </p>
                    </div>
                </div>

                {/* Right Form Side */}
                <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-950">Login</h2>
                            <p className="mt-2 text-sm text-gray-500">
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="email"
                                        placeholder="customer@example.com"
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

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
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

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        className="size-4 rounded border-gray-300 accent-[#f16d59]"
                                    />
                                    Remember me
                                </label>

                                <span
                                    onClick={handleForget}
                                    className="text-sm font-medium text-[#f16d59] hover:underline cursor-pointer"
                                >
                                    Forgot password?
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-[#f16d59] px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/store/register"
                                className="font-semibold text-[#f16d59] hover:underline"
                            >
                                Create account
                            </Link>
                        </p>

                        <p className="mt-5 text-center text-sm text-muted-foreground">
                            Email not verified?{" "}
                            <span
                                onClick={() => setOtpOpen(true)}
                                className="font-semibold text-foreground underline-offset-4 hover:underline cursor-pointer"
                            >
                                Email Verify
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <ForgotOtpVerifyModal
                open={forgetOpen}
                email={verifyEmail}
                onClose={() => setForgetOpen(false)}
                onVerified={() => {
                    console.log("Password reset done");
                }}
            />


            <OtpVerifyModal
                open={otpOpen}
                email=''
                onClose={() => setOtpOpen(false)}
                onVerified={() => {
                    router.push('/store/login')
                }}
            />
        </main>
    );
}