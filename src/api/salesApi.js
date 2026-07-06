import apiClient from './client'

export const salesApi = {
  list: (params) => apiClient.get('/sales', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/sales/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post('/sales', payload).then((r) => r.data),
}
