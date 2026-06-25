"use client";

import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import api, { getApiErrorMessage } from "@/lib/axios";

type ForgotOtpVerifyModalProps = {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified?: () => void;
};

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotOtpVerifyModal({
  open,
  email,
  onClose,
  onVerified,
}: ForgotOtpVerifyModalProps) {
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [otpError, setOtpError] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetModalState = () => {
    setOtp("");
    setVerificationId("");
    setOtpError("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    reset();
  };

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/reset-password/verify-otp", {
        email,
        otp,
      });

      return response.data;
    },

    onSuccess: (data) => {
      const id =
        data?.data?.verificationId ??
        data?.data?.id ??
        data?.verificationId ??
        data?.id;

      if (!id) {
        setOtpError("Verification id not found from server response");
        return;
      }

      setVerificationId(String(id));
      setOtp("");
      setOtpError("");
    },

    onError: (error) => {
      setOtpError(getApiErrorMessage(error));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordFormValues) => {
      const response = await api.post("/auth/forgot-password/reset", {
        verificationId,
        email,
        password: payload.newPassword,
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Password reset successfully");

      resetModalState();
      onVerified?.();
      onClose();
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleClose = () => {
    // if (verifyMutation.isPending || resetPasswordMutation.isPending) return;

    resetModalState();
    onClose();
  };

  // step 1

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    setOtpError("");
  };

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!verificationId) {
      toast.error("Verification id is missing");
      return;
    }

    resetPasswordMutation.mutate(values);
  };

  if (!open) return null;

  // const isLoading = verifyMutation.isPending || resetPasswordMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {verificationId ? "Reset your password" : "Verify your email"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {verificationId ? (
                "Please provide your new password."
              ) : (
                <>
                  We sent a 6-digit OTP code to{" "}
                  <span className="font-semibold text-slate-900">{email}</span>
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            // disabled={isLoading}
            className="rounded-full px-2 py-1 text-xl text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {verificationId ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  className="h-11 w-full rounded-xl border border-slate-300 px-4 pr-11 text-sm outline-none focus:border-slate-900"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className="h-11 w-full rounded-xl border border-slate-300 px-4 pr-11 text-sm outline-none focus:border-slate-900"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetPasswordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {otpError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-600">
                {otpError}
              </p>
            )}

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-center text-lg font-semibold tracking-[8px] outline-none focus:border-slate-900"
            />

            <button
              type="button"
              // disabled={otp.length !== 6 || verifyMutation.isPending}
              onClick={handleVerify}
              className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}