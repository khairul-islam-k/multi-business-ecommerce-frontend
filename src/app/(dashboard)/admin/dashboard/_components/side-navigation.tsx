import {
  ArrowLeftRight,
  ArrowUp,
  Award,
  BadgeInfo,
  Banknote,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Building,
  Building2,
  Calculator,
  Calendar,
  CalendarClock,
  ChartBar,
  ChartLine,
  CircleDollarSign,
  CircleHelp,
  CirclePlus,
  ClipboardList,
  CloudUpload,
  Copy,
  ContactRound,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  Grid2X2Plus,
  HandCoins,
  Handshake,
  History,
  Home,
  Image as ImageIcon,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  Link as LinkIcon,
  List,
  ListOrdered,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Network,
  Package as PackageIcon,
  PackageCheck,
  PackageSearch,
  Palette,
  Pencil,
  RefreshCw,
  RotateCcw,
  Scale,
  Send,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  SquarePlus,
  Store,
  Tags as TagsIcon,
  TrendingUp,
  TriangleAlert,
  Truck,
  Undo2,
  CircleUserRound,
  UserRound,
  Users,
  WalletCards,
  Warehouse,
  FolderTree,
  Wrench,
  Zap
} from "lucide-react";
import Link from "next/link";


import type { MenuProps } from "antd";

