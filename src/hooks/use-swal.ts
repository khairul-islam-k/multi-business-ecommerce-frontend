"use client";

import Swal from "sweetalert2";
import { theme } from "antd";

type SwalIcon = "success" | "error" | "warning" | "info" | "question";

type BaseOptions = {
  title?: string;
  text?: string;
  html?: string;
  icon?: SwalIcon;

  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;

  onConfirm?: () => void | Promise<void>;
};

export function useSwal() {
  const { token } = theme.useToken();

  const fire = async (options: BaseOptions) => {
    const result = await Swal.fire({
      ...options,

      buttonsStyling: false,

      customClass: {
        popup: "antd-swal-popup",
        title: "antd-swal-title",
        htmlContainer: "antd-swal-content",
        confirmButton: "antd-btn antd-btn-primary",
        cancelButton: "antd-btn",
        actions: "antd-swal-actions",
      },

      didOpen: (el) => {
        const style = el.style;

        style.setProperty("--swal-bg", token.colorBgElevated);
        style.setProperty("--swal-text", token.colorText);
        style.setProperty("--swal-border", token.colorBorder);
        style.setProperty("--swal-radius", `${token.borderRadiusLG}px`);
        style.setProperty("--swal-shadow", token.boxShadowSecondary);
      },
    });

    if (result.isConfirmed && options.onConfirm) {
      await options.onConfirm();
    }

    return result;
  };

  const confirm = (options: BaseOptions) =>
    fire({
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      ...options,
    });

  const success = (text: string) =>
    fire({
      icon: "success",
      text,
      confirmButtonText: "OK",
    });

  const error = (text: string) =>
    fire({
      icon: "error",
      text,
      confirmButtonText: "OK",
    });

  return { fire, confirm, success, error };
}
