export type WarehouseStatus = "ACTIVE" | "INACTIVE";

export type WarehousePayload = {
  name: string;
  phone?: string;
  address?: string;

  redxAreaId?: string;
  redxAreaName?: string;
  redxPostCode?: string;
  redxPickupStoreId?: string;

  status?: WarehouseStatus;
};

export type WarehouseResponse = {
  id: string;
  businessId: string;

  name: string;
  phone: string;
  address: string;
  status: WarehouseStatus;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  createdBy: string;
  updatedBy: string;

  _count: {
    stocks: number;
    movements: number;
  };
};