import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import bnbService, { 
  createBooking, 
  getAvailability, 
  getBooking, 
  getFeaturedListings, 
  getListing, 
  listListings, 
  listMyBookings, 
  getNearbyListings, 
  searchListings,
  cancelBooking,
  approveBooking,
  rejectBooking,
  createListing,
  updateListing,
  deleteListing
} from './bnbService'

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

export const useNearbyListings = ({ latitude, longitude, radius_km = 10, limit = 8 }, enabled = true) => {
  return useQuery({
    queryKey: ['bnb', 'nearby', { latitude, longitude, radius_km, limit }],
    queryFn: () => getNearbyListings({ latitude, longitude, radius_km, limit }),
    enabled: enabled && latitude != null && longitude != null,
    staleTime: 5 * 60 * 1000,
  })
}

export const useSearchListings = (criteria = {}, enabled = true) => {
  return useQuery({
    queryKey: ['bnb', 'search', criteria],
    queryFn: () => searchListings(criteria),
    enabled: enabled && Object.keys(criteria || {}).length > 0,
    staleTime: 2 * 60 * 1000,
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

export const useMyBookings = (enabled = true) => {
  return useQuery({
    queryKey: ['bnb', 'my-bookings'],
    queryFn: () => listMyBookings(),
    enabled,
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

// Host-related hooks
export const useHostDashboard = () => {
  return useQuery({
    queryKey: ['bnb', 'host', 'dashboard'],
    queryFn: () => bnbService.getHostDashboard(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useHostListings = () => {
  return useQuery({
    queryKey: ['bnb', 'host', 'listings'],
    queryFn: () => bnbService.getHostListings(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useHostBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['bnb', 'host', 'bookings', filters],
    queryFn: () => bnbService.getHostBookings(filters),
    staleTime: 2 * 60 * 1000,
  })
}

export const useHostEarnings = (period = 'month') => {
  return useQuery({
    queryKey: ['bnb', 'host', 'earnings', period],
    queryFn: () => bnbService.getHostEarnings(period),
    staleTime: 10 * 60 * 1000,
  })
}

// Booking management mutations
export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'my-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'booking'] })
    },
  })
}

export const useApproveBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId) => approveBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'host', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'booking'] })
    },
  })
}

export const useRejectBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId) => rejectBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'host', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'booking'] })
    },
  })
}

// Host listing management mutations
export const useCreateListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'host', 'listings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'listings'] })
    },
  })
}

export const useUpdateListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => updateListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'host', 'listings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'listings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'listing'] })
    },
  })
}

export const useDeleteListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId) => deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bnb', 'host', 'listings'] })
      queryClient.invalidateQueries({ queryKey: ['bnb', 'listings'] })
    },
  })
}

const bnbHooks = {
  useListings,
  useListing,
  useAvailability,
  useFeaturedListings,
  useNearbyListings,
  useSearchListings,
  useCreateBooking,
  useMyBookings,
  useBooking,
  useCancelBooking,
  useHostDashboard,
  useHostListings,
  useHostBookings,
  useHostEarnings,
  useApproveBooking,
  useRejectBooking,
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
}

export default bnbHooks

