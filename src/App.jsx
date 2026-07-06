import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import { useAuth } from './hooks/useAuth'
import { ROLES } from './utils/constants'

import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import Categories from './pages/categories/Categories'
import Products from './pages/products/Products'
import Inventory from './pages/inventory/Inventory'
import PointOfSale from './pages/sales/PointOfSale'
import SalesHistory from './pages/sales/SalesHistory'
import InvoiceDetail from './pages/sales/InvoiceDetail'
import Expenses from './pages/expenses/Expenses'
import Employees from './pages/employees/Employees'
import Payroll from './pages/payroll/Payroll'
import PayslipDetail from './pages/payroll/PayslipDetail'
import Reports from './pages/reports/Reports'
import NotAuthorized from './pages/shared/NotAuthorized'
import NotFound from './pages/shared/NotFound'

const ADMIN = [ROLES.ADMIN]
const ADMIN_MANAGER = [ROLES.ADMIN, ROLES.MANAGER]
const ALL_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER]

function HomeRedirect() {
  const { role } = useAuth()
  return <Navigate to={role === ROLES.CASHIER ? '/pos' : '/dashboard'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeRedirect />} />

          {/* Products & POS are visible to all roles; page content itself
              adapts (read-only for cashiers, full CRUD for admin/manager). */}
          <Route element={<RoleRoute allow={ALL_ROLES} />}>
            <Route path="/products" element={<Products />} />
          </Route>

          <Route element={<RoleRoute allow={[ROLES.CASHIER]} />}>
            <Route path="/pos" element={<PointOfSale />} />
          </Route>

          <Route element={<RoleRoute allow={ADMIN_MANAGER} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<SalesHistory />} />
            <Route path="/sales/:id" element={<InvoiceDetail />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route element={<RoleRoute allow={ADMIN} />}>
            <Route path="/users" element={<Users />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/payroll/:id" element={<PayslipDetail />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
