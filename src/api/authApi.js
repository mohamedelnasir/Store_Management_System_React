import apiClient from './client'

export const authApi = {
  login: (payload) => apiClient.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => apiClient.post('/auth/register', payload).then((r) => r.data),
}
