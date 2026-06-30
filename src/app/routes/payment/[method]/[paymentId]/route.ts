import { ApiId } from "@/lib/api";
import { templatePaymentApi } from "@/lib/api/template-payment";
import { PaymentGatewayProvider } from "@/types/payment-gateway";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return NextResponse.json({
    status: true,
    message: "Product details fetched successfully",
    data: {
      id,
      name: "Keyboard",
      price: 5000,
    },
  });
}

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

    const res = await templatePaymentApi.verifyPayment(
      method,
      paymentId,
      "success",
      {
        val_id: body.val_id,
        tran_id: body.tran_id,
      },
    );

    console.log("verify", res);

    if (res?.paymentStatus === "PAID" && res?.gatewayPayload?.status === "VALID") {
      const successUrl = new URL("/payment/success", request.url);

      successUrl.searchParams.set("orderId", paymentId);
      successUrl.searchParams.set("paidAmount", res?.gatewayPayload?.amount);
      successUrl.searchParams.set("OrderId", res?.orderId);
      successUrl.searchParams.set("transactionReference", res.transactionReference);

      return NextResponse.redirect(successUrl, {
        status: 303,
      });
    }

    const failedUrl = new URL("/payment/failed", request.url);

    failedUrl.searchParams.set("orderId", paymentId);
    failedUrl.searchParams.set("method", method);

    return NextResponse.redirect(failedUrl, {
      status: 303,
    });
  } catch (error) {
    console.error("Payment callback error:", error);

    const failedUrl = new URL("/payment/failed", request.url);

    failedUrl.searchParams.set("reason", "invalid-payment-request");

    return NextResponse.redirect(failedUrl, {
      status: 303,
    });
  }
}