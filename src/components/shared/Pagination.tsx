"use client";

import React from "react";
import { Button, theme } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const { token } = theme.useToken();

  // =========================
  // CALCULATE 3 PAGE NUMBERS
  // =========================
  const getPages = () => {
    const visible = 3;
    const half = Math.floor(visible / 2);

    let start = Math.max(1, currentPage - half);
    let end = start + visible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPages();

  // =========================
  // HANDLERS
  // =========================
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
      }}
    >
      {/* First */}
      <Button disabled={currentPage === 1} onClick={() => goToPage(1)}>
        First
      </Button>

      {/* Prev */}
      <Button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        icon={<LeftOutlined />}
      ></Button>

      {/* Page Numbers */}
      <>
        {pages.map((page) => {
          return (
            <Button
              key={page}
              onClick={() => goToPage(page)}
              style={{
                padding: "6px 10px",
                fontWeight: page === currentPage ? "bold" : "normal",
                background:
                  page === currentPage
                    ? token.colorPrimary
                    : token.colorBgContainer,
                color:
                  page === currentPage ? token.colorWhite : token.colorText,
                borderRadius: "8px",
              }}
            >
              {page}
            </Button>
          );
        })}
      </>

      {/* Next */}
      <Button
        icon={<RightOutlined />}
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      ></Button>

      {/* Last */}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(totalPages)}
      >
        Last
      </Button>
    </div>
  );
};

export default Pagination;
