import apiClient from './client'

export const payrollApi = {
  list: (params) => apiClient.get('/payroll', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/payroll/${id}`).then((r) => r.data),
  generate: (payload) => apiClient.post('/payroll/generate', payload).then((r) => r.data),
}
