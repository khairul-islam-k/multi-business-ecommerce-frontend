
export type WebsiteStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "ARCHIVED";

export type WebsiteTemplate =
  | "ELECTRONIC"
  | "FASHION";

export type WebsiteTemplateOption = {
  key: WebsiteTemplate;
  name: string;
};

export type HeaderSlide = {
  id?: number;
  title?: string;
  imageUrl?: string;
  subTitle?: string;
  buttonText?: string;
  description?: string;
};

export type HeaderConfig = {
  slide?: HeaderSlide[];
};

export type FooterConfig = {
  title?: string;
  email?: string;
  phone?: string;
  copyrightText?: string;
  description?: string;
  address?: string;
};

export type BestOfferImage = {
  id?: number;
  imageUrl?: string;
  size?: "large" | "small";
};

export type GeneralConfig = {
  bestOfferImages?: BestOfferImage[];
  partners?: string[];
};

export type ThemeConfig = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
};

export type SeoConfig = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
};

export type WebsiteTemplatePayload = {
  template: WebsiteTemplate;
  status: WebsiteStatus;

  config?: {
    headerConfig?: HeaderConfig;
    footerConfig?: FooterConfig;
    generalConfig?: GeneralConfig;
  };

  theme?: ThemeConfig;
  seo?: SeoConfig;
};

// resolve response
export type WebsiteTemplateResolve = WebsiteTemplatePayload & {
  name: string;
}

export type JsonObject = Record<string, unknown>;


export type NavigationConfig = JsonObject;
export type SectionConfig = JsonObject;

export type ResponseWebsiteConfig = {
  id: string;
  websiteId: string;

  headerConfig?: HeaderConfig;
  footerConfig?: FooterConfig;
  navigationConfig?: NavigationConfig;
  sectionConfig?: SectionConfig;
  generalConfig?: GeneralConfig;

  createdAt?: string;
  updatedAt?: string;
};

export type ResponseWebsiteTheme = {
  id: string;
  websiteId: string;

  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type ResponseWebsiteSeo = {
  id: string;
  websiteId: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type ResponseBusiness = {
  id: string;
  ownerUserId?: string;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ResponseWebsiteVersion = {
  id: string;
  websiteId: string;
  versionNo: number;
  snapshotData?: JsonObject;
  publishedBy?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ResponseWebsiteDomain = {
  id?: string;
  websiteId?: string;
  domain?: string;
  subdomain?: string | null;
  domainType?: WebsiteDomainType;
  isPrimary?: boolean;
  verificationStatus?: WebsiteDomainVerificationStatus;
  sslStatus?: WebsiteDomainSslStatus;
  verifiedAt?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ResponseWebsite = {
  id: string;
  businessId: string;

  name: string;
  slug: string;
  template: WebsiteTemplate;
  status: WebsiteStatus;

  currentVersionId?: string | null;

  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  business?: ResponseBusiness;
  config?: ResponseWebsiteConfig;
  theme?: ResponseWebsiteTheme;
  seo?: ResponseWebsiteSeo;
  currentVersion?: ResponseWebsiteVersion | null;
  domains?: ResponseWebsiteDomain[];
};

// website domain
export type WebsiteDomainType =
  | "SUBDOMAIN"
  | "CUSTOM_DOMAIN";
export type WebsiteDomainVerificationStatus = "PENDING" | "VERIFIED" | "FAILED";
export type WebsiteDomainSslStatus = "PENDING" | "ACTIVE" | "FAILED";

export type WebsiteDomainFormValues = {
  domainType: WebsiteDomainType;
  domain?: string;
  subdomain?: string;
  isPrimary: boolean;
  verificationStatus: WebsiteDomainVerificationStatus;
  sslStatus: WebsiteDomainSslStatus;
};
