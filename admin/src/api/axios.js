import axios from 'axios'

// Base URL from env or default local dev
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1')

let accessTokenMemory = null
let isRefreshing = false
let pendingQueue = []

const setAuthHeader = (config) => {
  if (!config.headers) config.headers = {}
  if (accessTokenMemory) {
    config.headers.Authorization = `Bearer ${accessTokenMemory}`
  }
  return config
}

export const getRefreshToken = () => {
  try {
    return localStorage.getItem('refresh_token')
  } catch (e) {
    return null
  }
}

export const setAuthTokens = ({ accessToken, refreshToken }) => {
  accessTokenMemory = accessToken || null
  if (refreshToken !== undefined && refreshToken !== null) {
    try {
      localStorage.setItem('refresh_token', refreshToken)
    } catch (e) {
      // ignore
    }
  }
}

export const clearAuthTokens = () => {
  accessTokenMemory = null
  try {
    localStorage.removeItem('refresh_token')
  } catch (e) {
    // ignore
  }
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const refreshTokens = async () => {
  const refresh_token = getRefreshToken()
  if (!refresh_token) throw new Error('No refresh token')
  const { data } = await axiosInstance.post('/auth/refresh', { refresh_token })
  setAuthTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
  return data.access_token
}

axiosPrivate.interceptors.request.use(async (config) => {
  if (!accessTokenMemory && getRefreshToken()) {
    try {
      await refreshTokens()
    } catch (e) {
      // continue; 401 handler will handle
    }
  }
  return setAuthHeader(config)
})

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosPrivate(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshTokens()
        pendingQueue.forEach((p) => p.resolve(newToken))
        pendingQueue = []
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosPrivate(originalRequest)
      } catch (refreshError) {
        pendingQueue.forEach((p) => p.reject(refreshError))
        pendingQueue = []
        isRefreshing = false
        clearAuthTokens()
        window.location.href = '/dashboard/auth-login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

