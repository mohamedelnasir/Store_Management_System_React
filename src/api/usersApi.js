import apiClient from './client'

export const usersApi = {
  list: (params) => apiClient.get('/users', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/users/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post('/users', payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/users/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/users/${id}`).then((r) => r.data),
}
