import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listProducts,
  getProduct,
  saveProduct,
  deleteProduct,
  listOrders,
  getOrder,
  saveOrder,
  cancelOrder,
  getAnalytics,
} from '../api/investments'
import { toast } from 'react-toastify'

// Products
export const useInvestmentProducts = (filters = {}) => useQuery({
  queryKey: ['admin','investments','products', filters],
  queryFn: () => listProducts(filters),
  staleTime: 2 * 60 * 1000,
})

export const useInvestmentProduct = (id) => useQuery({
  queryKey: ['admin','investments','product', id],
  queryFn: () => getProduct(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useSaveInvestmentProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','investments','products'] })
      toast.success('Product saved')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save'),
  })
}

export const useDeleteInvestmentProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','investments','products'] })
      toast.success('Product deleted')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to delete'),
  })
}

// Orders
export const useInvestmentOrders = (filters = {}) => useQuery({
  queryKey: ['admin','investments','orders', filters],
  queryFn: () => listOrders(filters),
  staleTime: 2 * 60 * 1000,
})

export const useInvestmentOrder = (id) => useQuery({
  queryKey: ['admin','investments','order', id],
  queryFn: () => getOrder(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useSaveInvestmentOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','investments','orders'] })
      toast.success('Order saved')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save'),
  })
}

export const useCancelInvestmentOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','investments','orders'] })
      toast.success('Order cancelled')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to cancel'),
  })
}

// Analytics
export const useInvestmentAnalytics = (params = {}) => useQuery({
  queryKey: ['admin','investments','analytics', params],
  queryFn: () => getAnalytics(params),
  staleTime: 60 * 1000,
})

export default {
  useInvestmentProducts,
  useInvestmentProduct,
  useSaveInvestmentProduct,
  useDeleteInvestmentProduct,
  useInvestmentOrders,
  useInvestmentOrder,
  useSaveInvestmentOrder,
  useCancelInvestmentOrder,
  useInvestmentAnalytics,
}




