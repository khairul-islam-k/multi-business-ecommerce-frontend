import {
  ArrowLeftRight,
  ArrowUp,
  BadgeInfo,
  Banknote,
  Boxes,
  Building,
  Building2,
  Calculator,
  CircleDollarSign,
  CircleUserRound,
  ClipboardList,
  ContactRound,
  Copy,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileText,
  FolderTree,
  Gauge,
  GitBranch,
  Globe,
  Grid2X2Plus,
  HandCoins,
  Handshake,
  History,
  Image as ImageIcon,
  KeyRound,
  Landmark,
  LayoutDashboard,
  ListOrdered,
  MapPin,
  MessageCircle,
  Network,
  Package as PackageIcon,
  PackageSearch,
  Palette,
  RefreshCw,
  RotateCcw,
  Scale,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Tags as TagsIcon,
  Truck,
  Undo2,
  UserRound,
  Users,
  WalletCards,
  Warehouse,
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
        key: "invoices",
        icon: <FileText />,
        label: <Link href="/admin/dashboard/orders/invoices">Invoices</Link>,
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
        key: "attributes",
        icon: <SlidersHorizontal />,
        label: (
          <Link href="/admin/dashboard/product-catalog/attributes">
            Attributes
          </Link>
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

  // suppliers procurement
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
        key: "supplier-invoices",
        icon: <FileText />,
        label: (
          <Link href="/admin/dashboard/suppliers/invoices">
            Supplier Invoices
          </Link>
        ),
      },
      {
        key: "purchase-returns",
        icon: <Undo2 />,
        label: <Link href="/admin/dashboard/suppliers/returns">Returns</Link>,
      },
    ],
  },

  // couriers
  {
    key: "couriers",
    icon: <Truck />, // Couriers main
    label: "Couriers",
    children: [
      {
        key: "shipments",
        icon: <FileText />, // Shipments / tracking
        label: (
          <Link href="/admin/dashboard/couriers/shipments">Shipments</Link>
        ),
      },
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
        key: "pickup-stores",
        icon: <MapPin />, // Zones / areas
        label: (
          <Link href="/admin/dashboard/couriers/pickup-stores">
            PickUp Stores
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
    ],
  },

  // payment gateway
  {
    key: "payment-gateway",
    icon: <CreditCard />,
    label: "Payment Gateway",
    children: [
      {
        key: "gateway-list",
        icon: <WalletCards />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/gateways">Gateways</Link>
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

  // website builder
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
      {
        key: "template",
        icon: <Copy />, // Templates
        label: (
          <Link href="/admin/dashboard/website-builder/template">Template</Link>
        ),
      },
    ],
  },

  {
    key: "billing",
    icon: <CreditCard />,
    label: "Billing",
    children: [
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
      {
        key: "history",
        icon: <History />,
        label: <Link href="/admin/dashboard/billing/history">History</Link>,
      },
    ],
  },

  // inventory
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
      {
        key: "stock-transfers",
        icon: <ExternalLink />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-transfers">
            Stock Transfers
          </Link>
        ),
      },
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
        key: "inventory-transactions",
        icon: <ArrowLeftRight />,
        label: (
          <Link href="/admin/dashboard/inventory/transactions">
            Inventory Movements
          </Link>
        ),
      },
    ],
  },

  // finance
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
        key: "receivable",
        icon: <CircleDollarSign />,
        label: (
          <Link href="/admin/dashboard/finance/receivables">Receivables</Link>
        ),
      },
      {
        key: "payable",
        icon: <HandCoins />,
        label: <Link href="/admin/dashboard/finance/payables">Payable</Link>,
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
        key: "tax",
        icon: <Calculator />,
        label: <Link href="/admin/dashboard/finance/tax">Tax</Link>,
      },
    ],
  },

  {
    key: "media",
    icon: <ImageIcon />,
    label: <Link href="/admin/dashboard/media">Media Library</Link>,
  },

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
];

export const items: MenuProps["items"] = allItems.filter(
  (item) => item && "key" in item && item.key != null,
);
