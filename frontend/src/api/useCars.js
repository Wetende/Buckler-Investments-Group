import { useMutation, useQuery } from '@tanstack/react-query'
import { createRental, searchVehicles } from './carsService'

export const useVehiclesSearch = (criteria = {}) => {
  return useQuery({
    queryKey: ['cars', 'search', criteria],
    queryFn: () => searchVehicles(criteria),
    enabled: Object.keys(criteria || {}).length > 0,
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateRental = () => {
  return useMutation({
    mutationFn: (payload) => createRental(payload),
  })
}

const carsHooks = {
  useVehiclesSearch,
  useCreateRental,
}

export default carsHooks

