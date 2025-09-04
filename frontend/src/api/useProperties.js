import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getProperty, listProperties, searchProperties } from './propertyService'

export const useProperties = (filters = {}, pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: ['properties', filters, pageSize],
    queryFn: ({ pageParam }) => listProperties({ ...filters, cursor: pageParam, page_size: pageSize }),
    getNextPageParam: (lastPage) => (lastPage?.has_more ? lastPage.cursor : undefined),
    staleTime: 5 * 60 * 1000,
  })
}

export const useProperty = (id) => {
  return useQuery({
    queryKey: ['properties', 'detail', id],
    queryFn: () => getProperty(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useSearchProperties = (criteria = {}) => {
  return useQuery({
    queryKey: ['properties', 'search', criteria],
    queryFn: () => searchProperties(criteria),
    enabled: Object.keys(criteria || {}).length > 0,
    staleTime: 2 * 60 * 1000,
  })
}

const propertyHooks = {
  useProperties,
  useProperty,
  useSearchProperties,
}

export default propertyHooks

