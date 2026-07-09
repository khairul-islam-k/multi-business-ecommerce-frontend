"use client";

import React from "react";
import { toast } from "sonner";


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

import { Input } from "@/components/ui/input";
import { useVerifyEmail } from "@/lib/api/hooks/verify-email";

type OtpVerifyDialogProps = {
  open: boolean;
  email?: string;
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
  const [verifyEmail, setVerifyEmail] = React.useState(email || "");
  const [isOtpSent, setIsOtpSent] = React.useState(Boolean(email));
  const { sendOtp, emailVerify } = useVerifyEmail(verifyEmail);

  React.useEffect(() => {
    if (open) {
      setOtp("");
      setVerifyEmail(email || "");
      setIsOtpSent(Boolean(email));
    }
  }, [open, email]);

  const handleSendOtp = async () => {
    const emailValue = verifyEmail.trim();

    if (!emailValue) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await sendOtp.mutateAsync();
      toast.success('OTP sent');
      setIsOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP");
    }

    // sendOtpMutation.mutate();
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }
    try {
      await emailVerify.mutateAsync({
        email: verifyEmail.trim(),
        otp
      })

      toast.success("Email verified successfully");

      setOtp("");
      setVerifyEmail("");
      setIsOtpSent(false);

      onClose();
      onVerified?.();

    } catch (error) {
      toast.error("Failed to verify OTP");
    }

  };

  const handleClose = () => {
    if (sendOtp.isPending || emailVerify.isPending) return;

    setOtp("");
    setVerifyEmail("");
    setIsOtpSent(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify your email</DialogTitle>

          <DialogDescription>
            {isOtpSent ? (
              <>
                We sent a 6-digit OTP code to{" "}
                <span className="font-medium text-foreground">
                  {verifyEmail}
                </span>
              </>
            ) : (
              "Enter your email address. We will send a 6-digit OTP code to verify your account."
            )}
          </DialogDescription>
        </DialogHeader>

        {isOtpSent ? (
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

            <p
              onClick={handleSendOtp}
              className="cursor-pointer"
            >Resend OTP</p>

            <Button
              type="button"
              className="w-full"
              disabled={otp.length !== 6 || emailVerify.isPending}
              onClick={handleVerify}
            >
              {emailVerify.isPending ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={sendOtp.isPending || emailVerify.isPending}
              onClick={() => setIsOtpSent(false)}
            >
              Change email
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={verifyEmail}
              onChange={(event) => setVerifyEmail(event.target.value)}
              disabled={sendOtp.isPending}
            />

            <Button
              type="button"
              className="w-full"
              disabled={sendOtp.isPending}
              onClick={handleSendOtp}
            >
              {sendOtp.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}