import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance, axiosPrivate } from './axios'
import axios from 'axios';

const API_BASE = '/api/v1';

// Auth API functions
const login = async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials)
    return data
}

const register = async (userData) => {
    const { data } = await axiosInstance.post('/auth/register', userData)
    return data
}

const logout = async () => {
    const { data } = await axiosPrivate.post('/auth/logout')
    return data
}

const getCurrentUser = async () => {
    const { data } = await axiosPrivate.get('/auth/me')
    return data
}

const refreshToken = async () => {
    const { data } = await axiosPrivate.post('/auth/refresh')
    return data
}

// React Query hooks
export const useAuth = () => {
    const queryClient = useQueryClient()

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            // Handle both email/password and phone login
            const response = await axiosInstance.post('/auth/login', credentials);
            const { access_token, user } = response.data;
            localStorage.setItem('authToken', access_token);
            return user;
        },
        onSuccess: (user) => {
            // Set user data in cache
            queryClient.setQueryData(['auth', 'user'], user);
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await axiosInstance.post('/auth/register', userData);
            const { access_token, user } = response.data;
            localStorage.setItem('authToken', access_token);
            return user;
        },
        onSuccess: (user) => {
            // Set user data in cache
            queryClient.setQueryData(['auth', 'user'], user);
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        },
    });

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        queryClient.setQueryData(['auth', 'user'], null);
        queryClient.clear();
    };

    // Refresh token mutation
    const refreshTokenMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosPrivate.post('/auth/refresh');
            const { access_token } = response.data;
            localStorage.setItem('authToken', access_token);
            return access_token;
        },
        onError: () => {
            logout();
        },
    });

    const getToken = () => localStorage.getItem('authToken');

    // Get current user query
    const { data: user, isLoading: userLoading, error } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: getCurrentUser,
        enabled: !!localStorage.getItem('authToken'), // Only run if token exists
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: false, // Don't retry auth failures
    })

    const isAuthenticated = !!user && !!localStorage.getItem('authToken')
    const isLoading = loginMutation.isPending || registerMutation.isPending || userLoading

    return { 
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout, 
        refreshToken: refreshTokenMutation.mutate, 
        getToken,
        user,
        isLoading,
        isAuthenticated,
        error
    };
}

export const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // Store token
            localStorage.setItem('authToken', data.access_token)
            // Set user data in cache
            queryClient.setQueryData(['auth', 'user'], data.user)
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
        },
        onError: (error) => {
            console.error('Login failed:', error)
        }
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            // Store token
            localStorage.setItem('authToken', data.access_token)
            // Set user data in cache
            queryClient.setQueryData(['auth', 'user'], data.user)
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
        },
        onError: (error) => {
            console.error('Registration failed:', error)
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Remove token
            localStorage.removeItem('authToken')
            // Clear user data from cache
            queryClient.setQueryData(['auth', 'user'], null)
            // Clear all cached data
            queryClient.clear()
        },
        onError: (error) => {
            console.error('Logout failed:', error)
            // Still clear local data even if server logout fails
            localStorage.removeItem('authToken')
            queryClient.setQueryData(['auth', 'user'], null)
        }
    })
}

export const useRefreshToken = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: refreshToken,
        onSuccess: (data) => {
            // Update token
            localStorage.setItem('authToken', data.access_token)
            // Invalidate user data to refetch with new token
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
        },
        onError: (error) => {
            console.error('Token refresh failed:', error)
            // Clear auth data on refresh failure
            localStorage.removeItem('authToken')
            queryClient.setQueryData(['auth', 'user'], null)
        }
    })
}

// useAuth is already exported above as named export
// Export useAuth as default for compatibility
export default useAuth

const authHooks = {
    useAuth,
    useLogin,
    useRegister,
    useLogout,
    useRefreshToken,
}

// Named export for the hooks object
export { authHooks }