import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listProperties,
  getProperty,
  saveProperty,
  deleteProperty,
  listInquiries,
  getAnalytics,
} from '../api/properties'
import { toast } from 'react-toastify'

export const useProperties = (filters = {}) => useQuery({
  queryKey: ['admin','properties','list', filters],
  queryFn: () => listProperties(filters),
  staleTime: 2 * 60 * 1000,
})

export const useProperty = (id) => useQuery({
  queryKey: ['admin','properties','detail', id],
  queryFn: () => getProperty(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useSaveProperty = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','properties'] })
      toast.success('Property saved')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save'),
  })
}

export const useDeleteProperty = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','properties'] })
      toast.success('Property deleted')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to delete'),
  })
}

export const usePropertyInquiries = (filters = {}) => useQuery({
  queryKey: ['admin','properties','inquiries', filters],
  queryFn: () => listInquiries(filters),
  staleTime: 2 * 60 * 1000,
})

export const usePropertyAnalytics = (params = {}) => useQuery({
  queryKey: ['admin','properties','analytics', params],
  queryFn: () => getAnalytics(params),
  staleTime: 60 * 1000,
})

export default {
  useProperties,
  useProperty,
  useSaveProperty,
  useDeleteProperty,
  usePropertyInquiries,
  usePropertyAnalytics,
}




