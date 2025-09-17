import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import favoritesService from './favoritesService'

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesService.listFavorites(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ item_id, item_type, action }) => {
      if (action === 'add') {
        return favoritesService.addFavorite(item_id, item_type)
      } else {
        return favoritesService.removeFavorite(item_id, item_type)
      }
    },
    onMutate: async ({ item_id, item_type, action }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorites'] })

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData(['favorites'])

      // Optimistically update
      queryClient.setQueryData(['favorites'], (old) => {
        if (!old) return []
        
        if (action === 'add') {
          return [...old, { item_id, item_type, created_at: new Date().toISOString() }]
        } else {
          return old.filter(fav => !(fav.item_id === item_id && fav.item_type === item_type))
        }
      })

      return { previousFavorites }
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites)
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export default {
  useFavorites,
  useToggleFavorite,
}
