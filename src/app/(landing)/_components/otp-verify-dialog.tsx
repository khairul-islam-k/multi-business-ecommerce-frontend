"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
// import { getApiErrorMessage } from "@/lib/get-api-error-message";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSwal } from "@/hooks/use-swal";

type OtpVerifyDialogProps = {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified?: () => void;
};

export default function OtpVerifyDialog({
  open,
  email,
  onClose,
  onVerified,
}: OtpVerifyDialogProps) {
  const [otp, setOtp] = React.useState("");
  const swal = useSwal();

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/register/verify", {
        email,
        otp,
      });

      return response.data;
    },

    onSuccess: () => {
      swal.success('email verify successfully');

      setOtp("");
      onClose();
      onVerified?.();
    },

    onError: (error) => {
    swal.error(error.message);
    },
  });

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    verifyMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setOtp("");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify your email</DialogTitle>
          <DialogDescription>
            We sent a 6-digit OTP code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
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
      </DialogContent>
    </Dialog>
  );
}