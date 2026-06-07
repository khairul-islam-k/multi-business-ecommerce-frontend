"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { App, Button, Input, Modal, Typography } from "antd";

import api from "@/lib/axios";

const { Text, Title } = Typography;

type OtpVerifyDialogProps = {
    open: boolean;
    email: string;
    onClose: () => void;
    onVerified?: () => void;
};

function getApiErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
}

export default function OtpVerifyDialog({
    open,
    email,
    onClose,
    onVerified,
}: OtpVerifyDialogProps) {
    const [otp, setOtp] = React.useState("");
    const { message } = App.useApp();

    const verifyMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post("/auth/change-email/verify", {
                email,
                otp,
            });

            return response.data;
        },

        onSuccess: () => {
            message.success("Email verified successfully");

            setOtp("");
            onClose();
            onVerified?.();
        },

        onError: (error) => {
            message.error(getApiErrorMessage(error));
        },
    });

    const handleClose = () => {
        if (verifyMutation.isPending) return;

        setOtp("");
        onClose();
    };

    const handleVerify = () => {
        if (otp.length !== 6) {
            message.error("Please enter 6 digit OTP");
            return;
        }

        verifyMutation.mutate();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            width={420}
            maskClosable={!verifyMutation.isPending}
            closable={!verifyMutation.isPending}
        >
            <div className="pt-2">
                <div className="mb-6 text-center">
                    <Title level={4} className="!mb-2">
                        Verify your email
                    </Title>

                    <Text type="secondary">
                        We sent a 6-digit OTP code to{" "}
                        <span className="font-medium text-slate-900">{email}</span>
                    </Text>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <Input.OTP
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        size="large"
                        disabled={verifyMutation.isPending}
                    />

                    <Button
                        type="primary"
                        htmlType="button"
                        size="large"
                        block
                        loading={verifyMutation.isPending}
                        disabled={otp.length !== 6}
                        onClick={handleVerify}
                    >
                        Verify OTP
                    </Button>
                </div>
            </div>
        </Modal>
    );
}