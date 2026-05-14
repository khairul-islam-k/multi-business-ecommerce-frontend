"use client";

import { Alert, Button, Form, Input, message } from "antd";
import OtpVerifyDialog from "./otp-verify-dialog";
import { useState } from "react";
import api, { getApiErrorMessage } from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";

type ChangeEmailFormValues = {
    newEmail: string;
    confirmEmail: string;
};

export default function ChangeEmailForm() {
    const [form] = Form.useForm<ChangeEmailFormValues>();
    const swal = useSwal();

    // otp state
    const [otpDialogOpen, setOtpDialogOpen] = useState<boolean>(false);
    const [emailForOtp, setEmailForOtp] = useState<string>("");

    const handleSubmit = async (values: ChangeEmailFormValues) => {
        const payload = {
            newEmail: values.newEmail,
        };

        try {
            api.post('/auth/change-email/request', payload)
            setEmailForOtp(values.newEmail);
            setOtpDialogOpen(true);
        } catch (error) {
            swal.error(getApiErrorMessage(error))
        }


    };

    return (
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
                Change Email
            </h2>

            <p className="mb-5 text-sm text-slate-500">
                Enter your new email address to receive a verification OTP.
            </p>

            <Alert
                type="warning"
                showIcon
                className="mb-5"
                title="OTP will be sent to your new email"
                description="We will send a verification OTP to your new email address. Please check carefully and make sure you have access to this email before continuing."
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    label="New Email"
                    name="newEmail"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your new email",
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email address",
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="khairul.web1@gmail.com"
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm Email"
                    name="confirmEmail"
                    dependencies={["newEmail"]}
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your new email",
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email address",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newEmail") === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error("Confirm email does not match new email"),
                                );
                            },
                        }),
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Confirm your new email"
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" size="large" block>
                    Send OTP
                </Button>
            </Form>

            <OtpVerifyDialog
                open={otpDialogOpen}
                email={emailForOtp}
                onClose={() => setOtpDialogOpen(false)}
                onVerified={() => {
                    form.resetFields();
                    message.success("Your email has been changed successfully");
                }}
            />
        </div>
    );
}