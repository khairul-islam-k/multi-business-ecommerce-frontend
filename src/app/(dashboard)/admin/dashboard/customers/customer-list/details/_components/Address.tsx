"use client";

import { Button, Card, Modal, Tag, Tooltip } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import { useSwal } from "@/hooks/use-swal";
import { useCustomerAddressMutation } from "@/lib/api/hooks/customer-address";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { CustomerAddressResponse } from "@/types/customer/customerAddress";

import UpdateAddress from "./update-address";

type Props = {
  address: CustomerAddressResponse[];
  customerId: string;
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const Address = ({ address, customerId }: Props) => {
  const [search, setSearch] = useState("");
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const swal = useSwal();

  const { removeAddress } = useCustomerAddressMutation(businessId);

  // modal
  const [singleAddress, setSingleAddress] = useState<CustomerAddressResponse>({
    id: "",
    customerId: "",
    addressType: "HOME",
    name: "",
    address: "",
    city: "",
    country: "",
    isDefault: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleDeleteAddress = (addressId: string) => {
    swal.modal.confirm({
      title: "Delete address?",
      content: "Are you sure you want to delete this customer address?",
      okText: "Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeAddress.mutateAsync({
            customerId,
            addressId,
          });
          swal.success("Address deleted successfully");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const addressColumns: Column<CustomerAddressResponse>[] = [
    {
      key: "addressType",
      label: "Type",
      type: "meta",
      render: (row) => <Tag>{row.addressType}</Tag>,
    },
    {
      key: "name",
      label: "Name",
      type: "primary",
      render: (row) => <strong>{row.name ?? "-"}</strong>,
    },
    {
      key: "address",
      label: "Address",
      render: (row) => row.address ?? "-",
    },
    {
      key: "city",
      label: "City",
      render: (row) => row.city ?? "-",
    },
    {
      key: "country",
      label: "Country",
      render: (row) => row.country ?? "-",
    },
    {
      key: "isDefault",
      label: "Default",
      type: "meta",
      render: (row) =>
        row.isDefault ? <Tag color="green">Default</Tag> : <Tag>Normal</Tag>,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit address">
            <Button
              size="small"
              icon={<Pencil />}
              onClick={() => {
                setSingleAddress(row);
                setOpenModal(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Delete address">
            <Button
              danger
              size="small"
              icon={<Trash2 />}
              onClick={() => handleDeleteAddress(row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card title="Customer Address">
      <DataTable
        data={address}
        columns={addressColumns}
        onSearch={(value) => {
          setSearch(value);
        }}
      />

      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        <UpdateAddress customerId={customerId} singleAddress={singleAddress} />
      </Modal>
    </Card>
  );
};

export default Address;
