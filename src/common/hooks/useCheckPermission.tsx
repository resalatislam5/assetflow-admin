import { useAppSelector } from '../../app/hooks/hooks';

export type permissionTags =
  | 'DASHBOARD'
  | 'ROLE'
  | 'USER'
  | 'APP_CONFIG'
  | 'AUDIT'
  | 'PRODUCT'
  | 'CATEGORY'
  | 'BRAND'
  | 'CUSTOMER'
  | 'INVOICE'
  | 'INVOICE_RETURN'
  | 'ORDER'
  | 'ORDER_RETURN'
  | 'MONEY_RECEIPT'
  | 'CUSTOMER_REFUND'
  | 'INVENTORY'
  | 'BRANCH'
  | 'WAREHOUSE'
  | 'STOCK_ADJUSTMENT'
  | 'STOCK_OPENING'
  | 'STOCK_TRANSFER'
  | 'STORE'
  | 'SUPPLIER'
  | 'PURCHASE'
  | 'PURCHASE_RETURN'
  | 'SUPPLIER_PAYMENT'
  | 'ACCOUNT'
  | 'ACCOUNT_HEAD'
  | 'BALANCE_TRANSFER'
  | 'BALANCE_ADJUSTMENT'
  | 'EXPENSE'
  | 'RECOVERY'
  | 'COUPON'
  | 'LOYALTY_POINT'
  | 'SUPPORT_TICKET'
  | 'GENERAL_JOURNAL'
  | 'GENERAL_LEDGER'
  | 'TRIAL_BALANCE'
  | 'INCOME_STATEMENT'
  | 'BALANCE_SHEET'
  | 'ACCOUNT_LEDGER'
  | 'ACCOUNT_TRANSACTION'
  | 'BALANCE_STATUS'
  | 'CUSTOMER_LEDGER_REPORT'
  | 'INVOICE_REPORT'
  | 'ORDER_REPORT'
  | 'EXPENSE_REPORT'
  | 'STOCK_REPORT'
  | 'STOCK_BATCH_REPORT'
  | 'DAMAGED_PRODUCT_REPORT'
  | 'COUNTRY'
  | 'DEPARTMENT'
  | 'DESIGNATION'
  | 'EMPLOYEE'
  | 'ATTENDANCE'
  | 'ADVANCE_PAYMENT'
  | 'BONUS'
  | 'DEDUCTION'
  | 'ADDITION'
  | 'PAYROLL'
  | 'ATTENDANCE_REPORT'
  | 'PAYROLL_REPORT'
  | 'COURSE'
  | 'PACKAGE'
  | 'PAYMENT'
  | 'REFUND'
  | 'PROMOTION'
  | 'POS_SALE'
  | 'PROFILE';

const DEFAULT_PERMISSION = {
  can_read: false,
  can_create: false,
  can_update: false,
  can_delete: false,
};

const useCheckPermission = (name: permissionTags) => {
  const permissions =
    useAppSelector((state) => state.auth?.user?.permissions) ?? [];

  const targetName =
    name === 'ORDER'
      ? 'INVOICE'
      : name === 'ORDER_RETURN'
      ? 'INVOICE_RETURN'
      : name === 'ORDER_REPORT'
      ? 'INVOICE_REPORT'
      : name;

  const perm = permissions.find(
    (p) => p.name === name || p.name === targetName,
  );

  return perm
    ? {
        can_read: Boolean(perm.can_read),
        can_create: Boolean(perm.can_create),
        can_update: Boolean(perm.can_update),
        can_delete: Boolean(perm.can_delete),
      }
    : DEFAULT_PERMISSION;
};

export default useCheckPermission;
