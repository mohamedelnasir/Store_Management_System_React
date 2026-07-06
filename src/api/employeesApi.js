import apiClient from './client'

export const employeesApi = {
  list: (params) => apiClient.get('/employees', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/employees/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post('/employees', payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/employees/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/employees/${id}`).then((r) => r.data),
}
