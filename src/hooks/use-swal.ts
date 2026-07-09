"use client";

import { App } from "antd";

import type { ModalFuncProps } from "antd";

type ConfirmOptions = ModalFuncProps & {
  onConfirm?: () => void | Promise<void>;
};

export function useSwal() {
  const { message, modal } = App.useApp();

  const confirm = (options: ConfirmOptions) => {
    const { onConfirm, ...modalOptions } = options;

    modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        if (onConfirm) {
          await onConfirm();
        }
      },
      ...modalOptions,
    });
  };

  const success = (text: string) => {
    message.success(text);
  };

  const error = (text: string) => {
    message.error(text);
  };

  const warning = (text: string) => {
    message.warning(text);
  };

  const info = (text: string) => {
    message.info(text);
  };

  return {
    confirm,
    success,
    error,
    warning,
    info,
    message,
    modal,
  };
}
