import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBooking, getAvailability, getBooking, getFeaturedListings, getListing, listListings, listMyBookings } from './bnbService'

export const useListings = (filters = {}, pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: ['bnb', 'listings', filters, pageSize],
    queryFn: ({ pageParam = 0 }) => listListings({ ...filters, offset: pageParam, limit: pageSize }),
    getNextPageParam: (lastPage, allPages) => (Array.isArray(lastPage) && lastPage.length === pageSize ? allPages.length * pageSize : undefined),
    staleTime: 5 * 60 * 1000,
  })
}

export const useListing = (id) => {
  return useQuery({
    queryKey: ['bnb', 'listing', id],
    queryFn: () => getListing(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAvailability = (id, params = {}) => {
  return useQuery({
    queryKey: ['bnb', 'listing', id, 'availability', params],
    queryFn: () => getAvailability(Number(id), params),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useFeaturedListings = (limit = 8) => {
  return useQuery({
    queryKey: ['bnb', 'featured', limit],
    queryFn: () => getFeaturedListings(limit),
    staleTime: 10 * 60 * 1000,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'listings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'my-bookings'] })
    },
  })
}

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['bnb', 'my-bookings'],
    queryFn: () => listMyBookings(),
    staleTime: 2 * 60 * 1000,
  })
}

export const useBooking = (id) => {
  return useQuery({
    queryKey: ['bnb', 'booking', id],
    queryFn: () => getBooking(Number(id)),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

const bnbHooks = {
  useListings,
  useListing,
  useAvailability,
  useFeaturedListings,
  useCreateBooking,
  useMyBookings,
  useBooking,
}

export default bnbHooks

