"use client";

import type { ReactNode } from "react";
import { toast, type Id } from "react-toastify";

type ConfirmOptions = {
  title?: ReactNode;
  content?: ReactNode;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

export function useMessage() {
  const success = (text: string) => {
    toast.success(text);
  };

  const error = (text: string) => {
    toast.error(text);
  };

  const warning = (text: string) => {
    toast.warning(text);
  };

  const info = (text: string) => {
    toast.info(text);
  };

  const loading = (text: string) => {
    return toast.loading(text);
  };

  const dismiss = (id?: Id) => {
    toast.dismiss(id);
  };

  const updateLoading = (
    id: Id,
    type: "success" | "error",
    message: string,
  ) => {
    toast.update(id, {
      render: message,
      type,
      isLoading: false,
      autoClose: 3000,
    });
  };

  const confirm = ({
    title = "Are you sure?",
    content = "This action cannot be undone.",
    okText = "Confirm",
    cancelText = "Cancel",
    danger = true,
    onConfirm,
    onCancel,
  }: ConfirmOptions) => {
    const toastId = toast(
      () => (
        <div className="w-full">
          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>

          <div className="mt-2 text-sm text-slate-600">
            {content}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onCancel?.();
                toast.dismiss(toastId);
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={async () => {
                await onConfirm?.();
                toast.dismiss(toastId);
              }}
              className={
                danger
                  ? "rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  : "rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              }
            >
              {okText}
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    updateLoading,
    confirm,
    toast,
  };
}