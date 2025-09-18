import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listListings,
  getListing,
  saveListing,
  deleteListing,
  listBookings,
  getBooking,
  saveBooking,
  deleteBooking,
  getEarnings,
  listPayouts,
  requestPayout,
  listReviews,
  respondReview,
} from '../api/bnb'
import { toast } from 'react-toastify'

export const useBnbListings = (filters = {}) => useQuery({
  queryKey: ['admin','bnb','listings', filters],
  queryFn: () => listListings(filters),
  staleTime: 2 * 60 * 1000,
})

export const useBnbListing = (id) => useQuery({
  queryKey: ['admin','bnb','listing', id],
  queryFn: () => getListing(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useSaveBnbListing = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','bnb','listings'] })
      toast.success('Listing saved')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save'),
  })
}

export const useDeleteBnbListing = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','bnb','listings'] })
      toast.success('Listing deleted')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to delete'),
  })
}

export const useBnbBookings = (filters = {}) => useQuery({
  queryKey: ['admin','bnb','bookings', filters],
  queryFn: () => listBookings(filters),
  staleTime: 2 * 60 * 1000,
})

export const useSaveBnbBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','bnb','bookings'] })
      toast.success('Booking saved')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save'),
  })
}

export const useDeleteBnbBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','bnb','bookings'] })
      toast.success('Booking deleted')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to delete'),
  })
}

export const useBnbEarnings = (filters = {}) => useQuery({
  queryKey: ['admin','bnb','earnings', filters],
  queryFn: () => getEarnings(filters),
  staleTime: 60 * 1000,
})

export const useBnbPayouts = (filters = {}) => useQuery({
  queryKey: ['admin','bnb','payouts', filters],
  queryFn: () => listPayouts(filters),
  staleTime: 60 * 1000,
})

export const useRequestPayout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: requestPayout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','bnb','payouts'] })
      toast.success('Payout requested')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to request payout'),
  })
}

export const useBnbReviews = (filters = {}) => useQuery({
  queryKey: ['admin','bnb','reviews', filters],
  queryFn: () => listReviews(filters),
  staleTime: 2 * 60 * 1000,
})

export const useRespondReview = () => useMutation({
  mutationFn: respondReview,
})

export default {
  useBnbListings,
  useBnbListing,
  useSaveBnbListing,
  useDeleteBnbListing,
  useBnbBookings,
  useSaveBnbBooking,
  useDeleteBnbBooking,
  useBnbEarnings,
  useBnbPayouts,
  useRequestPayout,
  useBnbReviews,
  useRespondReview,
}




