export type AttributeStatus = "ACTIVE" | "INACTIVE";

export type AttributeValuePayload = {
  value: string;
};

export type AttributePayload = {
  name: string;
  status: AttributeStatus;
  values: AttributeValuePayload[];
};


export type ResponseAttributeValue = {
  id: string;
  businessId: string;
  attributeId: string;
  value: string;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ResponseProductAttribute = {
  id: string;
  businessId: string;
  productId: string;

  name: string;
  status: AttributeStatus;

  values: ResponseAttributeValue[];

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AttributeUpdatePayload = {
  name: string;
  status: AttributeStatus;
};
