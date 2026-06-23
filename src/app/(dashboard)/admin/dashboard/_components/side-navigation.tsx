import Link from "next/link";

import {
  AlertOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  ArrowUpOutlined,
  BankOutlined,
  BarChartOutlined,
  BellOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CarOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HistoryOutlined,
  HomeOutlined,
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
  UserOutlined,
  WalletOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";

const allItems: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "pos",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/admin/dashboard/pos">POS</Link>,
  },

  {
    key: "media",
    icon: <PictureOutlined />,
    label: <Link href="/admin/dashboard/media">Media Library</Link>,
  },

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
    ],
  },

  {
    key: "product-catalog",
    icon: <ShoppingOutlined />,
    label: "Product",
    children: [
      {
        key: "categories",
        icon: <AppstoreOutlined />,
        label: (
          <Link href="/admin/dashboard/product-catalog/categories">
            Categories
          </Link>
        ),
      },
      {
        key: "brands",
        icon: <TrademarkCircleOutlined />,
        label: (
          <Link href="/admin/dashboard/product-catalog/brands">Brands</Link>
        ),
      },
      {
        key: "units",
        icon: <DeploymentUnitOutlined />,
        label: <Link href="/admin/dashboard/product-catalog/units">Units</Link>,
      },
      {
        key: "tags",
        icon: <TagsOutlined />,
        label: <Link href="/admin/dashboard/product-catalog/tags">Tags</Link>,
      },
      {
        key: "attributes",
        icon: <TagsOutlined />,
        label: (
          <Link href="/admin/dashboard/product-catalog/attributes">
            Attributes
          </Link>
        ),
      },
      {
        key: "products",
        icon: <ProductOutlined />,
        label: (
          <Link href="/admin/dashboard/product-catalog/products">Products</Link>
        ),
      },
      {
        key: "variant",
        icon: <DeploymentUnitOutlined />,
        label: (
          <Link href="/admin/dashboard/product-catalog/variant">
            Variant Manager
          </Link>
        ),
      },
      {
        key: "reviews",
        icon: <CommentOutlined />,
        label: (
          <Link href="/admin/dashboard/product-catalog/reviews">Reviews</Link>
        ),
      },
    ],
  },

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
        key: "warehouses",
        icon: <ShopOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/warehouses">Warehouses</Link>
        ),
      },
      // {
      //   key: "warehouse-stocks",
      //   icon: <HomeOutlined />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/warehouse-stock">
      //       Warehouse Stocks
      //     </Link>
      //   ),
      // },
      {
        key: "inventory-transactions",
        icon: <SwapOutlined />,
        label: (
          <Link href="/admin/dashboard/inventory/transactions">
            Inventory Movements
          </Link>
        ),
      },
      // {
      //   key: "stock-entry",
      //   icon: <PlusSquareOutlined />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/stock-entry">Stock Entry</Link>
      //   ),
      // },
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
      // {
      //   key: "damaged-product",
      //   icon: <WarningOutlined />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/damaged-products">
      //       Damaged Products
      //     </Link>
      //   ),
      // },
      // {
      //   key: "low-stock",
      //   icon: <AlertOutlined />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/low-stock-alert">
      //       Low Stocks
      //     </Link>
      //   ),
      // },
      // {
      //   key: "inventory-value",
      //   icon: <DollarOutlined />,
      //   label: (
      //     <Link href="/admin/dashboard/inventory/value-report">
      //       Inventory Value
      //     </Link>
      //   ),
      // },
      // {
      //   key: "missing-products",
      //   icon: <QuestionCircleOutlined />,
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
    icon: <ShopOutlined />,
    label: "Suppliers Procurement",
    children: [
      {
        key: "supplier",
        icon: <ShopOutlined />,
        label: <Link href="/admin/dashboard/suppliers/supplier">Supplier</Link>,
      },
      {
        key: "supplier-products",
        icon: <AppstoreAddOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/supplier-products">
            Supplier Products
          </Link>
        ),
      },
      {
        key: "purchase-order",
        icon: <FileDoneOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/purchase-order">
            Purchase Orders
          </Link>
        ),
      },
      {
        key: "purchase-returns",
        icon: <RollbackOutlined />,
        label: <Link href="/admin/dashboard/suppliers/returns">Returns</Link>,
      },
      {
        key: "supplier-invoices",
        icon: <FileTextOutlined />,
        label: (
          <Link href="/admin/dashboard/suppliers/invoices">
            Supplier Invoices
          </Link>
        ),
      },
      // {
      //   key: "supplier-payment",
      //   icon: <DollarOutlined />,
      //   label: <Link href="/admin/dashboard/suppliers/payments">Payments</Link>,
      // },
      // {
      //   key: "supplier-performance",
      //   icon: <BarChartOutlined />,
      //   label: (
      //     <Link href="/admin/dashboard/suppliers/performance">Performance</Link>
      //   ),
      // },
    ],
  },

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
    ],
  },

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
      // {
      //   key: "order-history",
      //   icon: <ShoppingCartOutlined />, // Orders
      //   label: (
      //     <Link href="/admin/dashboard/customers/order-history">
      //       Order History
      //     </Link>
      //   ),
      // },
      // {
      //   key: "address-book",
      //   icon: <HomeOutlined />, // Addresses
      //   label: (
      //     <Link href="/admin/dashboard/customers/address-book">
      //       Address Book
      //     </Link>
      //   ),
      // },
      // {
      //   key: "top-customers",
      //   icon: <TrophyOutlined />, // Best customers
      //   label: (
      //     <Link href="/admin/dashboard/customers/top-customers">
      //       Top Customers
      //     </Link>
      //   ),
      // },
      // {
      //   key: "reports",
      //   icon: <LineChartOutlined />, // Analytics / reports
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
    icon: <BankOutlined />, // Finance / Accounts
    label: "Finance",
    children: [
      {
        key: "accounts",
        icon: <BankOutlined />,
        label: <Link href="/admin/dashboard/finance/accounts">Accounts</Link>,
      },
      {
        key: "tax",
        icon: <CalculatorOutlined />,
        label: <Link href="/admin/dashboard/finance/tax">Tax</Link>,
      },
      {
        key: "expenses",
        icon: <DollarOutlined />, // Expense list
        label: <Link href="/admin/dashboard/finance/expenses">Expenses</Link>,
      },
      {
        key: "expenses-category",
        icon: <TagsOutlined />,
        label: (
          <Link href="/admin/dashboard/finance/expense-category">
            Expenses Categories
          </Link>
        ),
      },
      {
        key: "payable",
        icon: <CreditCardOutlined />,
        label: <Link href="/admin/dashboard/finance/payables">Payable</Link>,
      },
      {
        key: "receivable",
        icon: <DollarCircleOutlined />,
        label: (
          <Link href="/admin/dashboard/finance/receivables">Receivables</Link>
        ),
      },
      // {
      //   key: "overview",
      //   icon: <DashboardOutlined />, // Overview
      //   label: (
      //     <Link href="/admin/dashboard/finance/accounts/overview">
      //       Overview
      //     </Link>
      //   ),
      // },
      // {
      //   key: "profit-loss",
      //   icon: <LineChartOutlined />, // Profit & Loss
      //   label: (
      //     <Link href="/admin/dashboard/finance/accounts/profit-loss">
      //       Profit & Loss
      //     </Link>
      //   ),
      // },
    ],
  },

  // {
  //   key: "payment-gateway",
  //   icon: <CreditCardOutlined />, // Main menu
  //   label: "Payment Gateway",
  //   children: [
  //     {
  //       key: "gateway-list",
  //       icon: <FileTextOutlined />,
  //       label: (
  //         <Link href="/admin/dashboard/payment-gateway/gateways">
  //           Gateway List
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "configurations",
  //       icon: <SettingOutlined />,
  //       label: (
  //         <Link href="/admin/dashboard/payment-gateway/configurations">
  //           Gateway Config
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "gateway-rules",
  //       icon: <SnippetsOutlined />,
  //       label: (
  //         <Link href="/admin/dashboard/payment-gateway/gateway-rules">
  //           Gateway Rules
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "cod-settings",
  //       icon: <ToolOutlined />,
  //       label: (
  //         <Link href="/admin/dashboard/payment-gateway/cod-settings">
  //           COD Settings
  //         </Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "invoices",
  //   icon: <FileTextOutlined />, // Main menu (Invoices)
  //   label: "Invoices",
  //   children: [
  //     {
  //       key: "invoice-list",
  //       icon: <UnorderedListOutlined />,
  //       label: <Link href="/admin/dashboard/invoices">Invoice List</Link>,
  //     },
  //     {
  //       key: "create",
  //       icon: <EditOutlined />,
  //       label: (
  //         <Link href="/admin/dashboard/invoices/create">Create Invoice</Link>
  //       ),
  //     },
  //     {
  //       key: "templates",
  //       icon: <CopyOutlined />,
  //       label: (
  //         <Link href="/admin/dashboard/invoices/templates">
  //           Invoice Templates
  //         </Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "couriers",
  //   icon: <TruckOutlined />, // Couriers main
  //   label: "Couriers",
  //   children: [
  //     {
  //       key: "courier-companies",
  //       icon: <ShopOutlined />, // Courier companies
  //       label: (
  //         <Link href="/admin/dashboard/couriers/courier-companies">
  //           Courier Companies
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "courier-config",
  //       icon: <SettingOutlined />, // Config / API / setup
  //       label: (
  //         <Link href="/admin/dashboard/couriers/courier-config">
  //           Courier Config
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "delivery-zones",
  //       icon: <EnvironmentOutlined />, // Zones / areas
  //       label: (
  //         <Link href="/admin/dashboard/couriers/delivery-zones">
  //           Delivery Zones
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "shipments",
  //       icon: <ProfileOutlined />, // Shipments / tracking
  //       label: (
  //         <Link href="/admin/dashboard/couriers/shipments">Shipments</Link>
  //       ),
  //     },
  //     {
  //       key: "charge-setting",
  //       icon: <DollarOutlined />, // Charges / pricing
  //       label: (
  //         <Link href="/admin/dashboard/couriers/charge-setting">
  //           Shipping Charge
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "performances",
  //       icon: <BarChartOutlined />, // Performance analytics
  //       label: (
  //         <Link href="/admin/dashboard/couriers/performance">Performances</Link>
  //       ),
  //     },
  //   ],
  // },

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
            View Website
          </Link>
        ),
      },
      // {
      //   key: "section-editor",
      //   icon: <LayoutOutlined />, // Sections & layouts
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/section-editor">
      //       Section Editor
      //     </Link>
      //   ),
      // },
      // {
      //   key: "page-builder",
      //   icon: <FileTextOutlined />, // Pages / content
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/page-builder">
      //       Page Builder
      //     </Link>
      //   ),
      // },
      // {
      //   key: "menu-builder",
      //   icon: <MenuOutlined />, // Navigation menus
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/menu-builder">
      //       Menu Builder
      //     </Link>
      //   ),
      // },
      {
        key: "template",
        icon: <CopyOutlined />, // Templates
        label: (
          <Link href="/admin/dashboard/website-builder/template">Template</Link>
        ),
      },
      // {
      //   key: "domains",
      //   icon: <LinkOutlined />, // Domains
      //   label: (
      //     <Link href="/admin/dashboard/website-builder/domains">
      //       Domain Manager
      //     </Link>
      //   ),
      // },
      // {
      //   key: "publish-setting",
      //   icon: <CloudUploadOutlined />, // Publish settings
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
  //   icon: <MessageOutlined />, // SMS / messaging
  //   label: "SMS Marketing",
  //   children: [
  //     {
  //       key: "template-list",
  //       icon: <FileTextOutlined />, // SMS templates
  //       label: <Link href="/admin/dashboard/sms/templates">Template List</Link>,
  //     },
  //     {
  //       key: "create-template",
  //       icon: <PlusSquareOutlined />, // Create new template
  //       label: (
  //         <Link href="/admin/dashboard/sms/templates/create">
  //           Create Template
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "campaigns",
  //       icon: <SendOutlined />, // SMS campaigns
  //       label: <Link href="/admin/dashboard/sms/campaigns">Campaigns</Link>,
  //     },
  //     {
  //       key: "create-campaign",
  //       icon: <PlusSquareOutlined />, // Create campaign
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/create">
  //           Create Campaign
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "schedule-campaign",
  //       icon: <ScheduleOutlined />, // Scheduled campaigns
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/schedule">
  //           Schedule Campaign
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "campaign-analytics",
  //       icon: <BarChartOutlined />, // Campaign performance
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/analytics">
  //           Campaign Analytics
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "recipient-log",
  //       icon: <TeamOutlined />, // Recipients / logs
  //       label: (
  //         <Link href="/admin/dashboard/sms/campaigns/recipients">
  //           Recipient Log
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "credit-balance",
  //       icon: <WalletOutlined />, // SMS credits balance
  //       label: <Link href="/admin/dashboard/sms/credits">Credit Balance</Link>,
  //     },
  //     {
  //       key: "recharge-credits",
  //       icon: <CreditCardOutlined />, // Recharge credits
  //       label: (
  //         <Link href="/admin/dashboard/sms/credits/recharge">
  //           Recharge Credits
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "gateway-settings",
  //       icon: <SettingOutlined />, // SMS gateway config
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
  //   icon: <RobotOutlined />, // AI / assistant
  //   label: "Marketing Assistant",
  //   children: [
  //     {
  //       key: "marketing-chat",
  //       icon: <CommentOutlined />, // AI chat
  //       label: <Link href="/admin/dashboard/ai/chat">Marketing Chat</Link>,
  //     },
  //     {
  //       key: "generated-product-descriptions",
  //       icon: <FileTextOutlined />, // Product descriptions
  //       label: (
  //         <Link href="/admin/dashboard/ai/descriptions">
  //           G Product Descriptions
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "generated-promo-text",
  //       icon: <ReadOutlined />, // Promo / ad copy
  //       label: <Link href="/admin/dashboard/ai/promos">G Promo Text</Link>,
  //     },
  //     {
  //       key: "generated-slogans",
  //       icon: <BulbOutlined />, // Creative slogans
  //       label: (
  //         <Link href="/admin/dashboard/ai/slogans">Generated Slogans</Link>
  //       ),
  //     },
  //     {
  //       key: "generation-history",
  //       icon: <HistoryOutlined />, // Past generations
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
  //   icon: <ThunderboltOutlined />, // Automation / triggers
  //   label: "Promotion Automation",
  //   children: [
  //     {
  //       key: "promotions",
  //       icon: <TagsOutlined />, // Discounts / offers
  //       label: <Link href="/admin/dashboard/promotions">Promotions</Link>,
  //     },
  //     {
  //       key: "create-promotion",
  //       icon: <PlusCircleOutlined />, // Create new promotion
  //       label: (
  //         <Link href="/admin/dashboard/promotions/create">
  //           Create Promotion
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "promotion-rules-builder",
  //       icon: <ApartmentOutlined />, // Rules / conditions builder
  //       label: (
  //         <Link href="/admin/dashboard/promotions/rules-builders">
  //           Promotion Rules Builder
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "promotion-calendar",
  //       icon: <CalendarOutlined />, // Scheduling promotions
  //       label: (
  //         <Link href="/admin/dashboard/promotions/calendar">
  //           Promotion Calendar
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "promotion-performance",
  //       icon: <LineChartOutlined />, // Performance analytics
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
  //   icon: <BarChartOutlined />, // Reports & Analytics
  //   label: "Reports & Analytics",
  //   children: [
  //     {
  //       key: "reports-overview",
  //       icon: <DashboardOutlined />, // Summary dashboard
  //       label: <Link href="/admin/dashboard/reports">Reports Overview</Link>,
  //     },
  //     {
  //       key: "sales-reports",
  //       icon: <LineChartOutlined />, // Sales trend
  //       label: <Link href="/admin/dashboard/reports/sales">Sales Reports</Link>,
  //     },
  //     {
  //       key: "order-reports",
  //       icon: <ShoppingCartOutlined />, // Orders
  //       label: (
  //         <Link href="/admin/dashboard/reports/orders">Order Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "inventory-reports",
  //       icon: <AppstoreOutlined />, // Inventory / stock
  //       label: (
  //         <Link href="/admin/dashboard/reports/inventory">
  //           Inventory Reports
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "supplier-reports",
  //       icon: <TeamOutlined />, // Suppliers
  //       label: (
  //         <Link href="/admin/dashboard/reports/suppliers">
  //           Supplier Reports
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "courier-reports",
  //       icon: <CarOutlined />, // Logistics
  //       label: (
  //         <Link href="/admin/dashboard/reports/couriers">Courier Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "expense-reports",
  //       icon: <WalletOutlined />, // Expenses
  //       label: (
  //         <Link href="/admin/dashboard/reports/expenses">Expense Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "financial-reports",
  //       icon: <DollarOutlined />, // Finance
  //       label: (
  //         <Link href="/admin/dashboard/reports/financial">
  //           Financial Reports
  //         </Link>
  //       ),
  //     },
  //     {
  //       key: "revenue-reports",
  //       icon: <RiseOutlined />, // Revenue growth
  //       label: (
  //         <Link href="/admin/dashboard/reports/revenue">Revenue Reports</Link>
  //       ),
  //     },
  //     {
  //       key: "profit-reports",
  //       icon: <RiseOutlined />, // Profit analysis
  //       label: (
  //         <Link href="/admin/dashboard/reports/profit">Profit Reports</Link>
  //       ),
  //     },
  //   ],
  // },

  // {
  //   key: "notifications",
  //   icon: <BellOutlined />,
  //   label: <Link href="/admin/dashboard/notifications">Notifications</Link>,
  // },

  {
    key: "billing",
    icon: <CreditCardOutlined />,
    label: "Billing",
    children: [
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
    ],
  },
];

export const items: MenuProps["items"] = allItems.filter(
  (item) => item && "key" in item && item.key != null,
);
