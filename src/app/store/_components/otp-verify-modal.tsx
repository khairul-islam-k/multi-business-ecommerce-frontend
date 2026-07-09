"use client";

import React from "react";
import { templateAuthApi } from "@/lib/api/template-auth";
import { useMessage } from "./message/message-hook";

type OtpVerifyModalProps = {
  open: boolean;
  email?: string;
  onClose: () => void;
  onVerified?: () => void;
};

export default function OtpVerifyModal({
  open,
  email,
  onClose,
  onVerified,
}: OtpVerifyModalProps) {
  const [otp, setOtp] = React.useState("");
  const [verifyEmail, setVerifyEmail] = React.useState(email || "");
  const [isOtpSent, setIsOtpSent] = React.useState(Boolean(email));
  const message = useMessage();


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
      message.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      message.error("Please enter a valid email address");
      return;
    }

    try {
      await templateAuthApi.sendOtp(emailValue);
      message.success("OTP sent successfully");
      setIsOtpSent(true);
    } catch {
      message.error("Failed to send OTP");
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      message.error("Please enter 6 digit OTP");
      return;
    }

    const payload = {email: verifyEmail, otp}

    try {
      const res = await templateAuthApi.otpVerify(payload);

      message.success("Email verified successfully");

      console.log('res', res);

      setOtp("");
      setVerifyEmail("");
      setIsOtpSent(false);

      onClose();
      onVerified?.();
    } catch {
      message.error("Failed to verify OTP");
    }
  };

  const handleClose = () => {

    setOtp("");
    setVerifyEmail("");
    setIsOtpSent(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Verify your email
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isOtpSent
                ? `We sent a 6 digit OTP to ${verifyEmail}`
                : "Enter your email address to receive OTP."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full px-2 py-1 text-xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        {isOtpSent ? (
          <div className="space-y-4">
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
              onClick={handleVerify}
              // disabled={otp.length !== 6 || emailVerify.isPending}
              className="h-11 w-full rounded-xl bg-[#f16d59] text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {false ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              // disabled={sendOtp.isPending || emailVerify.isPending}
              className="h-11 w-full rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {false ? "Sending..." : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtp("");
                setIsOtpSent(false);
              }}
              // disabled={sendOtp.isPending || emailVerify.isPending}
              className="w-full text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Change email
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={verifyEmail}
              onChange={(event) => setVerifyEmail(event.target.value)}
              // disabled={sendOtp.isPending}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              // disabled={sendOtp.isPending}
              className="h-11 w-full rounded-xl bg-[#f16d59] text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {false ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}