import { ApiId } from "@/lib/api";
import { templatePaymentApi } from "@/lib/api/template-payment";
import { PaymentGatewayProvider } from "@/types/payment-gateway";
import { NextRequest, NextResponse } from "next/server";

type PaymentRouteParams = {
  method: string;
  paymentId: string;
};

const getRequestBaseUrl = (request: NextRequest): string => {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host");

  const protocol =
    request.headers.get("x-forwarded-proto") ??
    "http";

  if (!host) {
    throw new Error("Request host is missing");
  }

  return `${protocol}://${host}`;
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


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<PaymentRouteParams> },
) {
  try {
    const { method, paymentId } = (await params) as {
      method: PaymentGatewayProvider;
      paymentId: ApiId;
    };

    const searchParams = request.nextUrl.searchParams;

    const queryBody = Object.fromEntries(searchParams.entries());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: any;

    if (method === "SHURJOPAY") {
      res = await templatePaymentApi.verifyPayment(
        method,
        paymentId,
        "success",
        {
          order_id: queryBody.order_id,
          // sp_order_id: queryBody.sp_order_id,
          // bank_trx_id: queryBody.bank_trx_id,
          // customer_order_id: queryBody.customer_order_id,
        },
      );
    }

    const verifyData = res?.data ?? res;

    const isPaid = verifyData?.paymentStatus === "PAID";

    const isShurjoPaySuccess =
      method === "SHURJOPAY" &&
      (verifyData?.gatewayPayload?.sp_message === "Success" ||
        verifyData?.gatewayPayload?.message === "Success" ||
        verifyData?.gatewayPayload?.status === "VALID" ||
        verifyData?.paymentStatus === "PAID");

        const baseUrl = getRequestBaseUrl(request);

    if (isPaid && isShurjoPaySuccess) {
      const successUrl = new URL("/payment/success", baseUrl);


      console.log('success', successUrl);
      successUrl.searchParams.set("orderId", paymentId);
      successUrl.searchParams.set("OrderId", verifyData?.orderId ?? "");
      successUrl.searchParams.set(
        "paidAmount",
        String(
          verifyData?.gatewayPayload?.amount ??
          verifyData?.gatewayPayload?.payable_amount ??
          verifyData?.amount ??
          "",
        ),
      );
      successUrl.searchParams.set(
        "transactionReference",
        String(
          verifyData?.transactionReference ??
          verifyData?.gatewayPayload?.bank_trx_id ??
          verifyData?.gatewayPayload?.sp_order_id ??
          "",
        ),
      );
      successUrl.searchParams.set("method", method);

      return NextResponse.redirect(successUrl, {
        status: 303,
      });
    }

    const failedUrl = new URL("/payment/failed", baseUrl);

    failedUrl.searchParams.set("orderId", paymentId);
    failedUrl.searchParams.set("method", method);
    failedUrl.searchParams.set("reason", "payment-not-verified");

    return NextResponse.redirect(failedUrl, {
      status: 303,
    });
  } catch (error) {
    console.error("SHURJOPAY GET callback error:", error);

    const failedUrl = new URL("/payment/failed", request.url);

    failedUrl.searchParams.set("reason", "invalid-shurjopay-request");

    return NextResponse.redirect(failedUrl, {
      status: 303,
    });
  }
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<PaymentRouteParams> },
) {
  console.log('requ', request);
  try {
    const { method, paymentId } = (await params) as {
      method: PaymentGatewayProvider;
      paymentId: ApiId;
    };

    const body = await parseRequestBody(request);

    // console.log("payment callback method:", method);
    // console.log("payment callback paymentId:", paymentId);
    // console.log("payment callback body:", body);

    let verifyPayload: Record<string, unknown> = {};

    if (method === "SSLCOMMERZ") {
      verifyPayload = {
        val_id: body.val_id,
        tran_id: body.tran_id,
      };
    }

    if (method === "AAMARPAY") {
      verifyPayload = {
        mer_txnid: body.mer_txnid,
      };
    }

    const verifyResponse = await templatePaymentApi.verifyPayment(
      method,
      paymentId,
      "success",
      verifyPayload,
    );

    /**
     * If your API function returns axios response, data will be inside .data.
     * If your API function already returns data, this still works.
     */
    const res = verifyResponse?.data ?? verifyResponse;

    // console.log("verify response:", res);

    const isPaid = res?.paymentStatus === "PAID";

    const isSSLCommerzSuccess =
      method === "SSLCOMMERZ" && res?.gatewayPayload?.status === "VALID";

    const isAamarPaySuccess =
      method === "AAMARPAY" &&
      (res?.gatewayPayload?.pay_status === "Successful" ||
        res?.gatewayPayload?.status === "VALID" ||
        res?.paymentStatus === "PAID");

        const baseUrl = getRequestBaseUrl(request);

    if (
      isPaid &&
      (isSSLCommerzSuccess || isAamarPaySuccess)
    ) {
      const successUrl = new URL("/payment/success", baseUrl);

      console.log('success', successUrl, request.url);

      successUrl.searchParams.set("orderId", paymentId);
      successUrl.searchParams.set("OrderId", res?.orderId ?? "");
      successUrl.searchParams.set(
        "paidAmount",
        String(res?.gatewayPayload?.amount ?? res?.amount ?? ""),
      );
      successUrl.searchParams.set(
        "transactionReference",
        String(res?.transactionReference ?? ""),
      );
      successUrl.searchParams.set("method", method);

      return NextResponse.redirect(successUrl, {
        status: 303,
      });
    }

    const failedUrl = new URL("/payment/failed", baseUrl);

    failedUrl.searchParams.set("orderId", paymentId);
    failedUrl.searchParams.set("method", method);
    failedUrl.searchParams.set("reason", "payment-not-verified");

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
