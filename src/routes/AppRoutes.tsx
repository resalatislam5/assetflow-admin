import type { ReactNode } from 'react';
import type { permissionTags } from '../common/hooks/useCheckPermission';
import AccountList from '../modules/Account/Account/pages/AccountList';
import BalanceStatus from '../modules/Report/OnlyGetReport/pages/BalanceStatus';
import ViewBalanceTransfer from '../modules/Account/BalanceTransfer/components/ViewBalanceTransfer';
import BalanceTransferList from '../modules/Account/BalanceTransfer/pages/BalanceTransferList';
import BalanceAdjustmentList from '../modules/Account/BalanceAdjustment/pages/BalanceAdjustmentList';
import RoleList from '../modules/Administration/Role/pages/RoleList';
import UserList from '../modules/Administration/User/pages/UserList';
import BranchList from '../modules/Inventory/Branch/pages/BranchList';
import AppConfigList from '../modules/AppConfig/pages/AppConfigList';
import DepartmentList from '../modules/Configuration/Department/pages/DepartmentList';
import DesignationList from '../modules/Configuration/Designation/pages/DesignationList';
import CountryList from '../modules/Configuration/Country/pages/CountryList';
import CourseList from '../modules/Configuration/Course/pages/CourseList';
import PackageList from '../modules/Configuration/Package/pages/PackageList';
import Dashboard_V2 from '../modules/Dashboard/pages/Dashboard_V2';
import ProfileLayout from '../modules/Profile/layout/ProfileLayout';
import ChangePassword from '../modules/Profile/pages/ChangePassword';
import ProfileSettings from '../modules/Profile/pages/ProfileSetting';
import Themes from '../modules/Profile/pages/Themes';
import RecoveryList from '../modules/Recovery/pages/RecoveryList';
import AuditLogReport from '../modules/Report/AuditLog/pages/AuditLogReport';
import CustomerAuditLogReport from '../modules/Report/CustomerAuditLog/pages/CustomerAuditLogReport';
import AccountLedger from '../modules/Report/OnlyGetReport/pages/AccountLedger';
import AccountTransaction from '../modules/Report/OnlyGetReport/pages/AccountTransaction';
import ExpenseReport from '../modules/Report/OnlyGetReport/pages/ExpenseReport';
import InvoiceReport from '../modules/Report/InvoiceReport/pages/InvoiceReport';
import DamagedProductReport from '../modules/Report/DamagedProductReport/pages/DamagedProductReport';
import StockBatchReport from '../modules/Report/StockBatchReport/pages/StockBatchReport';
import ExpenseList from '../modules/Expense/pages/ExpenseList';
import AttendanceReport from '../modules/Report/OnlyGetReport/pages/AttendanceReport';
import AttendanceSummaryReport from '../modules/Report/OnlyGetReport/pages/AttendanceSummaryReport';
import PayrollReportList from '../modules/Report/PayrollReport/pages/PayrollReportList';
import EmployeeList from '../modules/Payroll/Employee/pages/EmployeeList';
import AttendanceList from '../modules/Payroll/Attendance/pages/AttendanceList';
import AdvancePaymentList from '../modules/Payroll/AdvancePayment/pages/AdvancePaymentList';
import BonusList from '../modules/Payroll/Bonus/pages/BonusList';
import GenerateBonusPage from '../modules/Payroll/Bonus/pages/GenerateBonusPage';
import DeductionList from '../modules/Payroll/Deduction/pages/DeductionList';
import GenerateDeductionPage from '../modules/Payroll/Deduction/pages/GenerateDeductionPage';
import AdditionList from '../modules/Payroll/Addition/pages/AdditionList';
import GenerateAdditionPage from '../modules/Payroll/Addition/pages/GenerateAdditionPage';
import PayrollList from '../modules/Payroll/PayrollList/pages/PayrollList';
import StoreList from '../modules/Store/pages/StoreList';
import CategoryList from '../modules/Catalog/Category/pages/CategoryList';
import BrandList from '../modules/Catalog/Brand/pages/BrandList';
import ProductList from '../modules/Catalog/Product/pages/ProductList';
import CreateProductPage from '../modules/Catalog/Product/pages/CreateProductPage';
import UpdateProductPage from '../modules/Catalog/Product/pages/UpdateProductPage';
import CustomerList from '../modules/Customer/pages/CustomerList';
import StockList from '../modules/Inventory/Stock/pages/StockList';
import StockAdjustList from '../modules/Inventory/StockAdjust/pages/StockAdjustList';
import StockTransferList from '../modules/Inventory/StockTransfer/pages/StockTransferList';
import WarehouseList from '../modules/Inventory/Warehouse/pages/WarehouseList';
import StockReportList from '../modules/Report/StockReport/pages/StockReportList';
import InvoiceList from '../modules/Invoice/CustomerInvoice/pages/InvoiceList';
import CreateInvoicePage from '../modules/Invoice/CustomerInvoice/pages/CreateInvoicePage';
import UpdateInvoicePage from '../modules/Invoice/CustomerInvoice/pages/UpdateInvoicePage';
import InvoiceDetailPage from '../modules/Invoice/CustomerInvoice/pages/InvoiceDetailPage';
import POSTerminalPage from '../modules/Invoice/POSTerminal/pages/POSTerminalPage';
import InvoiceReturnList from '../modules/Invoice/InvoiceReturn/pages/InvoiceReturnList';
import MoneyReceiptList from '../modules/Invoice/MoneyReceipt/pages/MoneyReceiptList';
import CustomerRefundList from '../modules/Invoice/CustomerRefund/pages/CustomerRefundList';
import CouponList from '../modules/Promotion/Coupon/pages/CouponList';
import LoyaltyPointList from '../modules/Promotion/LoyaltyPoint/pages/LoyaltyPointList';
import PromotionList from '../modules/Promotion/CampaignPromotion/pages/PromotionList';
import SupplierList from '../modules/Purchase/Supplier/pages/SupplierList';
import PurchaseList from '../modules/Purchase/PurchaseInvoice/pages/PurchaseList';
import PurchaseReturnList from '../modules/Purchase/PurchaseReturn/pages/PurchaseReturnList';
import SupplierPaymentList from '../modules/Purchase/SupplierPayment/pages/SupplierPaymentList';
import GeneralJournalReport from '../modules/Report/GeneralJournal/pages/GeneralJournalReport';
import GeneralLedgerReport from '../modules/Report/GeneralLedger/pages/GeneralLedgerReport';
import TrialBalanceReport from '../modules/Report/TrialBalance/pages/TrialBalanceReport';
import IncomeStatementReport from '../modules/Report/IncomeStatement/pages/IncomeStatementReport';
import BalanceSheetReport from '../modules/Report/BalanceSheet/pages/BalanceSheetReport';
import CustomerLedgerReport from '../modules/Report/CustomerLedger/pages/CustomerLedgerReport';
import PaymentList from '../modules/Payment/pages/PaymentList';
import RefundList from '../modules/Payment/pages/RefundList';

