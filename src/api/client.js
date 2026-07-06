import axios from 'axios'
import toast from 'react-hot-toast'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralized error handling: surface backend `message`, and force
// logout + redirect on 401 (expired/invalid token).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'Something went wrong. Please try again.'

    if (status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
      if (!window.location.pathname.startsWith('/login')) {
        toast.error('Your session has expired. Please log in again.')
        window.location.href = '/login'
      }
    } else if (status !== undefined) {
      // Let callers decide whether to also show inline validation errors;
      // this toast covers the general case (network/server errors, 403, 404, 500).
      toast.error(message)
    } else {
      toast.error('Unable to reach the server. Check your connection.')
    }

    return Promise.reject(error)
  },
)

export default apiClient
