"use client";

import { Button, Card, Modal, Tabs, Tooltip } from "antd";
import { Building2, CirclePlus, Eye } from "lucide-react";
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
import { StoreItems } from "@/types/courier/courier";
import AssignWarehouse from "./_components/assign-warehouse";
import ShowAssignableWarehouse from "./_components/show-assignable-warehouse";

const DeliveryZones = () => {
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  // modal assign store
  const [open, setOpen] = useState<boolean>(false);
  const [warehouseOpen, setWarehouseOpen] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string>("");

  const {
    data: courier,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierQuery(businessId);

  const courierItems = courier?.items ?? [];

  // choose courier 
  const singleCourier = courierItems.find(courierData => courierData.id === selectedConfigId);

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

  const columns: Column<StoreItems>[] = [
    {
      key: "name",
      label: "Store Name",
      type: "primary",
      render: (row) => (
        <strong
          className="block max-w-[180px] truncate"
          title={row.store_name}
        >
          {row.store_name}
        </strong>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (row) => (
        <span
          className="block max-w-[250px] truncate"
          title={row.store_address}
        >
          {row.store_address || "-"}
        </span>
      ),
    },
    {
      key: "area_name",
      label: "Area Name",
      render: (row) => row.area_name || "-",
    },
    {
      key: "area_id",
      label: "Area ID",
      render: (row) => row.area_id ?? "-",
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
      render: (row) => row.store_id,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Assign Warehouse">
            <Button
              type='text'
              icon={<Building2 size={16} />}
              onClick={() => {
                setOpen(true)
                setStoreId(String(row.store_id))
              }}
            >
            </Button>
          </Tooltip>

          <Tooltip title="Show Assignable Warehouses">
            <Button
            onClick={() => {
                setWarehouseOpen(true)
                setStoreId(String(row.store_id))
              }}
            type='text'
             icon={<Eye size={16} />}>
            </Button>
          </Tooltip>
        </div>
      ),
    }
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
                  data={pickUpStores?.stores ?? []}
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

      <Modal
        title="Assign courier"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        footer={null}
        centered
      >
        <AssignWarehouse 
        selectedConfigId={selectedConfigId}
        storeId={storeId}
        setOpen={setOpen}
        />
      </Modal>

      <Modal
        title="Store Details"
        open={warehouseOpen}
        onCancel={() => setWarehouseOpen(false)}
        onOk={() => setWarehouseOpen(false)}
        centered
      >
        <ShowAssignableWarehouse
        singleCourier={singleCourier}
        storeId={storeId}
        />
      </Modal>
    </section>
  );
};

export default DeliveryZones;
