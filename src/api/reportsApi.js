import apiClient from './client'

export const reportsApi = {
  sales: (params) => apiClient.get('/reports/sales', { params }).then((r) => r.data),
  expenses: (params) => apiClient.get('/reports/expenses', { params }).then((r) => r.data),
  inventory: (params) => apiClient.get('/reports/inventory', { params }).then((r) => r.data),
  payroll: (params) => apiClient.get('/reports/payroll', { params }).then((r) => r.data),
  profitAndLoss: (params) =>
    apiClient.get('/reports/profit-and-loss', { params }).then((r) => r.data),
}
