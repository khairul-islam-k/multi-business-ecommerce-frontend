"use client";

import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import api, { getApiErrorMessage } from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type OtpVerifyDialogProps = {
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

const ForgerOtpVerify = ({
  open,
  email,
  onClose,
  onVerified,
}: OtpVerifyDialogProps) => {
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [otpError, setOtpError] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetDialogState = () => {
    setOtp("");
    setVerificationId("");
    setOtpError("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    form.reset();
  };

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/reset-password/verify-otp", {
        email,
        otp,
      });

      return response.data;
    },

    onSuccess: (response) => {
      const id = response.data.resetRequestId;

      if (!id) {
        setOtpError("Verification id not found from server response");
        return;
      }

      setVerificationId(String(id));
      setOtp("");
      setOtpError("");
    },

    onError: (error) => {
      const message = getApiErrorMessage(error);
      setOtpError(message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordFormValues) => {
      const response = await api.post("/auth/forgot-password/reset", {
        resetRequestId: verificationId,
        email,
        password: payload.newPassword,
      });

      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Password reset successfully");

      resetDialogState();
      onVerified?.();
      onClose();
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    setOtpError("");
    verifyMutation.mutate();
  };

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!verificationId) {
      toast.error("Verification id is missing");
      return;
    }

    resetPasswordMutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetDialogState();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {verificationId ? "Reset your password" : "Verify your email"}
          </DialogTitle>

          <DialogDescription>
            {verificationId ? (
              "Please provide your new password."
            ) : (
              <>
                We sent a 6-digit OTP code to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {verificationId ? (
          <div className="w-full rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Reset Password
              </h2>

              <p className="text-sm text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                          />

                          <button
                            type="button"
                            aria-label={
                              showNewPassword
                                ? "Hide new password"
                                : "Show new password"
                            }
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                          />

                          <button
                            type="button"
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset Password"}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4">
            {otpError && (
              <p className="text-center text-sm font-medium text-red-600">
                {otpError}
              </p>
            )}

            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="button"
              className="w-full"
              disabled={otp.length !== 6 || verifyMutation.isPending}
              onClick={handleVerify}
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgerOtpVerify;
