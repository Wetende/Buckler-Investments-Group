import { QueryClient } from '@tanstack/react-query'

// Admin Query Client Setup
export const adminQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - admin data needs to be more fresh
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
    },
    mutations: {
      retry: false, // Don't retry mutations automatically
    },
  },
})
