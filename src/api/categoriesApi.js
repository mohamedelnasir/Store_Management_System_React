import apiClient from './client'

export const categoriesApi = {
  list: (params) => apiClient.get('/categories', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/categories/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post('/categories', payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/categories/${id}`).then((r) => r.data),
}
