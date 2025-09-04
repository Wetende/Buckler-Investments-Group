import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getFeaturedTours, getTour, getTourAvailability, listTours, searchTours } from './toursService'

export const useTours = (filters = {}, pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: ['tours', filters, pageSize],
    queryFn: ({ pageParam = 0 }) => listTours({ ...filters, offset: pageParam, limit: pageSize }),
    getNextPageParam: (lastPage, allPages) => (Array.isArray(lastPage) && lastPage.length === pageSize ? allPages.length * pageSize : undefined),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTour = (id) => {
  return useQuery({
    queryKey: ['tours', 'detail', id],
    queryFn: () => getTour(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useTourAvailability = (id, params = {}) => {
  return useQuery({
    queryKey: ['tours', id, 'availability', params],
    queryFn: () => getTourAvailability(Number(id), params),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useFeaturedTours = (limit = 8) => {
  return useQuery({
    queryKey: ['tours', 'featured', limit],
    queryFn: () => getFeaturedTours(limit),
    staleTime: 10 * 60 * 1000,
  })
}

export const useSearchTours = (criteria = {}) => {
  return useQuery({
    queryKey: ['tours', 'search', criteria],
    queryFn: () => searchTours(criteria),
    enabled: Object.keys(criteria || {}).length > 0,
    staleTime: 2 * 60 * 1000,
  })
}

const toursHooks = {
  useTours,
  useTour,
  useTourAvailability,
  useFeaturedTours,
  useSearchTours,
}

export default toursHooks

