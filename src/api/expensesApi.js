import apiClient from './client'

export const expensesApi = {
  list: (params) => apiClient.get('/expenses', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/expenses/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post('/expenses', payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/expenses/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/expenses/${id}`).then((r) => r.data),
  monthlySummary: (params) =>
    apiClient.get('/expenses/monthly-summary', { params }).then((r) => r.data),
}
