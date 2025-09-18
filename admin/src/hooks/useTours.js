import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUploadTourImages, useDeleteFile } from './useUploads'
import {
  // Tours Management
  listTours,
  getTour,
  saveTour,
  deleteTour,
  searchTours,
  getFeaturedTours,
  getTourCategories,
  getToursByCategory,
  getTourAvailability,
  updateTourAvailability,
  updateTourPricing,
  getMyTours,
  
  // Bookings Management
  listTourBookings,
  createTourBooking,
  getTourBooking,
  saveTourBooking,
  getMyTourBookings,
  modifyTourBooking,
  cancelTourBooking,
  confirmTourBooking,
  completeTourBooking,
  
  // Payment Management
  processTourPayment,
  getTourPaymentStatus,
  processTourRefund,
  
  // Communication
  sendTourMessage,
  getTourBookingMessages,
  getTourConversations,
  
  // Analytics & Dashboard
  getOperatorDashboard,
  getTourEarnings,
  getOperatorPayouts,
  
  // Reviews
  listTourReviews,
  respondTourReview,
  
} from '../api/tours'
import { toast } from 'react-toastify'

// =============================================================================
// TOURS MANAGEMENT HOOKS
// =============================================================================

export const useTours = (filters = {}) => useQuery({
  queryKey: ['admin','tours','list', filters],
  queryFn: () => listTours(filters),
  staleTime: 2 * 60 * 1000,
})

export const useTour = (id) => useQuery({
  queryKey: ['admin','tours','detail', id],
  queryFn: () => getTour(id),
  enabled: !!id,
  staleTime: 2 * 60 * 1000,
})

export const useMyTours = (operatorId = 1) => useQuery({
  queryKey: ['admin','tours','my-tours', operatorId],
  queryFn: () => getMyTours(operatorId),
  staleTime: 2 * 60 * 1000,
})

export const useFeaturedTours = (limit = 10) => useQuery({
  queryKey: ['admin','tours','featured', limit],
  queryFn: () => getFeaturedTours(limit),
  staleTime: 5 * 60 * 1000,
})

export const useTourCategories = () => useQuery({
  queryKey: ['admin','tours','categories'],
  queryFn: getTourCategories,
  staleTime: 30 * 60 * 1000, // Categories change rarely
})

export const useToursByCategory = (category, params = {}) => useQuery({
  queryKey: ['admin','tours','by-category', category, params],
  queryFn: () => getToursByCategory(category, params),
  enabled: !!category,
  staleTime: 2 * 60 * 1000,
})

export const useSearchTours = () => {
  return useMutation({
    mutationFn: searchTours,
    onError: (e) => toast.error(e.response?.data?.detail || 'Search failed'),
  })
}

// Tour CRUD mutations
export const useSaveTour = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveTour,
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin','tours'] })
      // Update specific tour in cache if it was an update
      if (variables.id && variables.id > 0) {
        qc.setQueryData(['admin','tours','detail', variables.id], data)
      }
      toast.success(variables.id === 0 ? 'Tour created successfully!' : 'Tour updated successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save tour'),
  })
}

export const useDeleteTour = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTour,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours'] })
      toast.success('Tour deleted successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to delete tour'),
  })
}

// =============================================================================
// TOUR AVAILABILITY & PRICING HOOKS
// =============================================================================

export const useTourAvailability = (tourId, startDate, endDate) => useQuery({
  queryKey: ['admin','tours','availability', tourId, startDate, endDate],
  queryFn: () => getTourAvailability(tourId, startDate, endDate),
  enabled: !!(tourId && startDate && endDate),
  staleTime: 5 * 60 * 1000,
})

export const useUpdateTourAvailability = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tourId, availabilityData }) => updateTourAvailability(tourId, availabilityData),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin','tours','availability', variables.tourId] })
      toast.success('Availability updated successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to update availability'),
  })
}

export const useUpdateTourPricing = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tourId, pricingData }) => updateTourPricing(tourId, pricingData),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin','tours','detail', variables.tourId] })
      toast.success('Pricing updated successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to update pricing'),
  })
}

// =============================================================================
// BOOKINGS MANAGEMENT HOOKS
// =============================================================================

export const useTourBookings = (filters = {}) => useQuery({
  queryKey: ['admin','tours','bookings', filters],
  queryFn: () => listTourBookings(filters),
  staleTime: 1 * 60 * 1000, // Bookings change frequently
})

export const useTourBooking = (bookingId) => useQuery({
  queryKey: ['admin','tours','booking', bookingId],
  queryFn: () => getTourBooking(bookingId),
  enabled: !!bookingId,
  staleTime: 1 * 60 * 1000,
})

export const useMyTourBookings = (customerId = 1) => useQuery({
  queryKey: ['admin','tours','my-bookings', customerId],
  queryFn: () => getMyTourBookings(customerId),
  staleTime: 1 * 60 * 1000,
})

export const useCreateTourBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTourBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      qc.invalidateQueries({ queryKey: ['admin','tours','my-bookings'] })
      toast.success('Booking created successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to create booking'),
  })
}

export const useSaveTourBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveTourBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      toast.success('Booking saved successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to save booking'),
  })
}

