import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosPrivate } from './axios'

// Favorites API functions
const getFavorites = async (params = {}) => {
    const { data } = await axiosPrivate.get('/favorites', { params })
    return data
}

const addToFavorites = async (payload) => {
    const { data } = await axiosPrivate.post('/favorites', {
        property_id: payload.property_id || payload.id
    })
    return data
}

const removeFromFavorites = async (payload) => {
    const { data } = await axiosPrivate.get(`/favorites/${payload.property_id || payload.id}/delete`)
    return data
}

const toggleFavoriteItem = async (payload) => {
    // Check if item is favorited, then add or remove
    try {
        const favorites = await getFavorites()
        const isFavorited = favorites.some(fav => fav.property_id === (payload.property_id || payload.id))
        
        if (isFavorited) {
            return await removeFromFavorites(payload)
        } else {
            return await addToFavorites(payload)
        }
    } catch (error) {
        throw error
    }
}

// React Query hooks
export const useFavorites = (filters = {}, enabled = true) => {
    return useQuery({
        queryKey: ['favorites', filters],
        queryFn: () => getFavorites(filters),
        enabled: enabled, // Only run when explicitly enabled
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
            // Don't retry on authentication errors
            if (error?.response?.status === 401) {
                return false
            }
            return failureCount < 3
        },
    })
}

export const useToggleFavorite = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: toggleFavoriteItem,
        onSuccess: () => {
            // Invalidate favorites queries
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
            // Invalidate related entity queries that might show favorite status
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            queryClient.invalidateQueries({ queryKey: ['properties'] })
            queryClient.invalidateQueries({ queryKey: ['tours'] })
            queryClient.invalidateQueries({ queryKey: ['bnb'] })
        },
        onError: (error) => {
            console.error('Failed to toggle favorite:', error)
        }
    })
}

export const useAddToFavorites = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addToFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
        onError: (error) => {
            console.error('Failed to add to favorites:', error)
        }
    })
}

export const useRemoveFromFavorites = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: removeFromFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
        onError: (error) => {
            console.error('Failed to remove from favorites:', error)
        }
    })
}

const favoritesHooks = {
    useFavorites,
    useToggleFavorite,
    useAddToFavorites,
    useRemoveFromFavorites,
}

export default favoritesHooks