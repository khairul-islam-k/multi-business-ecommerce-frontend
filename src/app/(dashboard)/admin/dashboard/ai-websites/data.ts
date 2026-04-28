import type {
  AiWebsiteGenerationJob,
  GeneratedWebsiteResult,
  ChatMessage,
} from "./types";

export const mockGeneratedResult: GeneratedWebsiteResult = {
  website: {
    name: "Acme Corp",
    slug: "acme-corp",
    domain: "acme-corp.example.com",
    subdomain: "acme-corp",
    status: "draft",
  },
  pages: [
    {
      title: "Home",
      slug: "/",
      page_type: "landing",
      sections: [
        {
          section_type: "hero",
          section_key: "hero-main",
          sort_order: 0,
          config_json: {
            headline: "Build the Future with Acme",
            subheadline: "Enterprise solutions that scale with your business.",
            cta_label: "Get Started",
            cta_url: "/contact",
            background: "gradient",
          },
        },
        {
          section_type: "features",
          section_key: "features-grid",
          sort_order: 1,
          config_json: {
            title: "Why Choose Acme?",
            items: [
              {
                icon: "zap",
                title: "Lightning Fast",
                description: "Optimized for speed and performance.",
              },
              {
                icon: "shield",
                title: "Secure by Default",
                description: "Enterprise-grade security built in.",
              },
              {
                icon: "globe",
                title: "Global Scale",
                description: "Deploy to 200+ edge locations.",
              },
            ],
          },
        },
        {
          section_type: "testimonials",
          section_key: "testimonials-slider",
          sort_order: 2,
          config_json: {
            title: "Trusted by Industry Leaders",
            items: [
              {
                name: "Sarah Chen",
                role: "CTO, TechFlow",
                quote: "Acme transformed how we build products.",
              },
              {
                name: "Mark Rivera",
                role: "VP Eng, DataCore",
                quote: "The best platform we've ever used.",
              },
            ],
          },
        },
        {
          section_type: "cta",
          section_key: "cta-bottom",
          sort_order: 3,
          config_json: {
            headline: "Ready to get started?",
            cta_label: "Contact Sales",
            cta_url: "/contact",
          },
        },
      ],
    },
    {
      title: "About",
      slug: "/about",
      page_type: "content",
      sections: [
        {
          section_type: "hero",
          section_key: "about-hero",
          sort_order: 0,
          config_json: {
            headline: "About Acme Corp",
            subheadline: "We've been building the future since 2020.",
          },
        },
        {
          section_type: "text",
          section_key: "about-story",
          sort_order: 1,
          config_json: {
            title: "Our Story",
            body: "Founded with a mission to simplify enterprise software, Acme Corp has grown from a small startup to a global leader in cloud solutions.",
          },
        },
      ],
    },
    {
      title: "Contact",
      slug: "/contact",
      page_type: "contact",
      sections: [
        {
          section_type: "form",
          section_key: "contact-form",
          sort_order: 0,
          config_json: {
            title: "Get in Touch",
            fields: ["name", "email", "message"],
          },
        },
      ],
    },
  ],
  menus: [
    {
      name: "Main Navigation",
      location: "header",
      items: [
        { label: "Home", url: "/", sort_order: 0 },
        { label: "About", url: "/about", sort_order: 1 },
        { label: "Contact", url: "/contact", sort_order: 2 },
      ],
    },
    {
      name: "Footer Links",
      location: "footer",
      items: [
        { label: "Privacy Policy", url: "/privacy", sort_order: 0 },
        { label: "Terms", url: "/terms", sort_order: 1 },
      ],
    },
  ],
};

export const mockJob: AiWebsiteGenerationJob = {
  id: "job-001",
  tenant_id: "tenant-001",
  company_id: "company-001",
  prompt:
    "Create a modern SaaS website for Acme Corp with hero, features, testimonials and contact page",
  status: "completed",
  result_json: mockGeneratedResult,
  created_at: new Date().toISOString(),
};

export const mockChatHistory: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content:
      "Create a modern SaaS website for Acme Corp with hero, features, testimonials and contact page",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "I've generated a complete website for **Acme Corp** with 3 pages:\n\n- **Home** — Hero section, feature grid, testimonials, and CTA\n- **About** — Company story and mission\n- **Contact** — Contact form\n\nThe site includes a header navigation and footer links. You can preview it now or customize the layout.",
    timestamp: new Date(Date.now() - 30000).toISOString(),
    job: mockJob,
  },
];