const allItems: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <Gauge />,
    label: <Link href="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "pos",
    icon: <ShoppingCart />,
    label: <Link href="/admin/dashboard/pos">POS</Link>,
  },

  {
    key: "media",
    icon: <ImageIcon />,
    label: <Link href="/admin/dashboard/media">Media Library</Link>,
  },

  {
    key: "access-control",
    icon: <Shield />,
    label: "Employees & Roles",
    children: [
      {
        key: "employees",
        icon: <UserRound />,
        label: (
          <Link href="/admin/dashboard/access-control/employees">
            Employees
          </Link>
        ),
      },
      {
        key: "roles",
        icon: <Users />,
        label: <Link href="/admin/dashboard/access-control/roles">Roles</Link>,
      },
      {
        key: "permissions",
        icon: <KeyRound />,
        label: (
          <Link href="/admin/dashboard/access-control/permissions">
            Permissions
          </Link>
        ),
      },
    ],
  },

  {
    key: "product-catalog",
    icon: <ShoppingBag />,
    label: "Product",
    children: [
      {
        key: "categories",
        icon: <Grid2X2Plus />,
        label: (
          <Link href="/admin/dashboard/product-catalog/categories">
            Categories
          </Link>
        ),
      },
      {
        key: "brands",
        icon: <BadgeInfo />,
        label: (
          <Link href="/admin/dashboard/product-catalog/brands">Brands</Link>
        ),
      },
      {
        key: "units",
        icon: <Network />,
        label: <Link href="/admin/dashboard/product-catalog/units">Units</Link>,
      },
      {
        key: "tags",
        icon: <TagsIcon />,
        label: <Link href="/admin/dashboard/product-catalog/tags">Tags</Link>,
      },
      {
        key: "attributes",
        icon: <SlidersHorizontal />,
        label: (
          <Link href="/admin/dashboard/product-catalog/attributes">
            Attributes
          </Link>
        ),
      },
      {
        key: "products",
        icon: <PackageIcon />,
        label: (
          <Link href="/admin/dashboard/product-catalog/products">Products</Link>
        ),
      },
      {
        key: "variant",
        icon: <GitBranch />,
        label: (
          <Link href="/admin/dashboard/product-catalog/variant">
            Variant Manager
          </Link>
        ),
      },
      {
        key: "reviews",
        icon: <MessageCircle />,
        label: (
          <Link href="/admin/dashboard/product-catalog/reviews">Reviews</Link>
        ),
      },
    ],
  },

  {
    key: "inventory",
    icon: <Store />,
    label: "Inventory",
    children: [
      {
        key: "stock-overview",
        icon: <Boxes />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-overview">
            Stock Overview
          </Link>
        ),
      },
      {
        key: "warehouses",
        icon: <Warehouse />,
        label: (
          <Link href="/admin/dashboard/inventory/warehouses">Warehouses</Link>
        ),
      },
      // {
      //   key: "warehouse-stocks",
      //   icon: <Home />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/warehouse-stock">
      //       Warehouse Stocks
      //     </Link>
      //   ),
      // },
      {
        key: "inventory-transactions",
        icon: <ArrowLeftRight />,
        label: (
          <Link href="/admin/dashboard/inventory/transactions">
            Inventory Movements
          </Link>
        ),
      },
      // {
      //   key: "stock-entry",
      //   icon: <SquarePlus />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/stock-entry">Stock Entry</Link>
      //   ),
      // },
      {
        key: "stock-adjustments",
        icon: <Scale />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-adjustments">
            Stock Adjustments
          </Link>
        ),
      },
      {
        key: "stock-transfers",
        icon: <ExternalLink />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-transfers">
            Stock Transfers
          </Link>
        ),
      },
      // {
      //   key: "damaged-product",
      //   icon: <TriangleAlert />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/damaged-products">
      //       Damaged Products
      //     </Link>
      //   ),
      // },
      // {
      //   key: "low-stock",
      //   icon: <TriangleAlert />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/low-stock-alert">
      //       Low Stocks
      //     </Link>
      //   ),
      // },
      // {
      //   key: "inventory-value",
      //   icon: <Banknote />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/value-report">
      //       Inventory Value
      //     </Link>
      //   ),
      // },
      // {
      //   key: "missing-products",
      //   icon: <CircleHelp />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/missing-products">
      //       Missing Products
      //     </Link>
      //   ),
      // },
    ],
  },

  {
    key: "suppliers-procurement",
    icon: <Handshake />,
    label: "Suppliers Procurement",
    children: [
      {
        key: "supplier",
        icon: <Building />,
        label: <Link href="/admin/dashboard/suppliers/supplier">Supplier</Link>,
      },
      {
        key: "supplier-products",
        icon: <PackageSearch />,
        label: (
          <Link href="/admin/dashboard/suppliers/supplier-products">
            Supplier Products
          </Link>
        ),
      },
      {
        key: "purchase-order",
        icon: <FileCheck />,
        label: (
          <Link href="/admin/dashboard/suppliers/purchase-order">
            Purchase Orders
          </Link>
        ),
      },
      {
        key: "purchase-returns",
        icon: <Undo2 />,
        label: <Link href="/admin/dashboard/suppliers/returns">Returns</Link>,
      },
      {
        key: "supplier-invoices",
        icon: <FileText />,
        label: (
          <Link href="/admin/dashboard/suppliers/invoices">
            Supplier Invoices
          </Link>
        ),
      },
      // {
      //   key: "supplier-payment",
      //   icon: <Banknote />,
      //   label: <Link href="/admin/dashboard/suppliers/payments">Payments</Link>,
      // },
      // {
      //   key: "supplier-performance",
      //   icon: <ChartBar />,
      //   label: (
      //     <Link href="/admin/dashboard/suppliers/performance">Performance</Link>
      //   ),
      // },
    ],
  },

  {
    key: "orders",
    icon: <ClipboardList />,
    label: "Orders",
    children: [
      {
        key: "all-orders",
        icon: <ListOrdered />,
        label: <Link href="/admin/dashboard/orders">All Orders</Link>,
      },
      {
        key: "order-returns",
        icon: <RotateCcw />,
        label: (
          <Link href="/admin/dashboard/orders/returns">Order Returns</Link>
        ),
      },
    ],
  },

  {
    key: "customers",
    icon: <ContactRound />, // Customers module
    label: "Customers",
    children: [
      {
        key: "customer-list",
        icon: <CircleUserRound />, // Individual customers
        label: (
          <Link href="/admin/dashboard/customers/customer-list">
            Customer List
          </Link>
        ),
      },
      // {
      //   key: "order-history",
      //   icon: <ShoppingCart />, // Orders
      //   label: (
      //     <Link href="/admin/dashboard/customers/order-history">
      //       Order History
      //     </Link>
      //   ),
      // },
      // {
      //   key: "address-book",
      //   icon: <Home />, // Addresses
      //   label: (
      //     <Link href="/admin/dashboard/customers/address-book">
      //       Address Book
      //     </Link>
      //   ),
      // },
      // {
      //   key: "top-customers",
      //   icon: <Award />, // Best customers
      //   label: (
      //     <Link href="/admin/dashboard/customers/top-customers">
      //       Top Customers
      //     </Link>
      //   ),
      // },
      // {
      //   key: "reports",
      //   icon: <ChartLine />, // Analytics / reports
      //   label: (
      //     <Link href="/admin/dashboard/customers/reports">
      //       Acquisition Report
      //     </Link>
      //   ),
      // },
    ],
  },

  {
    key: "finance-account",
    icon: <Landmark />, // Finance / Accounts
    label: "Finance",
    children: [
      {
        key: "accounts",
        icon: <WalletCards />,
        label: <Link href="/admin/dashboard/finance/accounts">Accounts</Link>,
      },
      {
        key: "tax",
        icon: <Calculator />,
        label: <Link href="/admin/dashboard/finance/tax">Tax</Link>,
      },
      {
        key: "expenses",
        icon: <Banknote />, // Expense list
        label: <Link href="/admin/dashboard/finance/expenses">Expenses</Link>,
      },
      {
        key: "expenses-category",
        icon: <FolderTree />,
        label: (
          <Link href="/admin/dashboard/finance/expense-category">
            Expenses Categories
          </Link>
        ),
      },
      {
        key: "payable",
        icon: <HandCoins />,
        label: <Link href="/admin/dashboard/finance/payables">Payable</Link>,
      },
      {
        key: "receivable",
        icon: <CircleDollarSign />,
        label: (
          <Link href="/admin/dashboard/finance/receivables">Receivables</Link>
        ),
      },
      // {
      //   key: "overview",
      //   icon: <Gauge />, // Overview
      //   label: (
      //     <Link href="/admin/dashboard/finance/accounts/overview">
      //       Overview
      //     </Link>
      //   ),
      // },
      // {
      //   key: "profit-loss",
      //   icon: <ChartLine />, // Profit & Loss
      //   label: (
      //     <Link href="/admin/dashboard/finance/accounts/profit-loss">
      //       Profit & Loss
      //     </Link>
      //   ),
      // },
    ],
  },

  {
    key: "payment-gateway",
    icon: <CreditCard />,
    label: "Payment Gateway",
    children: [
      {
        key: "gateway-list",
        icon: <WalletCards />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/gateways">
            Gateways
          </Link>
        ),
      },
      {
        key: "gateway-configurations",
        icon: <Settings />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/configurations">
            Configurations
          </Link>
        ),
      },
    ],
  },

  // {
  //   key: "invoices",
  //   icon: <FileText />, // Main menu (Invoices)
  //   label: "Invoices",
  //   children: [
  //     {
  //       key: "invoice-list",
  //       icon: <List />,
  //       label: <Link href="/admin/dashboard/invoices">Invoice List</Link>,
  //     },
  //     {
  //       key: "create",
  //       icon: <Pencil />,
  //       label: (
  //         <Link href="/admin/dashboard/invoices/create">Create Invoice</Link>
  //       ),
  //     },
  //     {
  //       key: "templates",
  //       icon: <Copy />,
  //       label: (
  //         <Link href="/admin/dashboard/invoices/templates">
  //           Invoice Templates
  //         </Link>
  //       ),
  //     },
  //   ],
  // },

  // couriers 
  {
    key: "couriers",
    icon: <Truck />, // Couriers main
    label: "Couriers",
    children: [
      {
        key: "courier-companies",
        icon: <Store />, // Courier companies
        label: (
          <Link href="/admin/dashboard/couriers/courier-provider">
            Courier Provider
          </Link>
        ),
      },
      {
        key: "courier-config",
        icon: <Settings />, // Config / API / setup
        label: (
          <Link href="/admin/dashboard/couriers/courier-config">
            Courier Config
          </Link>
        ),
      },
      {
        key: "pickup-stores",
        icon: <MapPin />, // Zones / areas
        label: (
          <Link href="/admin/dashboard/couriers/pickup-stores">
            PickUp Stores
          </Link>
        ),
      },
      {
        key: "shipments",
        icon: <FileText />, // Shipments / tracking
        label: (
          <Link href="/admin/dashboard/couriers/shipments">Shipments</Link>
        ),
      },
      {
        key: "charge-setting",
        icon: <Banknote />, // Charges / pricing
        label: (
          <Link href="/admin/dashboard/couriers/charge-setting">
            Shipping Charge
          </Link>
        ),
      },
      {
        key: "performances",
        icon: <ChartBar />, // Performance analytics
        label: (
          <Link href="/admin/dashboard/couriers/performance">Performances</Link>
        ),
      },
    ],
  },

  {
    key: "website-builder",
    icon: <LayoutDashboard />, // Website Builder (main)
    label: "Website Builder",
    children: [
      {
        key: "websites",
        icon: <Globe />, // List of websites
        label: (
          <Link href="/admin/dashboard/website-builder/websites">
            View Website
          </Link>
        ),
      },
      // {
      //   key: "section-editor",
      //   icon: <LayoutDashboard />, // Sections & layouts
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/section-editor">
      //       Section Editor
      //     </Link>
      //   ),
      // },
      // {
      //   key: "page-builder",
      //   icon: <FileText />, // Pages / content
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/page-builder">
      //       Page Builder
      //     </Link>
      //   ),
      // },
      // {
      //   key: "menu-builder",
      //   icon: <MenuIcon />, // Navigation menus
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/menu-builder">
      //       Menu Builder
      //     </Link>
      //   ),
      // },
      {
        key: "template",
        icon: <Copy />, // Templates
        label: (
          <Link href="/admin/dashboard/website-builder/template">Template</Link>
        ),
      },
      // {
      //   key: "domains",
      //   icon: <LinkIcon />, // Domains
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/domains">
      //       Domain Manager
      //     </Link>
      //   ),
      // },
      // {
      //   key: "publish-setting",
      //   icon: <CloudUpload />, // Publish settings
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/publish-setting">
      //       Publish Setting
      //     </Link>
      //   ),
      // },
    ],
  },

  // {
  //   key: "sms-marketing",
  //   icon: <MessageCircle />, // SMS / messaging
  //   label: "SMS Marketing",
  //   children: [
  //     {
  //       key: "template-list",
  //       icon: <FileText />, // SMS templates
  //       label: <Link href="/admin/dashboard/sms/templates">Template List</Link>,
  //     },
  //     {
  //       key: "create-template",
  //       icon: <SquarePlus />, // Create new template
  //       label: (
  //         <Link href="/admin/dashboard/sms/templates/create">
  //           Create Template
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "campaigns",
  //       icon: <Send />, // SMS campaigns
  //       label: <Link href="/admin/dashboard/sms/campaigns">Campaigns</Link>,
  //     },
  //     {
  //       key: "create-campaign",
  //       icon: <SquarePlus />, // Create campaign
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/create">
  //           Create Campaign
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "schedule-campaign",
  //       icon: <CalendarClock />, // Scheduled campaigns
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/schedule">
  //           Schedule Campaign
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "campaign-analytics",
  //       icon: <ChartBar />, // Campaign performance
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/analytics">
  //           Campaign Analytics
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "recipient-log",
  //       icon: <Users />, // Recipients / logs
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/recipients">
  //           Recipient Log
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "credit-balance",
  //       icon: <WalletCards />, // SMS credits balance
  //       label: <Link href="/admin/dashboard/sms/credits">Credit Balance</Link>,
  //     },
  //     {
  //       key: "recharge-credits",
  //       icon: <CreditCard />, // Recharge credits
  //       label: (
  //         <Link href="/admin/dashboard/sms/credits/recharge">
  //           Recharge Credits
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "gateway-settings",
  //       icon: <Settings />, // SMS gateway config
  //       label: (
  //         <Link href="/admin/dashboard/sms/gateway-settings">
  //           Gateway Settings
  //         </Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "marketing-assistant",
  //   icon: <Bot />, // AI / assistant
  //   label: "Marketing Assistant",
  //   children: [
  //     {
  //       key: "marketing-chat",
  //       icon: <MessageCircle />, // AI chat
  //       label: <Link href="/admin/dashboard/ai/chat">Marketing Chat</Link>,
  //     },
  //     {
  //       key: "generated-product-descriptions",
  //       icon: <FileText />, // Product descriptions
  //       label: (
  //         <Link href="/admin/dashboard/ai/descriptions">
  //           G Product Descriptions
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "generated-promo-text",
  //       icon: <BookOpen />, // Promo / ad copy
  //       label: <Link href="/admin/dashboard/ai/promos">G Promo Text</Link>,
  //     },
  //     {
  //       key: "generated-slogans",
  //       icon: <Lightbulb />, // Creative slogans
  //       label: (
  //         <Link href="/admin/dashboard/ai/slogans">Generated Slogans</Link>
  //       ),
  //     },
  //     {
  //       key: "generation-history",
  //       icon: <History />, // Past generations
  //       label: (
  //         <Link href="/admin/dashboard/ai/generation-history">
  //           Generation History
  //         </Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "promotion-automation",
  //   icon: <Zap />, // Automation / triggers
  //   label: "Promotion Automation",
  //   children: [
  //     {
  //       key: "promotions",
  //       icon: <TagsIcon />, // Discounts / offers
  //       label: <Link href="/admin/dashboard/promotions">Promotions</Link>,
  //     },
  //     {
  //       key: "create-promotion",
  //       icon: <CirclePlus />, // Create new promotion
  //       label: (
  //         <Link href="/admin/dashboard/promotions/create">
  //           Create Promotion
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "promotion-rules-builder",
  //       icon: <Building2 />, // Rules / conditions builder
  //       label: (
  //         <Link href="/admin/dashboard/promotions/rules-builders">
  //           Promotion Rules Builder
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "promotion-calendar",
  //       icon: <Calendar />, // Scheduling promotions
  //       label: (
  //         <Link href="/admin/dashboard/promotions/calendar">
  //           Promotion Calendar
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "promotion-performance",
  //       icon: <ChartLine />, // Performance analytics
  //       label: (
  //         <Link href="/admin/dashboard/promotions/performance">
  //           Promotion Performance
  //         </Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "reports-analytics",
  //   icon: <ChartBar />, // Reports & Analytics
  //   label: "Reports & Analytics",
  //   children: [
  //     {
  //       key: "reports-overview",
  //       icon: <Gauge />, // Summary dashboard
  //       label: <Link href="/admin/dashboard/reports">Reports Overview</Link>,
  //     },
  //     {
  //       key: "sales-reports",
  //       icon: <ChartLine />, // Sales trend
  //       label: <Link href="/admin/dashboard/reports/sales">Sales Reports</Link>,
  //     },
  //     {
  //       key: "order-reports",
  //       icon: <ShoppingCart />, // Orders
  //       label: (
  //         <Link href="/admin/dashboard/reports/orders">Order Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "inventory-reports",
  //       icon: <LayoutDashboard />, // Inventory / stock
  //       label: (
  //         <Link href="/admin/dashboard/reports/inventory">
  //           Inventory Reports
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "supplier-reports",
  //       icon: <Users />, // Suppliers
  //       label: (
  //         <Link href="/admin/dashboard/reports/suppliers">
  //           Supplier Reports
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "courier-reports",
  //       icon: <Truck />, // Logistics
  //       label: (
  //         <Link href="/admin/dashboard/reports/couriers">Courier Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "expense-reports",
  //       icon: <WalletCards />, // Expenses
  //       label: (
  //         <Link href="/admin/dashboard/reports/expenses">Expense Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "financial-reports",
  //       icon: <Banknote />, // Finance
  //       label: (
  //         <Link href="/admin/dashboard/reports/financial">
  //           Financial Reports
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "revenue-reports",
  //       icon: <TrendingUp />, // Revenue growth
  //       label: (
  //         <Link href="/admin/dashboard/reports/revenue">Revenue Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "profit-reports",
  //       icon: <TrendingUp />, // Profit analysis
  //       label: (
  //         <Link href="/admin/dashboard/reports/profit">Profit Reports</Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "notifications",
  //   icon: <Bell />,
  //   label: <Link href="/admin/dashboard/notifications">Notifications</Link>,
  // },

  {
    key: "billing",
    icon: <CreditCard />,
    label: "Billing",
    children: [
      {
        key: "history",
        icon: <History />,
        label: <Link href="/admin/dashboard/billing/history">History</Link>,
      },
      {
        key: "subscription",
        icon: <RefreshCw />,
        label: (
          <Link href="/admin/dashboard/billing/subscription">Subscription</Link>
        ),
      },
      {
        key: "upgrade-plan",
        icon: <ArrowUp />,
        label: (
          <Link href="/admin/dashboard/billing/upgrade-plan">Upgrade Plan</Link>
        ),
      },
    ],
  },

  {
    key: "business",
    icon: <Building2 />,
    label: "Business Settings",
    children: [
      {
        key: "settings",
        icon: <Settings />,
        label: <Link href="/admin/dashboard/business/settings">Settings</Link>,
      },
      {
        key: "branding",
        icon: <Palette />,
        label: <Link href="/admin/dashboard/business/branding">Branding</Link>,
      },
    ],
  },
];

export const items: MenuProps["items"] = allItems.filter(
  (item) => item && "key" in item && item.key != null,
);
