"use client";

import Link from "next/link";
import { Button } from "antd";
import { HomeOutlined, LoginOutlined } from "@ant-design/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-xl rounded-lg border border-black/10 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The page you requested does not exist, or you may not have access to
          it in the current business workspace.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/admin/dashboard">
            <Button type="primary" icon={<HomeOutlined />}>
              Dashboard
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button icon={<LoginOutlined />}>Sign in</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
