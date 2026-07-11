import { ApiId } from "@/lib/api";
import { PaymentGatewayProvider } from "@/types/payment-gateway";
import { NextRequest, NextResponse } from "next/server";

type PaymentRouteParams = {
  method: string;
  paymentId: string;
};

async function parseRequestBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await request.json();
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    return Object.fromEntries(new URLSearchParams(text));
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  const text = await request.text();

  return {
    raw: text,
  };
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<PaymentRouteParams> },
) {
  try {
    const { method, paymentId } = (await params) as {
      method: PaymentGatewayProvider;
      paymentId: ApiId;
    };

    const body = await parseRequestBody(request);



    if (body.status === 'CANCELLED') {
      const successUrl = new URL("/payment/cancel", request.url);

      successUrl.searchParams.set("orderId", paymentId);
      successUrl.searchParams.set("paidAmount", body.amount);
      successUrl.searchParams.set("OrderId", body.orderId);
      successUrl.searchParams.set("transactionReference", body.tran_id);

      return NextResponse.redirect(successUrl, {
        status: 303,
      });
    }

  } catch (error) {

    const failedUrl = new URL("/payment/failed", request.url);

    failedUrl.searchParams.set("reason", "invalid-payment-request");

    return NextResponse.redirect(failedUrl, {
      status: 303,
    });
  }
}