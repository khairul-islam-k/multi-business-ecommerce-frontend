export type CustomerRegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};


export type CustomerAccount = {
  id: string;
  customerId: string;
  websiteId: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedBy: string | null;
  deletedAt: string | null;
};

export type Customer = {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  note: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CustomerAuthRegistrationResponse = {
  account: CustomerAccount;
  customer: Customer;
};

// Email verify

export type otpPayload = {
  email: string;
  otp: string;
}


// login 

export type LoginCustomerResponse = {
  accessToken: string;
  refreshToken: string;
  account: CustomerAccount;
  customer: Customer;
};

export type LoginPayload = {
  email: string;
  password: string;
}