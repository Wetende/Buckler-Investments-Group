import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  saveVehicle,
  deleteVehicle,
  searchVehicles,
  checkAvailability,
  listRentals,
  getRental,
  createRental,
  saveRental,
  getEarnings,
} from '../api/cars'
import { toast } from 'react-toastify'

export const useVehicles = (filters = {}) => useQuery({
  queryKey: ['admin','cars','vehicles', filters],
  queryFn: () => listVehicles(filters),
  staleTime: 2 * 60 * 1000,
})

export const useVehicle = (id) => useQuery({
  queryKey: ['admin','cars','vehicle', id],
  queryFn: () => getVehicle(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useSaveVehicle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','cars','vehicles'] })
      toast.success('Vehicle saved')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save'),
  })
}

export const useDeleteVehicle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','cars','vehicles'] })
      toast.success('Vehicle deleted')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to delete'),
  })
}

export const useCarRentals = (filters = {}) => useQuery({
  queryKey: ['admin','cars','rentals', filters],
  queryFn: () => listRentals(filters),
  staleTime: 2 * 60 * 1000,
})

export const useSaveCarRental = () => useMutation({ mutationFn: saveRental })

export const useCarEarnings = (filters = {}) => useQuery({
  queryKey: ['admin','cars','earnings', filters],
  queryFn: () => getEarnings(filters),
  staleTime: 60 * 1000,
})

// Additional vehicle hooks
export const useCreateVehicle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','cars','vehicles'] })
      toast.success('Vehicle created successfully')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to create vehicle'),
  })
}

export const useUpdateVehicle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','cars','vehicles'] })
      toast.success('Vehicle updated successfully')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to update vehicle'),
  })
}

export const useSearchVehicles = () => {
  return useMutation({
    mutationFn: searchVehicles,
    onError: (e) => toast.error(e.response?.data?.detail || 'Search failed'),
  })
}

export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: checkAvailability,
    onError: (e) => toast.error(e.response?.data?.detail || 'Availability check failed'),
  })
}

// Rental hooks
export const useRental = (id) => useQuery({
  queryKey: ['admin','cars','rental', id],
  queryFn: () => getRental(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useCreateRental = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createRental,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','cars','rentals'] })
      toast.success('Rental created successfully')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to create rental'),
  })
}

export default {
  useVehicles,
  useVehicle,
  useSaveVehicle,
  useDeleteVehicle,
  useCreateVehicle,
  useUpdateVehicle,
  useSearchVehicles,
  useCheckAvailability,
  useCarRentals,
  useRental,
  useCreateRental,
  useSaveCarRental,
  useCarEarnings,
}




