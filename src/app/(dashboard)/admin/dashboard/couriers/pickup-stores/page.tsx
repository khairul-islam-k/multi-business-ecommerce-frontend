"use client";

import { Button, Card, Tabs } from "antd";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useCourierMutation,
  useCourierPickUp,
  useCourierQuery,
} from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { PickupStore } from "@/types/courier/courier";

const DeliveryZones = () => {
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: courier,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierQuery(businessId);

  const courierItems = courier?.items ?? [];

  const { data: pickUpStores } = useCourierPickUp(businessId, selectedConfigId);

  useEffect(() => {
    if (courierItems.length > 0 && !selectedConfigId) {
      setSelectedConfigId(courierItems[0].id);
    }
  }, [courierItems, selectedConfigId]);

  const { removePickUpStore } = useCourierMutation(businessId);

  // delete
  const handleDelete = (id: string) => {
    swal.confirm({
      title: "Delete pickup store?",
      content: "Are you sure you want to delete this pickup store?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      onConfirm: async () => {
        try {
          await removePickUpStore.mutateAsync({
            configId: selectedConfigId,
            storeId: id,
          });

          swal.success("Pickup store deleted successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const columns: Column<PickupStore>[] = [
    {
      key: "name",
      label: "Store Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "address",
      label: "Address",
      render: (row) => row.address || "-",
    },
    {
      key: "area_name",
      label: "Area Name",
      render: (row) => row.area_name || "-",
    },
    {
      key: "area_id",
      label: "Area ID",
      render: (row) => row.area_id,
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      key: "id",
      label: "Store ID",
      type: "meta",
      render: (row) => row.id,
    },
    // {
    //   key: "actions",
    //   label: "Actions",
    //   render: (row) => (
    //     <div className="flex items-center gap-2">
    //       <Tooltip title="Update pickup store">
    //         <Button
    //           size="small"
    //           icon={<Pencil size={16} />}
    //           onClick={() =>
    //             router.push(
    //               `/admin/dashboard/couriers/pickup-stores/update/${selectedConfigId}/store/${row.id}`,
    //             )
    //           }
    //         />
    //       </Tooltip>

    //       <Tooltip title="Delete pickup store">
    //         <Button danger
    //           onClick={() => handleDelete(row.id)}
    //           size="small"
    //           icon={<Trash2 size={16} />} />
    //       </Tooltip>
    //     </div>
    //   ),
    // },
  ];

  if (courierLoading || courierFetching) {
    return <section>Loading...</section>;
  }

  return (
    <section>
      <PageHeader
        title="Pickup Stores"
        subtitle="Manage courier pickup stores, addresses, contact numbers, and delivery area information."
        breadcrumb={adminBreadcrumb}
      />

      <Tabs
        onChange={(configId) => setSelectedConfigId(configId)}
        defaultActiveKey={courierItems[0].id}
        items={courierItems.map((item) => ({
          key: item.id,
          label: item.courier?.name,
          children: (
            <div>
              <Card>
                <DataTable
                  isSearch={false}
                  data={pickUpStores?.pickup_stores ?? []}
                  columns={columns}
                  loading={courierLoading || courierFetching}
                  toolbarEnd={
                    <div>
                      <Button
                        type="primary"
                        icon={<CirclePlus size={16} />}
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/couriers/pickup-stores/create/${selectedConfigId}`,
                          )
                        }
                      >
                        Create Pickup Store
                      </Button>
                    </div>
                  }
                />
              </Card>
            </div>
          ),
        }))}
      />
    </section>
  );
};

export default DeliveryZones;
