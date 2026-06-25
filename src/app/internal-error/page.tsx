"use client";

import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InternalErrorPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>

          <p className="text-6xl font-bold text-destructive">500</p>

          <CardTitle className="text-2xl">Internal Server Error</CardTitle>

          <CardDescription>
            Sorry, something went wrong on the server. Please try again later.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 size-4" />
            Try Again
          </Button>

          <Button asChild>
            <Link href="/">
              <Home className="mr-2 size-4" />
              Back Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default InternalErrorPage;
