import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import {
  searchVehicles,
  listVehicles,
  getVehicle,
  getFeaturedVehicles,
  checkAvailability,
  createRental,
  getRental,
  getMyRentals,
  getVehicleCategories,
  getLocations,
  getVehicleReviews,
  createReview,
  updateReview,
  deleteReview
} from './carsService'

// Vehicle Listing & Search
export const useVehicles = (filters = {}) => {
  return useQuery({
    queryKey: ['cars', 'vehicles', filters],
    queryFn: () => listVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useVehiclesInfinite = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['cars', 'vehicles', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => listVehicles({
      ...filters,
      offset: pageParam,
      limit: 20
    }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length * 20 : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useVehiclesSearch = (criteria = {}) => {
  return useQuery({
    queryKey: ['cars', 'search', criteria],
    queryFn: () => searchVehicles(criteria),
    enabled: Object.keys(criteria || {}).length > 0,
    staleTime: 2 * 60 * 1000, // Shorter for search results
  })
}

export const useVehicle = (id) => {
  return useQuery({
    queryKey: ['cars', 'vehicle', id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFeaturedVehicles = (limit = 8) => {
  return useQuery({
    queryKey: ['cars', 'featured', limit],
    queryFn: () => getFeaturedVehicles(limit),
    staleTime: 10 * 60 * 1000, // Longer stale time for featured content
  })
}

// Availability & Booking
export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: (request) => checkAvailability(request),
  })
}

export const useCreateRental = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createRental(payload),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['cars', 'vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['cars', 'my-rentals'] })
    },
  })
}

export const useRental = (id) => {
  return useQuery({
    queryKey: ['cars', 'rental', id],
    queryFn: () => getRental(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useMyRentals = (params = {}) => {
  return useQuery({
    queryKey: ['cars', 'my-rentals', params],
    queryFn: () => getMyRentals(params),
    staleTime: 2 * 60 * 1000, // Shorter for user-specific data
  })
}

// Filters & Categories
export const useVehicleCategories = () => {
  return useQuery({
    queryKey: ['cars', 'categories'],
    queryFn: () => getVehicleCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change infrequently
  })
}

export const useLocations = () => {
  return useQuery({
    queryKey: ['cars', 'locations'],
    queryFn: () => getLocations(),
    staleTime: 30 * 60 * 1000, // 30 minutes - locations change infrequently
  })
}

// Reviews
export const useVehicleReviews = (vehicleId, params = {}) => {
  return useQuery({
    queryKey: ['cars', 'vehicle', vehicleId, 'reviews', params],
    queryFn: () => getVehicleReviews(vehicleId, params),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data, variables) => {
      // Update vehicle reviews cache
      queryClient.invalidateQueries({
        queryKey: ['cars', 'vehicle', variables.vehicle_id, 'reviews']
      })
      // Update vehicle data to reflect new review stats
      queryClient.invalidateQueries({
        queryKey: ['cars', 'vehicle', variables.vehicle_id]
      })
    },
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, data }) => updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'vehicle'] })
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'vehicle'] })
    },
  })
}

// Custom hooks for complex logic
export const useVehicleWithAvailability = (id, dates) => {
  const vehicle = useVehicle(id)
  const checkAvailabilityMutation = useCheckAvailability()

  const checkAvailability = (dates) => {
    if (id && dates.start_date && dates.end_date) {
      checkAvailabilityMutation.mutate({
        vehicle_id: id,
        start_date: dates.start_date,
        end_date: dates.end_date
      })
    }
  }

  return {
    vehicle: vehicle.data,
    availability: checkAvailabilityMutation.data,
    isLoadingVehicle: vehicle.isLoading,
    isCheckingAvailability: checkAvailabilityMutation.isLoading,
    isError: vehicle.isError || checkAvailabilityMutation.isError,
    checkAvailability,
  }
}

const carsHooks = {
  useVehicles,
  useVehiclesInfinite,
  useVehiclesSearch,
  useVehicle,
  useFeaturedVehicles,
  useCheckAvailability,
  useCreateRental,
  useRental,
  useMyRentals,
  useVehicleCategories,
  useLocations,
  useVehicleReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useVehicleWithAvailability,
}

export default carsHooks

