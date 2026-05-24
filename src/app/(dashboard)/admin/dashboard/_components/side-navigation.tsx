import {
  AlertOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BarcodeOutlined,
  BellOutlined,
  BulbOutlined,
  CalendarOutlined,
  CarOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HistoryOutlined,
  HomeOutlined,
  InboxOutlined,
  KeyOutlined,
  LayoutOutlined,
  LineChartOutlined,
  LinkOutlined,
  MenuOutlined,
  MessageOutlined,
  PictureOutlined,
  PlusCircleOutlined,
  PlusSquareOutlined,
  ProductOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  RiseOutlined,
  RobotOutlined,
  RollbackOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  SendOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SnippetsOutlined,
  SwapOutlined,
  SyncOutlined,
  TagsOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  TrademarkCircleOutlined,
  TrophyOutlined,
  TruckOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
  WalletOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";

export const items: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/admin/dashboard">Dashboard</Link>,
  },

  // Business
  {
    key: "business",
    icon: <TeamOutlined />,
    label: "Business Settings",
    children: [
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: <Link href="/admin/dashboard/business/settings">Settings</Link>,
      },
      {
        key: "branding",
        icon: <AppstoreOutlined />,
        label: <Link href="/admin/dashboard/business/branding">Branding</Link>,
      },
      {
        key: "usage-limit",
        icon: <FileTextOutlined />,
        label: (
          <Link href="/admin/dashboard/business/usage-limit">
            Usage & Limit
          </Link>
        ),
      },
    ],
  },

  // Employees / Roles
  {
    key: "access-control",
    icon: <SafetyOutlined />,
    label: "Employees & Roles",
    children: [
      {
        key: "employees",
        icon: <UserOutlined />,
        label: (
          <Link href="/admin/dashboard/access-control/employees">
            Employees
          </Link>
        ),
      },
      {
        key: "roles",
        icon: <TeamOutlined />,
        label: <Link href="/admin/dashboard/access-control/roles">Roles</Link>,
      },
      {
        key: "permissions",
        icon: <KeyOutlined />,
        label: (
          <Link href="/admin/dashboard/access-control/permissions">
            Permissions
          </Link>
        ),
      },
      {
        key: "login-history",
        icon: <HistoryOutlined />,
        label: (
          <Link href="/admin/dashboard/access-control/login-history">
            Login History
          </Link>
        ),
      },
      {
        key: "activity-logs",
        icon: <AuditOutlined />,
        label: (
          <Link href="/admin/dashboard/access-control/activity-logs">
            Activity Logs
          </Link>
        ),
      },
    ],
  },

  // Media Manager
  {
    key: "media",
    icon: <PictureOutlined />,
    label: <Link href="/admin/dashboard/media">Media Library</Link>,
  },

  // Billing
  {
    key: "billing",
    icon: <CreditCardOutlined />,
    label: "Billing",
    children: [
      {
        key: "addons",
        icon: <AppstoreAddOutlined />,
        label: <Link href="/admin/dashboard/billing/addons">Addons</Link>,
      },
      {
        key: "history",
        icon: <HistoryOutlined />,
        label: <Link href="/admin/dashboard/billing/history">History</Link>,
      },
      {
        key: "subscription",
        icon: <SyncOutlined />,
        label: (
          <Link href="/admin/dashboard/billing/subscription">Subscription</Link>
        ),
      },
      {
        key: "upgrade-plan",
        icon: <ArrowUpOutlined />,
        label: (
          <Link href="/admin/dashboard/billing/upgrade-plan">Upgrade Plan</Link>
        ),
      },
    ],
  },

  // Product Management
  {
    key: "product-management",
    icon: <ShoppingOutlined />,
    label: "Product Management",
    children: [
      {
        key: "categories",
        icon: <AppstoreOutlined />,
        label: (
          <Link href="/admin/dashboard/products-management/categories">
            Categories
          </Link>
        ),
      },
      {
        key: "brands",
        icon: <TrademarkCircleOutlined />,
        label: (
          <Link href="/admin/dashboard/products-management/brands">
            Brands
          </Link>
        ),
      },
      {
        key: "units",
        icon: <DeploymentUnitOutlined />,
        label: (
          <Link href="/admin/dashboard/products-management/units">
            Units
          </Link>
        ),
      },
      {
        key: "tags",
        icon: <TagsOutlined />,
        label: (
          <Link href="/admin/dashboard/products-management/tags">
            Tags
          </Link>
        ),
      },
      {
        key: "products",
        icon: <ProductOutlined />,
        label: (
          <Link href="/admin/dashboard/products-management/products">
            Products
          </Link>
        ),
      },
      {
        key: "variant",
        icon: <ApartmentOutlined />,
        label: (
          <Link href="/admin/dashboard/products-management/variant">
            Variant Manager
          </Link>
        ),
      },
    ],
  },

  // Inventory
  {
    key: "inventory",
    icon: <ShopOutlined />,
    label: "Inventory",
    children: [
      {
        key: "stock-overview",
        icon: <DashboardOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-overview">
            Stock Overview
          </Link>
        ),
      },
      {
        key: "warehouse-stocks",
        icon: <HomeOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/warehouse-stock">
            Warehouse Stocks
          </Link>
        ),
      },
      {
        key: "inventory-transactions",
        icon: <SwapOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/transactions">
            Inventory Transactions
          </Link>
        ),
      },
      {
        key: "stock-entry",
        icon: <PlusSquareOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-entry">Stock Entry</Link>
        ),
      },
      {
        key: "stock-adjustments",
        icon: <SettingOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-adjustments">
            Stock Adjustments
          </Link>
        ),
      },
      {
        key: "stock-transfers",
        icon: <ExportOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/stock-transfers">
            Stock Transfers
          </Link>
        ),
      },
      {
        key: "damaged-product",
        icon: <WarningOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/damaged-products">
            Damaged Products
          </Link>
        ),
      },
      {
        key: "low-stock",
        icon: <AlertOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/low-stock-alert">
            Low Stocks
          </Link>
        ),
      },
      {
        key: "inventory-value",
        icon: <DollarOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/value-report">
            Inventory Value
          </Link>
        ),
      },
      {
        key: "missing-products",
        icon: <QuestionCircleOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/missing-products">
            Missing Products
          </Link>
        ),
      },
    ],
  },

  // Orders
  {
    key: "orders",
    icon: <ShopOutlined />,
    label: "Orders",
    children: [
      {
        key: "all-orders",
        icon: <UnorderedListOutlined />,
        label: <Link href="/admin/dashboard/orders">All Orders</Link>,
      },
      {
        key: "returns",
        icon: <RollbackOutlined />,
        label: <Link href="/admin/dashboard/orders/returns">Returns</Link>,
      },
      {
        key: "payments",
        icon: <CreditCardOutlined />,
        label: <Link href="/admin/dashboard/orders/payments">Payments</Link>,
      },
      {
        key: "analytics",
        icon: <LineChartOutlined />,
        label: <Link href="/admin/dashboard/orders/analytics">Analytics</Link>,
      },
    ],
  },

  // Product Catalogue
  {
    key: "masters-settings",
    icon: <ShopOutlined />, // Orders / Store
    label: "Masters / Settings",
    children: [
      {
        key: "Categories-settings",
        icon: <AppstoreOutlined />,
        label: (
          <Link href="/admin/dashboard/masters/categories">Categories</Link>
        ),
      },
      {
        key: "Brand-list",
        icon: <TagsOutlined />,
        label: <Link href="/admin/dashboard/masters/brands">Brands</Link>,
      },
      {
        key: "Warehouse-list",
        icon: <HomeOutlined />,
        label: (
          <Link href="/admin/dashboard/masters/warehouses">Warehouses</Link>
        ),
      },
      {
        key: "Showrooms",
        icon: <ShopOutlined />,
        label: <Link href="/admin/dashboard/masters/showrooms">Showrooms</Link>,
      },
      {
        key: "Supplier-list",
        icon: <TeamOutlined />,
        label: <Link href="/admin/dashboard/masters/suppliers">Suppliers</Link>,
      },
    ],
  },

  // Finance
  {
    key: "finance-account",
    icon: <BankOutlined />, // Finance / Accounts
    label: "Finance",
    children: [
      {
        key: "accounts",
        icon: <WalletOutlined />, // Accounts
        label: <Link href="/admin/dashboard/finance/accounts">Accounts</Link>,
      },
      {
        key: "overview",
        icon: <DashboardOutlined />, // Overview
        label: (
          <Link href="/admin/dashboard/finance/accounts/overview">
            Overview
          </Link>
        ),
      },
      {
        key: "profit-loss",
        icon: <LineChartOutlined />, // Profit & Loss
        label: (
          <Link href="/admin/dashboard/finance/accounts/profit-loss">
            Profit & Loss
          </Link>
        ),
      },
      {
        key: "transactions",
        icon: <SwapOutlined />, // Transactions
        label: (
          <Link href="/admin/dashboard/finance/accounts/transactions">
            Transactions
          </Link>
        ),
      },
    ],
  },

  // Expense
  {
    key: "finance-expense",
    icon: <DollarOutlined />, // Expenses
    label: "Expenses",
    children: [
      {
        key: "expenses",
        icon: <DollarOutlined />, // Expense list
        label: <Link href="/admin/dashboard/finance/expenses">Expenses</Link>,
      },
      {
        key: "categories-finance",
        icon: <TagsOutlined />, // Expense Categories
        label: (
          <Link href="/admin/dashboard/finance/expenses/categories">
            Categories
          </Link>
        ),
      },
    ],
  },

  // Payment Gateway
  {
    key: "payment-gateway",
    icon: <CreditCardOutlined />, // Main menu
    label: "Payment Gateway",
    children: [
      {
        key: "gateway-list",
        icon: <FileTextOutlined />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/gateways">
            Gateway List
          </Link>
        ),
      },
      {
        key: "configurations",
        icon: <SettingOutlined />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/configurations">
            Gateway Config
          </Link>
        ),
      },
      {
        key: "gateway-rules",
        icon: <SnippetsOutlined />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/gateway-rules">
            Gateway Rules
          </Link>
        ),
      },
      {
        key: "cod-settings",
        icon: <ToolOutlined />,
        label: (
          <Link href="/admin/dashboard/payment-gateway/cod-settings">
            COD Settings
          </Link>
        ),
      },
    ],
  },

  // Invoices
  {
    key: "invoices",
    icon: <FileTextOutlined />, // Main menu (Invoices)
    label: "Invoices",
    children: [
      {
        key: "invoice-list",
        icon: <UnorderedListOutlined />,
        label: <Link href="/admin/dashboard/invoices">Invoice List</Link>,
      },
      {
        key: "create",
        icon: <EditOutlined />,
        label: (
          <Link href="/admin/dashboard/invoices/create">Create Invoice</Link>
        ),
      },
      {
        key: "templates",
        icon: <CopyOutlined />,
        label: (
          <Link href="/admin/dashboard/invoices/templates">
            Invoice Templates
          </Link>
        ),
      },
    ],
  },

  // customers
  {
    key: "customers",
    icon: <TeamOutlined />, // Customers module
    label: "Customers",
    children: [
      {
        key: "customer-list",
        icon: <UserOutlined />, // Individual customers
        label: (
          <Link href="/admin/dashboard/customers/customer-list">
            Customer List
          </Link>
        ),
      },
      {
        key: "order-history",
        icon: <ShoppingCartOutlined />, // Orders
        label: (
          <Link href="/admin/dashboard/customers/order-history">
            Order History
          </Link>
        ),
      },
      {
        key: "address-book",
        icon: <HomeOutlined />, // Addresses
        label: (
          <Link href="/admin/dashboard/customers/address-book">
            Address Book
          </Link>
        ),
      },
      {
        key: "top-customers",
        icon: <TrophyOutlined />, // Best customers
        label: (
          <Link href="/admin/dashboard/customers/top-customers">
            Top Customers
          </Link>
        ),
      },
      {
        key: "reports",
        icon: <LineChartOutlined />, // Analytics / reports
        label: (
          <Link href="/admin/dashboard/customers/reports">
            Acquisition Report
          </Link>
        ),
      },
    ],
  },

  // suppliers-procurement
  {
    key: "suppliers-procurement",
    icon: <ShopOutlined />,
    label: "Suppliers & Procurement",
    children: [
      {
        key: "supplier-products",
        icon: <InboxOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/supplier-products">
            Supplier Products
          </Link>
        ),
      },
      {
        key: "purchase-order",
        icon: <FileTextOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/purchase-order">
            Purchase Orders
          </Link>
        ),
      },
      {
        key: "create-po",
        icon: <FileTextOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/create-po">Create PO</Link>
        ),
      },
      {
        key: "receive-po",
        icon: <InboxOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/receive-po">Receive PO</Link>
        ),
      },
      {
        key: "supplier-payment",
        icon: <DollarOutlined />,
        label: <Link href="/admin/dashboard/suppliers/payments">Payments</Link>,
      },
      {
        key: "supplier-performance",
        icon: <BarChartOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/performance">Performance</Link>
        ),
      },
    ],
  },

  // couriers
  {
    key: "couriers",
    icon: <TruckOutlined />, // Couriers main
    label: "Couriers",
    children: [
      {
        key: "courier-companies",
        icon: <ShopOutlined />, // Courier companies
        label: (
          <Link href="/admin/dashboard/couriers/courier-companies">
            Courier Companies
          </Link>
        ),
      },
      {
        key: "courier-config",
        icon: <SettingOutlined />, // Config / API / setup
        label: (
          <Link href="/admin/dashboard/couriers/courier-config">
            Courier Config
          </Link>
        ),
      },
      {
        key: "delivery-zones",
        icon: <EnvironmentOutlined />, // Zones / areas
        label: (
          <Link href="/admin/dashboard/couriers/delivery-zones">
            Delivery Zones
          </Link>
        ),
      },
      {
        key: "shipments",
        icon: <ProfileOutlined />, // Shipments / tracking
        label: (
          <Link href="/admin/dashboard/couriers/shipments">Shipments</Link>
        ),
      },
      {
        key: "charge-setting",
        icon: <DollarOutlined />, // Charges / pricing
        label: (
          <Link href="/admin/dashboard/couriers/charge-setting">
            Shipping Charge
          </Link>
        ),
      },
      {
        key: "performances",
        icon: <BarChartOutlined />, // Performance analytics
        label: (
          <Link href="/admin/dashboard/couriers/performance">Performances</Link>
        ),
      },
    ],
  },

  // Website Builder
  {
    key: "website-builder",
    icon: <AppstoreOutlined />, // Website Builder (main)
    label: "Website Builder",
    children: [
      {
        key: "websites",
        icon: <GlobalOutlined />, // List of websites
        label: (
          <Link href="/admin/dashboard/website-builder/websites">
            Website List
          </Link>
        ),
      },
      {
        key: "section-editor",
        icon: <LayoutOutlined />, // Sections & layouts
        label: (
          <Link href="/admin/dashboard/website-builder/section-editor">
            Section Editor
          </Link>
        ),
      },
      {
        key: "page-builder",
        icon: <FileTextOutlined />, // Pages / content
        label: (
          <Link href="/admin/dashboard/website-builder/page-builder">
            Page Builder
          </Link>
        ),
      },
      {
        key: "menu-builder",
        icon: <MenuOutlined />, // Navigation menus
        label: (
          <Link href="/admin/dashboard/website-builder/menu-builder">
            Menu Builder
          </Link>
        ),
      },
      {
        key: "template",
        icon: <CopyOutlined />, // Templates
        label: (
          <Link href="/admin/dashboard/website-builder/template">Template</Link>
        ),
      },
      {
        key: "domains",
        icon: <LinkOutlined />, // Domains
        label: (
          <Link href="/admin/dashboard/website-builder/domains">
            Domain Manager
          </Link>
        ),
      },
      {
        key: "publish-setting",
        icon: <CloudUploadOutlined />, // Publish settings
        label: (
          <Link href="/admin/dashboard/website-builder/publish-setting">
            Publish Setting
          </Link>
        ),
      },
    ],
  },

  // SMS Marketing
  {
    key: "sms-marketing",
    icon: <MessageOutlined />, // SMS / messaging
    label: "SMS Marketing",
    children: [
      {
        key: "template-list",
        icon: <FileTextOutlined />, // SMS templates
        label: <Link href="/admin/dashboard/sms/templates">Template List</Link>,
      },
      {
        key: "create-template",
        icon: <PlusSquareOutlined />, // Create new template
        label: (
          <Link href="/admin/dashboard/sms/templates/create">
            Create Template
          </Link>
        ),
      },
      {
        key: "campaigns",
        icon: <SendOutlined />, // SMS campaigns
        label: <Link href="/admin/dashboard/sms/campaigns">Campaigns</Link>,
      },
      {
        key: "create-campaign",
        icon: <PlusSquareOutlined />, // Create campaign
        label: (
          <Link href="/admin/dashboard/sms/campaigns/create">
            Create Campaign
          </Link>
        ),
      },
      {
        key: "schedule-campaign",
        icon: <ScheduleOutlined />, // Scheduled campaigns
        label: (
          <Link href="/admin/dashboard/sms/campaigns/schedule">
            Schedule Campaign
          </Link>
        ),
      },
      {
        key: "campaign-analytics",
        icon: <BarChartOutlined />, // Campaign performance
        label: (
          <Link href="/admin/dashboard/sms/campaigns/analytics">
            Campaign Analytics
          </Link>
        ),
      },
      {
        key: "recipient-log",
        icon: <TeamOutlined />, // Recipients / logs
        label: (
          <Link href="/admin/dashboard/sms/campaigns/recipients">
            Recipient Log
          </Link>
        ),
      },
      {
        key: "credit-balance",
        icon: <WalletOutlined />, // SMS credits balance
        label: <Link href="/admin/dashboard/sms/credits">Credit Balance</Link>,
      },
      {
        key: "recharge-credits",
        icon: <CreditCardOutlined />, // Recharge credits
        label: (
          <Link href="/admin/dashboard/sms/credits/recharge">
            Recharge Credits
          </Link>
        ),
      },
      {
        key: "gateway-settings",
        icon: <SettingOutlined />, // SMS gateway config
        label: (
          <Link href="/admin/dashboard/sms/gateway-settings">
            Gateway Settings
          </Link>
        ),
      },
    ],
  },

  // AI Marketing Assistant
  {
    key: "marketing-assistant",
    icon: <RobotOutlined />, // AI / assistant
    label: "Marketing Assistant",
    children: [
      {
        key: "marketing-chat",
        icon: <CommentOutlined />, // AI chat
        label: <Link href="/admin/dashboard/ai/chat">Marketing Chat</Link>,
      },
      {
        key: "generated-product-descriptions",
        icon: <FileTextOutlined />, // Product descriptions
        label: (
          <Link href="/admin/dashboard/ai/descriptions">
            G Product Descriptions
          </Link>
        ),
      },
      {
        key: "generated-promo-text",
        icon: <ReadOutlined />, // Promo / ad copy
        label: <Link href="/admin/dashboard/ai/promos">G Promo Text</Link>,
      },
      {
        key: "generated-slogans",
        icon: <BulbOutlined />, // Creative slogans
        label: (
          <Link href="/admin/dashboard/ai/slogans">Generated Slogans</Link>
        ),
      },
      {
        key: "generation-history",
        icon: <HistoryOutlined />, // Past generations
        label: (
          <Link href="/admin/dashboard/ai/generation-history">
            Generation History
          </Link>
        ),
      },
    ],
  },

  // promotion-automation
  {
    key: "promotion-automation",
    icon: <ThunderboltOutlined />, // Automation / triggers
    label: "Promotion Automation",
    children: [
      {
        key: "promotions",
        icon: <TagsOutlined />, // Discounts / offers
        label: <Link href="/admin/dashboard/promotions">Promotions</Link>,
      },
      {
        key: "create-promotion",
        icon: <PlusCircleOutlined />, // Create new promotion
        label: (
          <Link href="/admin/dashboard/promotions/create">
            Create Promotion
          </Link>
        ),
      },
      {
        key: "promotion-rules-builder",
        icon: <ApartmentOutlined />, // Rules / conditions builder
        label: (
          <Link href="/admin/dashboard/promotions/rules-builders">
            Promotion Rules Builder
          </Link>
        ),
      },
      {
        key: "promotion-calendar",
        icon: <CalendarOutlined />, // Scheduling promotions
        label: (
          <Link href="/admin/dashboard/promotions/calendar">
            Promotion Calendar
          </Link>
        ),
      },
      {
        key: "promotion-performance",
        icon: <LineChartOutlined />, // Performance analytics
        label: (
          <Link href="/admin/dashboard/promotions/performance">
            Promotion Performance
          </Link>
        ),
      },
    ],
  },

  {
    key: "reports-analytics",
    icon: <BarChartOutlined />, // Reports & Analytics
    label: "Reports & Analytics",
    children: [
      {
        key: "reports-overview",
        icon: <DashboardOutlined />, // Summary dashboard
        label: <Link href="/admin/dashboard/reports">Reports Overview</Link>,
      },
      {
        key: "sales-reports",
        icon: <LineChartOutlined />, // Sales trend
        label: <Link href="/admin/dashboard/reports/sales">Sales Reports</Link>,
      },
      {
        key: "order-reports",
        icon: <ShoppingCartOutlined />, // Orders
        label: (
          <Link href="/admin/dashboard/reports/orders">Order Reports</Link>
        ),
      },
      {
        key: "inventory-reports",
        icon: <AppstoreOutlined />, // Inventory / stock
        label: (
          <Link href="/admin/dashboard/reports/inventory">
            Inventory Reports
          </Link>
        ),
      },
      {
        key: "supplier-reports",
        icon: <TeamOutlined />, // Suppliers
        label: (
          <Link href="/admin/dashboard/reports/suppliers">
            Supplier Reports
          </Link>
        ),
      },
      {
        key: "courier-reports",
        icon: <CarOutlined />, // Logistics
        label: (
          <Link href="/admin/dashboard/reports/couriers">Courier Reports</Link>
        ),
      },
      {
        key: "expense-reports",
        icon: <WalletOutlined />, // Expenses
        label: (
          <Link href="/admin/dashboard/reports/expenses">Expense Reports</Link>
        ),
      },
      {
        key: "financial-reports",
        icon: <DollarOutlined />, // Finance
        label: (
          <Link href="/admin/dashboard/reports/financial">
            Financial Reports
          </Link>
        ),
      },
      {
        key: "revenue-reports",
        icon: <RiseOutlined />, // Revenue growth
        label: (
          <Link href="/admin/dashboard/reports/revenue">Revenue Reports</Link>
        ),
      },
      {
        key: "profit-reports",
        icon: <RiseOutlined />, // Profit analysis
        label: (
          <Link href="/admin/dashboard/reports/profit">Profit Reports</Link>
        ),
      },
    ],
  },

  {
    key: "notifications",
    icon: <BellOutlined />,
    label: <Link href="/admin/dashboard/notifications">Notifications</Link>,
  },
];
