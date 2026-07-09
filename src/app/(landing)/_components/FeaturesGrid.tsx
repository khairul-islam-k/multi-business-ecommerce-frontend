import {
  Store,
  Palette,
  Sparkles,
  Globe,
  Smartphone,
  QrCode,
  Wand2,
  Package,
  ListTree,
  Layers,
  FileSpreadsheet,
  ShoppingBag,
  FileText,
  Truck,
  Wallet,
  CreditCard,
  Tags,
  Boxes,
  BellRing,
  TrendingUp,
  Banknote,
  PackageCheck,
  ShoppingCart,
  Share2,
  CalendarClock,
  Mail,
  MessageSquare,
  Megaphone,
  Rocket,
  Globe2,
  Bot,
  Brain,
  Clock,
  MessagesSquare,
  MousePointerClick,
  MessageCircle,
  Star,
  UserCog,
  LifeBuoy,
  BarChart3,
  Users,
  Activity,
  LineChart,
  ShieldCheck,
  Lock,
  ShieldAlert,
  ServerCog,
  Zap,
  UsersRound,
  Calculator,
  FileEdit,
  GraduationCap,
} from "lucide-react";

type Feature = { icon: any; label: string };
type Group = { num: string; title: string; desc: string; features: Feature[] };

const groups: Group[] = [
  {
    num: "01",
    title: "Store Setup & Design",
    desc: "Launch a stunning storefront in minutes — no code required.",
    features: [
      { icon: Store, label: "One-Click Store Setup" },
      { icon: Palette, label: "Customizable Theme Templates" },
      { icon: Sparkles, label: "Dynamic Design & Themes" },
      { icon: Globe, label: "Custom Domain Integration" },
      { icon: Smartphone, label: "Mobile-Friendly UI/UX" },
      { icon: QrCode, label: "Website QR Code" },
      { icon: Wand2, label: "Easy Setup & Customization" },
    ],
  },
  {
    num: "02",
    title: "Product & Catalog Management",
    desc: "Organize, list, and manage thousands of SKUs effortlessly.",
    features: [
      { icon: Package, label: "Advanced Product Management" },
      { icon: ListTree, label: "Easy Product Listing & Variations" },
      { icon: Layers, label: "Multi-layer Category Management" },
      { icon: FileSpreadsheet, label: "Product Import & Export" },
    ],
  },
  {
    num: "03",
    title: "Order & Operations Management",
    desc: "Run your fulfillment pipeline from a single command center.",
    features: [
      { icon: ShoppingBag, label: "Simplified Order Management" },
      { icon: FileText, label: "Automatic Invoice Generation" },
      { icon: Truck, label: "User Order Tracking" },
      { icon: Wallet, label: "Advanced Delivery Charge Setup" },
      { icon: CreditCard, label: "Advanced Delivery Charge Payment" },
      { icon: Tags, label: "Retail & Wholesale Management" },
    ],
  },
  {
    num: "04",
    title: "Inventory & Stock Control",
    desc: "Always know what's selling, what's slow, and what's running out.",
    features: [
      { icon: Boxes, label: "Advanced Stock Management" },
      { icon: BellRing, label: "Low-stock Alerts & Reports" },
      { icon: TrendingUp, label: "Best-selling & Slow-moving Insights" },
    ],
  },
  {
    num: "05",
    title: "Payment & Logistics Integration",
    desc: "Plug into the gateways and couriers your customers already trust.",
    features: [
      { icon: Banknote, label: "Payment Gateways (SSLCommerz, bKash, Nagad)" },
      { icon: PackageCheck, label: "Courier Integration (Pathao, Steadfast)" },
      { icon: ShoppingCart, label: "Seamless Checkout Experience" },
    ],
  },
  {
    num: "06",
    title: "Marketing & Growth Tools",
    desc: "Acquire, convert, and retain customers across every channel.",
    features: [
      { icon: Share2, label: "Social Media Management" },
      { icon: CalendarClock, label: "Social Media Post Scheduling" },
      { icon: Mail, label: "Email Marketing Campaigns" },
      { icon: MessageSquare, label: "SMS Marketing Campaigns" },
      { icon: Megaphone, label: "Engaging Offer Management" },
      { icon: Rocket, label: "Sales Boosting Toolkit" },
      { icon: Globe2, label: "Global Sales Expansion" },
    ],
  },
  {
    num: "07",
    title: "AI-Powered Business Inbox",
    desc: "Reply 24/7 with an inbox that thinks like your best agent.",
    features: [
      { icon: Bot, label: "AI Chat Automation (FB, IG, WhatsApp)" },
      { icon: Brain, label: "Trained on Your Business Data" },
      { icon: Clock, label: "Instant Replies 24/7" },
      { icon: MessagesSquare, label: "Human-like Conversations" },
      { icon: MousePointerClick, label: "No-code Setup" },
    ],
  },
  {
    num: "08",
    title: "Customer Engagement & Support",
    desc: "Build loyalty with chat, reviews, and a polished customer panel.",
    features: [
      { icon: MessageCircle, label: "Live Chat (Messenger, WhatsApp, Custom)" },
      { icon: Star, label: "Smart Review Management" },
      { icon: UserCog, label: "Full Customer Control Panel" },
      { icon: LifeBuoy, label: "24/7 Customer Support" },
    ],
  },
  {
    num: "09",
    title: "Analytics & Tracking",
    desc: "Measure every click, conversion, and campaign with confidence.",
    features: [
      { icon: BarChart3, label: "Advanced Analytics Dashboard" },
      { icon: Users, label: "User & Visitor Tracking" },
      { icon: Activity, label: "Facebook Pixel & Conversion API" },
      { icon: LineChart, label: "Multi-analytics (Google, FB, Microsoft)" },
    ],
  },
  {
    num: "10",
    title: "Security & Performance",
    desc: "Enterprise-grade security on infrastructure built for speed.",
    features: [
      { icon: ShieldCheck, label: "Secure SSL Certification" },
      { icon: Lock, label: "Strong Security & Privacy Protection" },
      { icon: ShieldAlert, label: "Smart Fake Order Protection" },
      { icon: ServerCog, label: "Highly Secure & Scalable Infrastructure" },
      { icon: Zap, label: "Ultra-fast Hosting (0.5s Load Time)" },
    ],
  },
  {
    num: "11",
    title: "Team & Access Control",
    desc: "Bring your team in with the right permissions, every time.",
    features: [
      { icon: UsersRound, label: "Multi-Admin Access & Role Management" },
    ],
  },
  {
    num: "12",
    title: "Business Management Tools",
    desc: "Handle finances and content pages from one tidy dashboard.",
    features: [
      { icon: Calculator, label: "Basic Account Management (Finance)" },
      { icon: FileEdit, label: "Additional Page Management" },
    ],
  },
  {
    num: "13",
    title: "Learning & Support System",
    desc: "Master every feature with bite-sized, on-demand video lessons.",
    features: [
      {
        icon: GraduationCap,
        label: "Step-by-step Video Guides for Every Feature",
      },
    ],
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <article
              key={g.num}
              className="group relative rounded-3xl border border-border bg-card p-7 shadow-card hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Ambient hover glow */}
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header */}
              <div className="relative flex items-start justify-between">
                <span className="font-mono text-[11px] tabular-nums font-bold tracking-widest text-primary">
                  {g.num} / 13
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {g.features.length} feature{g.features.length > 1 ? "s" : ""}
                </span>
              </div>

              <h2 className="relative mt-4 font-display text-xl font-extrabold tracking-tight leading-tight">
                {g.title}
              </h2>
              <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed min-h-[2.75rem]">
                {g.desc}
              </p>

              {/* Divider */}
              <div className="relative my-5 h-px bg-border" />

              {/* Feature list */}
              <ul className="relative space-y-2.5">
                {g.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                      <f.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-medium leading-tight pt-1">
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
