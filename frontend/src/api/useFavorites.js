import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosPrivate } from './axios'

// Favorites API functions
const getFavorites = async (params = {}) => {
    const { data } = await axiosPrivate.get('/user/favorites', { params })
    return data
}

const addToFavorites = async (payload) => {
    const { data } = await axiosPrivate.post('/user/favorites', {
        id: 0, // Create new favorite
        ...payload
    })
    return data
}

const removeFromFavorites = async (payload) => {
    const { data } = await axiosPrivate.post('/user/favorites/remove', payload)
    return data
}

const toggleFavoriteItem = async (payload) => {
    const { data } = await axiosPrivate.post('/user/favorites/toggle', payload)
    return data
}

// React Query hooks
export const useFavorites = (filters = {}) => {
    return useQuery({
        queryKey: ['favorites', filters],
        queryFn: () => getFavorites(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
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