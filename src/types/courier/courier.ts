export type ApiId = string;

export type CourierProviderCode = "REDX";

export type CourierMode = "LIVE" | "SANDBOX";

export type CourierStatus = "ACTIVE" | "INACTIVE";

export type CourierConfigData = Record<string, string>;

export type CourierProvider = {
  id: ApiId;
  name: string;
  code: CourierProviderCode;
  description: string;
  status: CourierStatus;
  createdAt: string;
  updatedAt: string;
};

export type CourierConfigResponse = {
  id: ApiId;
  businessId: ApiId;
  courierId: ApiId;

  configData: CourierConfigData;

  mode: CourierMode;
  status: CourierStatus;

  createdBy: ApiId | null;
  updatedBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  courier: CourierProvider;

  webhookConfigured: boolean;
  webhookUrlHint: string;
};

// update bulk
export type UpdateCourierConfigPayload = {
  configs: {
    configData: CourierConfigData;
    mode: CourierMode;
    status: CourierStatus;
    rotateWebhookToken: boolean;
    configId: ApiId;
  }[];
};

// Areas courier
export type CourierAreaResponse = {
  areas: {
    id: number;
    name: string;
    post_code: number;
    district_name: string;
    division_name: string;
    zone_id: number;
  }[]
};


// pick up store
export type PickupStore = {
  id: number;
  name: string;
  address: string;
  area_name: string;
  area_id: number;
  phone: string;
};

export type PickupStoresResponse = {
  pickup_stores: PickupStore[];
};


export type PickupStorePayload = {
  name: string;
  phone: string;
  address: string;
  areaId: string;
};