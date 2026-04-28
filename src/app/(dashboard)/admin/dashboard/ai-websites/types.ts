export interface Website {
  id: string;
  tenant_id: string;
  company_id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain: string;
  template_id: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  preview_image: string;
  description: string;
  status: "active" | "inactive";
}

export interface WebsitePage {
  id: string;
  website_id: string;
  page_type: string;
  title: string;
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
}

export interface WebsiteSection {
  id: string;
  website_page_id: string;
  section_type: string;
  section_key: string;
  sort_order: number;
  config_json: Record<string, unknown>;
}

export interface WebsiteMenu {
  id: string;
  website_id: string;
  name: string;
  location: "header" | "footer" | "sidebar";
  status: "active" | "inactive";
}

export interface WebsiteMenuItem {
  id: string;
  website_menu_id: string;
  parent_id: string | null;
  label: string;
  url: string;
  sort_order: number;
}

export interface Domain {
  id: string;
  website_id: string;
  domain: string;
  dns_status: "pending" | "active" | "failed";
  ssl_status: "pending" | "active" | "failed";
  is_primary: boolean;
}

export interface AiWebsiteGenerationJob {
  id: string;
  tenant_id: string;
  company_id: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  result_json: GeneratedWebsiteResult | null;
  created_at: string;
}

export interface GeneratedWebsiteResult {
  website: Partial<Website>;
  pages: GeneratedPage[];
  menus: GeneratedMenu[];
}

export interface GeneratedPage {
  title: string;
  slug: string;
  page_type: string;
  sections: GeneratedSection[];
}

export interface GeneratedSection {
  section_type: string;
  section_key: string;
  sort_order: number;
  config_json: Record<string, unknown>;
}

export interface GeneratedMenu {
  name: string;
  location: "header" | "footer";
  items: { label: string; url: string; sort_order: number }[];
}

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  job?: AiWebsiteGenerationJob;
};

export type PreviewDevice = "desktop" | "tablet" | "mobile";
