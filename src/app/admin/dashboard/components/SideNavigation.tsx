import {
    AlertOutlined,
    AppstoreAddOutlined,
    AppstoreOutlined,
    ArrowUpOutlined,
    AuditOutlined,
    BankOutlined,
    BarChartOutlined,
    BarcodeOutlined,
    BellOutlined,
    BranchesOutlined,
    CarOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    DollarOutlined,
    ExportOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    HistoryOutlined,
    HomeOutlined,
    IdcardOutlined,
    InboxOutlined,
    KeyOutlined,
    LineChartOutlined,
    PictureOutlined,
    PlusCircleOutlined,
    PlusSquareOutlined,
    ProfileOutlined,
    QuestionCircleOutlined,
    RiseOutlined,
    RollbackOutlined,
    SafetyOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    SwapOutlined,
    SyncOutlined,
    TagsOutlined,
    TeamOutlined,
    TrophyOutlined,
    UnorderedListOutlined,
    UploadOutlined,
    UserOutlined,
    WalletOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";

export    const items: MenuProps["items"] = [
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link href="/admin/dashboard">Dashboard</Link>,
        },
        {
            key: "companies",
            icon: <IdcardOutlined />,
            label: <Link href="/admin/dashboard/companies">Companies</Link>,
        },
        {
            key: "notifications",
            icon: <BellOutlined />,
            label: <Link href="/admin/dashboard/notifications">Notifications</Link>,
        },
        {
            key: "business",
            icon: <TeamOutlined />,
            label: "Business",
            children: [
                {
                    key: "profile",
                    icon: <ProfileOutlined />,
                    label: <Link href="/admin/dashboard/business/profile">Profile</Link>,
                },
                {
                    key: "branding",
                    icon: <AppstoreOutlined />,
                    label: <Link href="/admin/dashboard/business/branding">Branding</Link>,
                },
                {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: <Link href="/admin/dashboard/business/setting">Settings</Link>,
                },
                {
                    key: "usage-limit",
                    icon: <FileTextOutlined />,
                    label: <Link href="/admin/dashboard/business/usageLimit">Usage & Limit</Link>,
                },
            ],
        },
        {
            key: "billing",
            icon: <CreditCardOutlined />, // Billing / Payments
            label: "Billing",
            children: [
                {
                    key: "addons",
                    icon: <AppstoreAddOutlined />, // Add-ons / extras
                    label: <Link href="/admin/dashboard/billing/addons">Addons</Link>,
                },
                {
                    key: "history",
                    icon: <HistoryOutlined />, // Payment / invoice history
                    label: <Link href="/admin/dashboard/billing/history">History</Link>,
                },
                {
                    key: "subscription",
                    icon: <SyncOutlined />, // Subscription / recurring
                    label: <Link href="/admin/dashboard/billing/subscription">Subscription</Link>,
                },
                {
                    key: "upgrade-plan",
                    icon: <ArrowUpOutlined />, // Upgrade
                    label: <Link href="/admin/dashboard/billing/upgrade-plan">Upgrade Plan</Link>,
                },
            ],
        },
        {
            key: "User-Permission",
            icon: <SafetyOutlined />, // Permissions / access control
            label: "Users / Permission",
            children: [
                {
                    key: "users",
                    icon: <UserOutlined />, // Users list
                    label: (
                        <Link href="/admin/dashboard/users-permission/users">
                            Users
                        </Link>
                    ),
                },
                {
                    key: "roles",
                    icon: <TeamOutlined />, // Represents groups/roles
                    label: (
                        <Link href="/admin/dashboard/users-permission/roles">
                            Roles
                        </Link>
                    ),
                },
                {
                    key: "permission",
                    icon: <KeyOutlined />,
                    label: (
                        <Link href="/admin/dashboard/users-permission/permission">
                            Permission
                        </Link>
                    ),
                },
                {
                    key: "assignment",
                    icon: <FileTextOutlined />,
                    label: (
                        <Link href="/admin/dashboard/users-permission/assignment">
                            Assignment
                        </Link>
                    ),
                },
                {
                    key: "login-history",
                    icon: <HistoryOutlined />,
                    label: (
                        <Link href="/admin/dashboard/users-permission/login-history">
                            Login History
                        </Link>
                    ),
                },
                {
                    key: "activity-logs",
                    icon: <AuditOutlined />,
                    label: (
                        <Link href="/admin/dashboard/users-permission/activity-logs">
                            Activity Logs
                        </Link>
                    ),
                }
            ],
        },
        {
            key: "products-management",
            icon: <ShoppingOutlined />, // Product / inventory related
            label: "Products Management",
            children: [
                {
                    key: "products",
                    icon: <BarcodeOutlined />, // Individual products
                    label: (
                        <Link href="/admin/dashboard/products-management/products">
                            Products
                        </Link>
                    ),
                },
                {
                    key: "variant",
                    icon: <ProfileOutlined />,
                    label: (
                        <Link href="/admin/dashboard/products-management/variant">
                            Variant Manager
                        </Link>
                    ),
                },
                {
                    key: "status-history",
                    icon: <FileTextOutlined />,
                    label: (
                        <Link href="/admin/dashboard/products-management/status-history">
                            Status History
                        </Link>
                    ),
                },
                {
                    key: "top-selling",
                    icon: <BarChartOutlined />,
                    label: (
                        <Link href="/admin/dashboard/products-management/top-selling">
                            Top Selling
                        </Link>
                    ),
                },
                {
                    key: "image-manager",
                    icon: <PictureOutlined />,
                    label: (
                        <Link href="/admin/dashboard/products-management/image-manager">
                            Image Manager
                        </Link>
                    ),
                },
                {
                    key: "bulk-import",
                    icon: <UploadOutlined />,
                    label: (
                        <Link href="/admin/dashboard/products-management/bulk-import">
                            Bulk Import
                        </Link>
                    ),
                }
            ],
        },
        {
            key: "inventory",
            icon: <ShopOutlined />, // Inventory / store
            label: "Inventory",
            children: [
                {
                    key: "stock-overview",
                    icon: <DashboardOutlined />, // Overview / summary
                    label: (
                        <Link href="/admin/dashboard/inventory/stock-overview">
                            Stock Overview
                        </Link>
                    ),
                },
                {
                    key: "warehouse-stocks",
                    icon: <HomeOutlined />, // Warehouse
                    label: (
                        <Link href="/admin/dashboard/inventory/warehouse-stock">
                            Warehouse Stocks
                        </Link>
                    ),
                },
                {
                    key: "inventory-transactions",
                    icon: <SwapOutlined />, // In / out transactions
                    label: (
                        <Link href="/admin/dashboard/inventory/transactions">
                            Inventory Transactions
                        </Link>
                    ),
                },
                {
                    key: "stock-entry",
                    icon: <PlusSquareOutlined />, // Add stock
                    label: (
                        <Link href="/admin/dashboard/inventory/stock-entry">
                            Stock Entry
                        </Link>
                    ),
                },
                {
                    key: "stock-adjustments",
                    icon: <SettingOutlined />, // Adjust / configure
                    label: (
                        <Link href="/admin/dashboard/inventory/stock-adjustments">
                            Stock Adjustments
                        </Link>
                    ),
                },
                {
                    key: "stock-transfers",
                    icon: <ExportOutlined />, // Transfer between locations
                    label: (
                        <Link href="/admin/dashboard/inventory/stock-transfers">
                            Stock Transfers
                        </Link>
                    ),
                },
                {
                    key: "damaged-product",
                    icon: <WarningOutlined />, // Damaged / issue
                    label: (
                        <Link href="/admin/dashboard/inventory/damaged-products">
                            Damaged Products
                        </Link>
                    ),
                },
                {
                    key: "low-stock",
                    icon: <AlertOutlined />, // Low stock alert
                    label: (
                        <Link href="/admin/dashboard/inventory/low-stock-alert">
                            Low Stocks
                        </Link>
                    ),
                },
                {
                    key: "inventory-value",
                    icon: <DollarOutlined />, // Inventory value
                    label: (
                        <Link href="/admin/dashboard/inventory/value-report">
                            Inventory Value
                        </Link>
                    ),
                },
                {
                    key: "missing-products",
                    icon: <QuestionCircleOutlined />, // Missing items
                    label: (
                        <Link href="/admin/dashboard/inventory/missing-products">
                            Missing Products
                        </Link>
                    ),
                },
            ],
        },
        {
            key: "orders",
            icon: <ShopOutlined />, // Orders / Store
            label: "Orders",
            children: [
                {
                    key: "all-orders",
                    icon: <UnorderedListOutlined />, // Order list
                    label: (
                        <Link href="/admin/dashboard/orders">
                            All Orders
                        </Link>
                    ),
                },
                {
                    key: "returns",
                    icon: <RollbackOutlined />, // Returns / refunds
                    label: (
                        <Link href="/admin/dashboard/orders/returns">
                            Returns
                        </Link>
                    ),
                },
                {
                    key: "payments",
                    icon: <CreditCardOutlined />, // Payments
                    label: (
                        <Link href="/admin/dashboard/orders/payments">
                            Payments
                        </Link>
                    ),
                },
                {
                    key: "analytics",
                    icon: <LineChartOutlined />, // Order analytics
                    label: (
                        <Link href="/admin/dashboard/orders/analytics">
                            Analytics
                        </Link>
                    ),
                },
            ],
        },
        {
            key: "masters-settings",
            icon: <ShopOutlined />, // Orders / Store
            label: "Masters / Settings",
            children: [
                {
                    key: "Categories",
                    icon: <AppstoreOutlined />,
                    label: <Link href="/admin/dashboard/masters/categories">Categories</Link>,
                },
                {
                    key: "Brand-list",
                    icon: <TagsOutlined />,
                    label: <Link href="/admin/dashboard/masters/brands">Brands</Link>,
                },
                {
                    key: "Warehouse-list",
                    icon: <HomeOutlined />,
                    label: <Link href="/admin/dashboard/masters/warehouses">Warehouses</Link>,
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
        {
            key: "finance-account",
            icon: <BankOutlined />, // Finance / Accounts
            label: "Finance",
            children: [
                {
                    key: "accounts",
                    icon: <WalletOutlined />, // Accounts
                    label: (
                        <Link href="/admin/dashboard/finance/accounts">
                            Accounts
                        </Link>
                    ),
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
        {
            key: "finance-expense",
            icon: <DollarOutlined />, // Expenses
            label: "Finance / Expenses",
            children: [
                {
                    key: "expenses",
                    icon: <DollarOutlined />, // Expense list
                    label: (
                        <Link href="/admin/dashboard/finance/expenses">
                            Expenses
                        </Link>
                    ),
                },
                {
                    key: "categories",
                    icon: <TagsOutlined />, // Expense Categories
                    label: (
                        <Link href="/admin/dashboard/finance/accounts/expenses/categories">
                            Categories
                        </Link>
                    ),
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
        {
            key: "suppliers-procurement",
            icon: <ShopOutlined />, // Suppliers & Procurement
            label: "Suppliers & Procurement",
            children: [
                {
                    key: "supplier-products",
                    icon: <InboxOutlined />, // Products supplied by vendors
                    label: (
                        <Link href="/admin/dashboard/suppliers/supplier-products">
                            Supplier Products
                        </Link>
                    ),
                },
                {
                    key: "purchase-order",
                    icon: <FileTextOutlined />, // Purchase orders / documents
                    label: (
                        <Link href="/admin/dashboard/suppliers/purchase-order">
                            Purchase Order
                        </Link>
                    ),
                },
                {
                    key: "receive-po",
                    icon: <InboxOutlined />, // Receiving inventory
                    label: (
                        <Link href="/admin/dashboard/suppliers/receive-po">
                            Receive PO
                        </Link>
                    ),
                },
            ],
        },
        {
            key: "payment-gateway",
            icon: <CreditCardOutlined />, // Payment Gateway / Transactions
            label: "Payment Gateway",
            children: [
                {
                    key: "gateway-list",
                    icon: <UnorderedListOutlined />, // List of gateways
                    label: (
                        <Link href="/admin/dashboard/payment-gateway/gateways">
                            Gateway List
                        </Link>
                    ),
                },
                {
                    key: "gateway-config",
                    icon: <SettingOutlined />, // Configuration & setup
                    label: (
                        <Link href="/admin/dashboard/payment-gateway/configurations">
                            Gateway Config
                        </Link>
                    ),
                },
                {
                    key: "gateway-rules",
                    icon: <BranchesOutlined />, // Routing / rules logic
                    label: (
                        <Link href="/admin/dashboard/payment-gateway/gateway-rules">
                            Gateway Rules
                        </Link>
                    ),
                },
                {
                    key: "cod-settings",
                    icon: <DollarOutlined />, // Cash on Delivery
                    label: (
                        <Link href="/admin/dashboard/payment-gateway/cod-settings">
                            COD Settings
                        </Link>
                    ),
                },
            ],
        },
        {
            key: "invoices",
            icon: <FileDoneOutlined />, // Invoices / Billing
            label: "Invoices",
            children: [
                {
                    key: "invoice-list",
                    icon: <UnorderedListOutlined />, // Invoice list
                    label: (
                        <Link href="/admin/dashboard/invoices">
                            Invoices
                        </Link>
                    ),
                },
                {
                    key: "create-invoice",
                    icon: <PlusCircleOutlined />, // Create new invoice
                    label: (
                        <Link href="/admin/dashboard/invoices/create">
                            Create Invoice
                        </Link>
                    ),
                },
                {
                    key: "invoice-templates",
                    icon: <FileTextOutlined />, // Invoice templates
                    label: (
                        <Link href="/admin/dashboard/invoices/templates">
                            Invoice Templates
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
                    label: (
                        <Link href="/admin/dashboard/reports">
                            Reports Overview
                        </Link>
                    ),
                },
                {
                    key: "sales-reports",
                    icon: <LineChartOutlined />, // Sales trend
                    label: (
                        <Link href="/admin/dashboard/reports/sales">
                            Sales Reports
                        </Link>
                    ),
                },
                {
                    key: "order-reports",
                    icon: <ShoppingCartOutlined />, // Orders
                    label: (
                        <Link href="/admin/dashboard/reports/orders">
                            Order Reports
                        </Link>
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
                        <Link href="/admin/dashboard/reports/couriers">
                            Courier Reports
                        </Link>
                    ),
                },
                {
                    key: "expense-reports",
                    icon: <WalletOutlined />, // Expenses
                    label: (
                        <Link href="/admin/dashboard/reports/expenses">
                            Expense Reports
                        </Link>
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
                        <Link href="/admin/dashboard/reports/revenue">
                            Revenue Reports
                        </Link>
                    ),
                },
                {
                    key: "profit-reports",
                    icon: <RiseOutlined />, // Profit analysis
                    label: (
                        <Link href="/admin/dashboard/reports/profit">
                            Profit Reports
                        </Link>
                    ),
                },
            ],
        }

    ];
