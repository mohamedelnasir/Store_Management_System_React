// Central place for enum <-> label mappings that mirror the backend's
// integer enums. If the backend enum changes, this is the only file to touch.

export const ROLES = {
  ADMIN: 0,
  MANAGER: 1,
  CASHIER: 2,
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.CASHIER]: 'Cashier',
}

export const ROLE_NAME_TO_VALUE = {
  Admin: ROLES.ADMIN,
  Manager: ROLES.MANAGER,
  Cashier: ROLES.CASHIER,
}

export const EXPENSE_CATEGORIES = {
  RENT: 0,
  UTILITIES: 1,
  SUPPLIES: 2,
  SALARIES: 3,
  MAINTENANCE: 4,
  MARKETING: 5,
  OTHER: 6,
}

export const EXPENSE_CATEGORY_LABELS = {
  [EXPENSE_CATEGORIES.RENT]: 'Rent',
  [EXPENSE_CATEGORIES.UTILITIES]: 'Utilities',
  [EXPENSE_CATEGORIES.SUPPLIES]: 'Supplies',
  [EXPENSE_CATEGORIES.SALARIES]: 'Salaries',
  [EXPENSE_CATEGORIES.MAINTENANCE]: 'Maintenance',
  [EXPENSE_CATEGORIES.MARKETING]: 'Marketing',
  [EXPENSE_CATEGORIES.OTHER]: 'Other',
}

export const INVENTORY_TRANSACTION_TYPES = {
  PURCHASE: 0,
  RETURN: 1,
  ADJUSTMENT: 2,
  DAMAGED: 3,
}

export const INVENTORY_TRANSACTION_LABELS = {
  [INVENTORY_TRANSACTION_TYPES.PURCHASE]: 'Purchase',
  [INVENTORY_TRANSACTION_TYPES.RETURN]: 'Return',
  [INVENTORY_TRANSACTION_TYPES.ADJUSTMENT]: 'Adjustment',
  [INVENTORY_TRANSACTION_TYPES.DAMAGED]: 'Damaged',
}

export const REPORT_TYPES = {
  SALES: 'sales',
  EXPENSES: 'expenses',
  INVENTORY: 'inventory',
  PAYROLL: 'payroll',
  PROFIT_AND_LOSS: 'profit-and-loss',
}

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.SALES]: 'Sales',
  [REPORT_TYPES.EXPENSES]: 'Expenses',
  [REPORT_TYPES.INVENTORY]: 'Inventory',
  [REPORT_TYPES.PAYROLL]: 'Payroll',
  [REPORT_TYPES.PROFIT_AND_LOSS]: 'Profit & Loss',
}

export const REPORT_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
}

export const TOKEN_STORAGE_KEY = 'sms_token'
export const USER_STORAGE_KEY = 'sms_user'
