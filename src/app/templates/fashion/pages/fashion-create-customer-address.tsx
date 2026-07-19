"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import CustomerAddressForm, {
  CustomerAddressFormValues,
} from "@/app/templates/fashion/_components/customer-address-form";
import { useTemplateCustomerAddressMutation } from "@/lib/api/hooks/template-customer-address";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FashionCreateCustomerAddress = () => {
  const router = useRouter();
  const message = useMessage();

  const { createCustomerAddress } = useTemplateCustomerAddressMutation();

  const handleCreate = async (values: CustomerAddressFormValues) => {
    try {
      const res = await createCustomerAddress.mutateAsync(values);

      message.success("Address created successfully");
      router.push("/store/dashboard/customer-address");
    } catch (error) {
      message.error(getWebErrorMessage(error));
    }
  };

  return (
    <section className="min-h-screen bg-[var(--store-bg-3)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/store/dashboard/customer-address"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--store-muted,#6b7280)] transition hover:text-[var(--store-primary,#f16d59)]"
          >
            <ArrowLeft className="size-4" />
            Back to Profile
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="bg-[var(--store-primary,#f16d59)] px-6 py-8 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/20">
                <MapPin className="size-7" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Create Customer Address</h1>
                <p className="mt-1 text-sm text-white/80">
                  Add a new delivery address to your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <CustomerAddressForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => router.push("/store/dashboard/customer-address")}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FashionCreateCustomerAddress;