export interface IAppRoutes {
  path: string;
  element: ReactNode;
  name: permissionTags;
  isGuarded: boolean;
}

export const AppRoutes: IAppRoutes[] = [
  {
    path: '/',
    element: <Dashboard_V2 />,
    name: 'DASHBOARD',
    isGuarded: true,
  },
  {
    path: '/profile',
    element: (
      <ProfileLayout>
        <ProfileSettings />
      </ProfileLayout>
    ),
    name: 'PROFILE',
    isGuarded: false,
  },
  {
    path: '/profile/password',
    element: (
      <ProfileLayout>
        <ChangePassword />
      </ProfileLayout>
    ),
    name: 'PROFILE',
    isGuarded: false,
  },
  {
    path: '/profile/themes',
    element: (
      <ProfileLayout>
        <Themes />
      </ProfileLayout>
    ),
    name: 'PROFILE',
    isGuarded: false,
  },
  {
    path: '/recovery',
    element: <RecoveryList />,
    name: 'RECOVERY',
    isGuarded: true,
  },
  {
    path: '/account/account',
    element: <AccountList />,
    name: 'ACCOUNT',
    isGuarded: true,
  },
  {
    path: '/account/balance-adjustment',
    element: <BalanceAdjustmentList />,
    name: 'BALANCE_ADJUSTMENT',
    isGuarded: true,
  },
  {
    path: '/report/balance-status',
    element: <BalanceStatus />,
    name: 'BALANCE_STATUS',
    isGuarded: true,
  },
  {
    path: '/account/balance-transfer',
    element: <BalanceTransferList />,
    name: 'BALANCE_TRANSFER',
    isGuarded: true,
  },
  {
    path: '/account/balance-transfer/:id',
    element: <ViewBalanceTransfer />,
    name: 'BALANCE_TRANSFER',
    isGuarded: true,
  },
  {
    path: '/expenses',
    element: <ExpenseList />,
    name: 'EXPENSE',
    isGuarded: true,
  },
  {
    path: '/administration/roles',
    element: <RoleList />,
    name: 'ROLE',
    isGuarded: true,
  },
  {
    path: '/administration/user',
    element: <UserList />,
    name: 'USER',
    isGuarded: true,
  },
  {
    path: '/administration/branches',
    element: <BranchList />,
    name: 'BRANCH',
    isGuarded: true,
  },
  {
    path: '/configuration/country',
    element: <CountryList />,
    name: 'COUNTRY',
    isGuarded: true,
  },
  {
    path: '/configuration/course',
    element: <CourseList />,
    name: 'COURSE',
    isGuarded: true,
  },
  {
    path: '/configuration/package',
    element: <PackageList />,
    name: 'PACKAGE',
    isGuarded: true,
  },
  {
    path: '/configuration/app-config',
    element: <AppConfigList />,
    name: 'APP_CONFIG',
    isGuarded: true,
  },
  {
    path: '/configuration/department',
    element: <DepartmentList />,
    name: 'DEPARTMENT',
    isGuarded: true,
  },
  {
    path: '/configuration/designation',
    element: <DesignationList />,
    name: 'DESIGNATION',
    isGuarded: true,
  },
  {
    path: '/report/audit-log',
    element: <AuditLogReport />,
    name: 'AUDIT',
    isGuarded: true,
  },
  {
    path: '/report/customer-audit-log',
    element: <CustomerAuditLogReport />,
    name: 'AUDIT',
    isGuarded: true,
  },
  {
    path: '/report/account-ledger',
    element: <AccountLedger />,
    name: 'ACCOUNT_LEDGER',
    isGuarded: true,
  },
  {
    path: '/report/account-transaction',
    element: <AccountTransaction />,
    name: 'ACCOUNT_TRANSACTION',
    isGuarded: true,
  },
  {
    path: '/report/expense',
    element: <ExpenseReport />,
    name: 'EXPENSE_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/invoice',
    element: <InvoiceReport />,
    name: 'INVOICE_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/invoice-report',
    element: <InvoiceReport />,
    name: 'INVOICE_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/order',
    element: <InvoiceReport />,
    name: 'ORDER_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/order-report',
    element: <InvoiceReport />,
    name: 'ORDER_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/damaged-products',
    element: <DamagedProductReport />,
    name: 'DAMAGED_PRODUCT_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/damaged-product-report',
    element: <DamagedProductReport />,
    name: 'DAMAGED_PRODUCT_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/stock-batches',
    element: <StockBatchReport />,
    name: 'STOCK_BATCH_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/stock-batch-report',
    element: <StockBatchReport />,
    name: 'STOCK_BATCH_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/attendance',
    element: <AttendanceReport />,
    name: 'ATTENDANCE_REPORT',
    isGuarded: true,
  },
  {
    path: '/report/attendance-summary',
    element: <AttendanceSummaryReport />,
    name: 'ATTENDANCE_REPORT',
    isGuarded: true,
  },
  {
    path: '/payroll/employee',
    element: <EmployeeList />,
    name: 'EMPLOYEE',
    isGuarded: true,
  },
  {
    path: '/payroll/attendance',
    element: <AttendanceList />,
    name: 'ATTENDANCE',
    isGuarded: true,
  },
  {
    path: '/payroll/advance-payment',
    element: <AdvancePaymentList />,
    name: 'ADVANCE_PAYMENT',
    isGuarded: true,
  },
  {
    path: '/payroll/bonus',
    element: <BonusList />,
    name: 'BONUS',
    isGuarded: true,
  },
  {
    path: '/payroll/bonus/generate',
    element: <GenerateBonusPage />,
    name: 'BONUS',
    isGuarded: true,
  },
  {
    path: '/payroll/deduction',
    element: <DeductionList />,
    name: 'DEDUCTION',
    isGuarded: true,
  },
  {
    path: '/payroll/deduction/generate',
    element: <GenerateDeductionPage />,
    name: 'DEDUCTION',
    isGuarded: true,
  },
  {
    path: '/payroll/addition',
    element: <AdditionList />,
    name: 'ADDITION',
    isGuarded: true,
  },
  {
    path: '/payroll/addition/generate',
    element: <GenerateAdditionPage />,
    name: 'ADDITION',
    isGuarded: true,
  },
  {
    path: '/payroll/payroll-list',
    element: <PayrollList />,
    name: 'PAYROLL',
    isGuarded: true,
  },
  {
    path: '/store',
    element: <StoreList />,
    name: 'STORE',
    isGuarded: true,
  },
  {
    path: '/report/payroll-report',
    element: <PayrollReportList />,
    name: 'PAYROLL_REPORT',
    isGuarded: true,
  },
  {
    path: '/catalog/categories',
    element: <CategoryList />,
    name: 'CATEGORY',
    isGuarded: true,
  },
  {
    path: '/catalog/brands',
    element: <BrandList />,
    name: 'BRAND',
    isGuarded: true,
  },
  {
    path: '/catalog/products',
    element: <ProductList />,
    name: 'PRODUCT',
    isGuarded: true,
  },
  {
    path: '/catalog/products/create',
    element: <CreateProductPage />,
    name: 'PRODUCT',
    isGuarded: true,
  },
  {
    path: '/catalog/products/edit/:id',
    element: <UpdateProductPage />,
    name: 'PRODUCT',
    isGuarded: true,
  },
  {
    path: '/customer/customers',
    element: <CustomerList />,
    name: 'CUSTOMER',
    isGuarded: true,
  },
  {
    path: '/inventory',
    element: <StockList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/stocks',
    element: <StockList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/stock-adjust',
    element: <StockAdjustList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/stock-adjustments',
    element: <StockAdjustList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/stock-transfers',
    element: <StockTransferList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/warehouses',
    element: <WarehouseList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/branches',
    element: <BranchList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/report/stock-movement',
    element: <StockReportList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/inventory/logs',
    element: <StockReportList />,
    name: 'INVENTORY',
    isGuarded: true,
  },
  {
    path: '/pos',
    element: <POSTerminalPage />,
    name: 'POS_SALE',
    isGuarded: true,
  },
  {
    path: '/invoices/pos',
    element: <POSTerminalPage />,
    name: 'POS_SALE',
    isGuarded: true,
  },
  {
    path: '/invoices',
    element: <InvoiceList />,
    name: 'INVOICE',
    isGuarded: true,
  },
  {
    path: '/invoices/create',
    element: <CreateInvoicePage />,
    name: 'INVOICE',
    isGuarded: true,
  },
  {
    path: '/invoices/edit/:id',
    element: <UpdateInvoicePage />,
    name: 'INVOICE',
    isGuarded: true,
  },
  {
    path: '/invoices/money-receipts',
    element: <MoneyReceiptList />,
    name: 'MONEY_RECEIPT',
    isGuarded: true,
  },
  {
    path: '/invoices/customer-refunds',
    element: <CustomerRefundList />,
    name: 'CUSTOMER_REFUND',
    isGuarded: true,
  },
  {
    path: '/invoices/returns',
    element: <InvoiceReturnList />,
    name: 'INVOICE_RETURN',
    isGuarded: true,
  },
  {
    path: '/invoices/:id',
    element: <InvoiceDetailPage />,
    name: 'INVOICE',
    isGuarded: true,
  },
  {
    path: '/orders',
    element: <InvoiceList />,
    name: 'ORDER',
    isGuarded: true,
  },
  {
    path: '/orders/create',
    element: <CreateInvoicePage />,
    name: 'ORDER',
    isGuarded: true,
  },
  {
    path: '/orders/edit/:id',
    element: <UpdateInvoicePage />,
    name: 'ORDER',
    isGuarded: true,
  },
  {
    path: '/orders/money-receipts',
    element: <MoneyReceiptList />,
    name: 'ORDER',
    isGuarded: true,
  },
  {
    path: '/orders/customer-refunds',
    element: <CustomerRefundList />,
    name: 'CUSTOMER_REFUND',
    isGuarded: true,
  },
  {
    path: '/payments',
    element: <PaymentList />,
    name: 'PAYMENT',
    isGuarded: true,
  },
  {
    path: '/payments/refunds',
    element: <RefundList />,
    name: 'REFUND',
    isGuarded: true,
  },
  {
    path: '/orders/returns',
    element: <InvoiceReturnList />,
    name: 'ORDER',
    isGuarded: true,
  },
  {
    path: '/orders/:id',
    element: <InvoiceDetailPage />,
    name: 'ORDER',
    isGuarded: true,
  },
  {
    path: '/promotions/coupons',
    element: <CouponList />,
    name: 'COUPON',
    isGuarded: true,
  },
  {
    path: '/promotions/campaigns',
    element: <PromotionList />,
    name: 'PROMOTION',
    isGuarded: true,
  },
  {
    path: '/promotions/points',
    element: <LoyaltyPointList />,
    name: 'LOYALTY_POINT',
    isGuarded: true,
  },
  {
    path: '/purchases/invoices',
    element: <PurchaseList />,
    name: 'PURCHASE',
    isGuarded: true,
  },
  {
    path: '/purchases/returns',
    element: <PurchaseReturnList />,
    name: 'PURCHASE_RETURN',
    isGuarded: true,
  },
  {
    path: '/purchases/suppliers',
    element: <SupplierList />,
    name: 'SUPPLIER',
    isGuarded: true,
  },
  {
    path: '/purchases/payments',
    element: <SupplierPaymentList />,
    name: 'SUPPLIER_PAYMENT',
    isGuarded: true,
  },
  {
    path: '/report/general-journal',
    element: <GeneralJournalReport />,
    name: 'GENERAL_JOURNAL',
    isGuarded: true,
  },
  {
    path: '/report/general-ledger',
    element: <GeneralLedgerReport />,
    name: 'GENERAL_LEDGER',
    isGuarded: true,
  },
  {
    path: '/report/trial-balance',
    element: <TrialBalanceReport />,
    name: 'TRIAL_BALANCE',
    isGuarded: true,
  },
  {
    path: '/report/income-statement',
    element: <IncomeStatementReport />,
    name: 'INCOME_STATEMENT',
    isGuarded: true,
  },
  {
    path: '/report/balance-sheet',
    element: <BalanceSheetReport />,
    name: 'BALANCE_SHEET',
    isGuarded: true,
  },
  {
    path: '/report/customer-ledger',
    element: <CustomerLedgerReport />,
    name: 'CUSTOMER_LEDGER_REPORT',
    isGuarded: true,
  },
];
