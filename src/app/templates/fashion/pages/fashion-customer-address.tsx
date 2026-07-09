"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import { useCustomerAddressList, useTemplateCustomerAddressMutation } from "@/lib/api/hooks/template-customer-address";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { Edit, MapPin, MapPinPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

type CustomerAddressType = "HOME" | "OFFICE" | "SHIPPING" | "BILLING" | "OTHER";

type CustomerAddress = {
  id: string;
  customerId: string;
  addressType: CustomerAddressType;
  name: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedBy: string | null;
  deletedAt: string | null;
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const FashionCustomerAddress = () => {
  const { data: addresses, isLoading } = useCustomerAddressList();

  const { removeCustomerAddress } = useTemplateCustomerAddressMutation();

  const message = useMessage();

  const customerAddresses = (addresses ?? []) as CustomerAddress[];

  const handleDelete = (id: string) => {
    message.confirm({
      title: "Delete address?",
      content: "Are you sure you want to delete this customer address?",
      okText: "Delete",
      cancelText: "Cancel",
      danger: true,

      onConfirm: async () => {
        try {
          // API call here
          await removeCustomerAddress.mutateAsync(id);

          message.success("Address deleted successfully");
        } catch (error) {
          message.error(getWebErrorMessage(error));
        }
      },
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[var(--store-card,#ffffff)] p-10 text-center shadow-sm">
          <p className="text-[var(--store-muted,#6b7280)]">
            Address is loading...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--store-text,#111827)]">
              Customer Addresses
            </h1>

            <p className="mt-2 text-sm text-[var(--store-muted,#6b7280)]">
              Manage your shipping and billing addresses.
            </p>
          </div>

          <Link
            href="/store/dashboard/customer-address/create-customer-address"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <MapPinPlus className="size-5" />
            Create Customer Address
          </Link>
        </div>

        {customerAddresses.length === 0 ? (
          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[var(--store-text,#111827)]">
              No address found
            </h2>

            <p className="mt-2 text-sm text-[var(--store-muted,#6b7280)]">
              Please create your first customer address.
            </p>

            <Link
              href="/store/dashboard/customer-address/create-customer-address"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <MapPinPlus className="size-5" />
              Create Address
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
              {customerAddresses.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                        <MapPin className="size-5" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[var(--store-text,#111827)]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                          Created: {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {item.isDefault ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Default
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--store-muted,#6b7280)]">
                        Type
                      </p>

                      <span className="mt-1 inline-flex rounded-full bg-[var(--store-primary,#f16d59)]/10 px-3 py-1 text-xs font-bold text-[var(--store-primary,#f16d59)]">
                        {item.addressType}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--store-muted,#6b7280)]">
                        Address
                      </p>

                      <p className="mt-1 text-sm font-medium text-[var(--store-text,#111827)]">
                        {item.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase text-[var(--store-muted,#6b7280)]">
                          City
                        </p>

                        <p className="mt-1 text-sm font-medium text-[var(--store-text,#111827)]">
                          {item.city}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase text-[var(--store-muted,#6b7280)]">
                          Country
                        </p>

                        <p className="mt-1 text-sm font-medium text-[var(--store-text,#111827)]">
                          {item.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3 border-t border-[var(--store-border,#e5e7eb)] pt-4">
                    <Link
                      href={`/store/dashboard/customer-address/update/${item.id}`}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-blue-50 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      <Edit className="size-4" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-red-50 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)] text-left">
                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        Name
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        Type
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        Address
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        City
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        Country
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        Default
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[var(--store-text,#111827)]">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--store-text,#111827)]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {customerAddresses.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[var(--store-border,#e5e7eb)] last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-[var(--store-text,#111827)]">
                            {item.name}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[var(--store-primary,#f16d59)]/10 px-3 py-1 text-xs font-bold text-[var(--store-primary,#f16d59)]">
                            {item.addressType}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="max-w-xs text-sm text-[var(--store-muted,#6b7280)]">
                            {item.address}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[var(--store-text,#111827)]">
                          {item.city}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[var(--store-text,#111827)]">
                          {item.country}
                        </td>

                        <td className="px-6 py-5">
                          {item.isDefault ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Default
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                              No
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-[var(--store-muted,#6b7280)]">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/store/dashboard/customer-address/update/${item.id}`}
                              className="grid size-9 place-items-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                            >
                              <Edit className="size-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="grid size-9 place-items-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FashionCustomerAddress;