export const useModifyTourBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, modifications }) => modifyTourBooking(bookingId, modifications),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      qc.setQueryData(['admin','tours','booking', variables.bookingId], data)
      toast.success('Booking modified successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to modify booking'),
  })
}

export const useCancelTourBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cancelTourBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      toast.success('Booking cancelled successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to cancel booking'),
  })
}

export const useConfirmTourBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: confirmTourBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      toast.success('Booking confirmed successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to confirm booking'),
  })
}

export const useCompleteTourBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: completeTourBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      toast.success('Booking completed successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to complete booking'),
  })
}

// =============================================================================
// PAYMENT MANAGEMENT HOOKS
// =============================================================================

export const useTourPaymentStatus = (bookingId) => useQuery({
  queryKey: ['admin','tours','payment-status', bookingId],
  queryFn: () => getTourPaymentStatus(bookingId),
  enabled: !!bookingId,
  staleTime: 30 * 1000, // Payment status changes frequently
  refetchInterval: 5 * 1000, // Poll every 5 seconds for active payments
})

export const useProcessTourPayment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, paymentData }) => processTourPayment(bookingId, paymentData),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin','tours','payment-status', variables.bookingId] })
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      toast.success('Payment processed successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Payment processing failed'),
  })
}

export const useProcessTourRefund = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, refundData }) => processTourRefund(bookingId, refundData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','bookings'] })
      toast.success('Refund processed successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Refund processing failed'),
  })
}

// =============================================================================
// COMMUNICATION HOOKS
// =============================================================================

export const useTourBookingMessages = (bookingId) => useQuery({
  queryKey: ['admin','tours','messages', bookingId],
  queryFn: () => getTourBookingMessages(bookingId),
  enabled: !!bookingId,
  staleTime: 30 * 1000,
  refetchInterval: 10 * 1000, // Poll for new messages
})

export const useTourConversations = (userId = 1) => useQuery({
  queryKey: ['admin','tours','conversations', userId],
  queryFn: () => getTourConversations(userId),
  staleTime: 1 * 60 * 1000,
})

export const useSendTourMessage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, messageData }) => sendTourMessage(bookingId, messageData),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin','tours','messages', variables.bookingId] })
      qc.invalidateQueries({ queryKey: ['admin','tours','conversations'] })
      toast.success('Message sent successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to send message'),
  })
}

// =============================================================================
// ANALYTICS & DASHBOARD HOOKS
// =============================================================================

export const useOperatorDashboard = (operatorId = 1) => useQuery({
  queryKey: ['admin','tours','dashboard', operatorId],
  queryFn: () => getOperatorDashboard(operatorId),
  staleTime: 5 * 60 * 1000,
  refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
})

export const useTourEarnings = (operatorId = 1, period = 'month') => useQuery({
  queryKey: ['admin','tours','earnings', operatorId, period],
  queryFn: () => getTourEarnings(operatorId, period),
  staleTime: 2 * 60 * 1000,
})

export const useOperatorPayouts = (operatorId = 1, filters = {}) => useQuery({
  queryKey: ['admin','tours','payouts', operatorId, filters],
  queryFn: () => getOperatorPayouts(operatorId, filters),
  staleTime: 5 * 60 * 1000,
})

// =============================================================================
// REVIEWS MANAGEMENT HOOKS
// =============================================================================

export const useTourReviews = (filters = {}) => useQuery({
  queryKey: ['admin','tours','reviews', filters],
  queryFn: () => listTourReviews(filters),
  staleTime: 2 * 60 * 1000,
})

export const useRespondTourReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: respondTourReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin','tours','reviews'] })
      toast.success('Review response submitted successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to respond to review'),
  })
}

// =============================================================================
// FILE UPLOAD HOOKS
// =============================================================================

// Re-export from useUploads for convenience
export { useUploadTourImages } from './useUploads'

// Re-export from useUploads for convenience  
export { useDeleteFile as useDeleteTourImage } from './useUploads'

export default {
  // Tours Management
  useTours,
  useTour,
  useMyTours,
  useFeaturedTours,
  useTourCategories,
  useToursByCategory,
  useSearchTours,
  useSaveTour,
  useDeleteTour,
  
  // Availability & Pricing
  useTourAvailability,
  useUpdateTourAvailability,
  useUpdateTourPricing,
  
  // Bookings Management
  useTourBookings,
  useTourBooking,
  useMyTourBookings,
  useCreateTourBooking,
  useSaveTourBooking,
  useModifyTourBooking,
  useCancelTourBooking,
  useConfirmTourBooking,
  useCompleteTourBooking,
  
  // Payment Management
  useTourPaymentStatus,
  useProcessTourPayment,
  useProcessTourRefund,
  
  // Communication
  useTourBookingMessages,
  useTourConversations,
  useSendTourMessage,
  
  // Analytics & Dashboard
  useOperatorDashboard,
  useTourEarnings,
  useOperatorPayouts,
  
  // Reviews
  useTourReviews,
  useRespondTourReview,
  
  // File Upload
  useUploadTourImages,
  useDeleteTourImage,
}




