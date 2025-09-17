import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import reviewsService from './reviewsService'

export const useReviews = (listingId) => {
  return useQuery({
    queryKey: ['reviews', 'listing', listingId],
    queryFn: () => reviewsService.getListingReviews(listingId),
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => reviewsService.createReview(payload),
    onSuccess: (data, variables) => {
      // Invalidate listing reviews
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'listing', variables.listing_id] 
      })
      // Invalidate listing data to update average rating
      queryClient.invalidateQueries({ 
        queryKey: ['bnb', 'listing', variables.listing_id] 
      })
    },
  })
}

export default {
  useReviews,
  useCreateReview,
}
