"use client";

import { theme } from "antd";
import Swal, { type SweetAlertOptions } from "sweetalert2";

type BaseOptions = SweetAlertOptions & {
  onConfirm?: () => void | Promise<void>;
};

export function useSwal() {
  const { token } = theme.useToken();

  const fire = async (options: BaseOptions) => {
    const { onConfirm, ...swalOptions } = options;

    const result = await Swal.fire({
      ...swalOptions,

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

    if (result.isConfirmed && onConfirm) {
      await onConfirm();
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

  const success = (title: string) =>
    fire({
      position: "top-end",
      icon: "success",
      title,
      showConfirmButton: false,
      timer: 1500,
    });

  const error = (text: string) =>
    fire({
      icon: "error",
      text,
      confirmButtonText: "OK",
    });

  return {
    fire,
    confirm,
    success,
    error,
  };
}