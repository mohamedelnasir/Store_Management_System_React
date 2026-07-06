import apiClient from './client'

export const dashboardApi = {
  summary: () => apiClient.get('/dashboard').then((r) => r.data),
}
