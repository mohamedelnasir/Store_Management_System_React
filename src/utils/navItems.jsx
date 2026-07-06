import {
  LayoutDashboard,
  Users,
  Tags,
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  UserSquare2,
  Wallet,
  BarChart3,
} from 'lucide-react'
import { ROLES } from './constants'

// Single source of truth for the sidebar. `roles` lists who can see the
// link at all; pages still guard themselves via RoleRoute independently.
export const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    to: '/pos',
    label: 'Point of Sale',
    icon: ShoppingCart,
    roles: [ROLES.CASHIER],
  },
  {
    to: '/products',
    label: 'Products',
    icon: Package,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  },
  {
    to: '/categories',
    label: 'Categories',
    icon: Tags,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    to: '/inventory',
    label: 'Inventory',
    icon: Boxes,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    to: '/sales',
    label: 'Sales History',
    icon: Receipt,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    to: '/expenses',
    label: 'Expenses',
    icon: Wallet,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    to: '/employees',
    label: 'Employees',
    icon: UserSquare2,
    roles: [ROLES.ADMIN],
  },
  {
    to: '/payroll',
    label: 'Payroll',
    icon: Wallet,
    roles: [ROLES.ADMIN],
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: BarChart3,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    to: '/users',
    label: 'Users',
    icon: Users,
    roles: [ROLES.ADMIN],
  },
]
