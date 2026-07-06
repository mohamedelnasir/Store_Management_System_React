import apiClient from './client'

export const inventoryApi = {
  history: (params) => apiClient.get('/inventory/history', { params }).then((r) => r.data),
  lowStock: (params) => apiClient.get('/inventory/low-stock', { params }).then((r) => r.data),
  adjust: (payload) => apiClient.post('/inventory/adjust', payload).then((r) => r.data),
}
