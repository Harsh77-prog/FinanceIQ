import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/* ---------- REQUEST INTERCEPTOR ---------- */
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* ---------- RESPONSE INTERCEPTOR ---------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ ONLY remove token
    // ❌ DO NOT redirect or reload page here
    if (error.response?.status === 401) {
      Cookies.remove('token')
    }

    return Promise.reject(error)
  }
)
