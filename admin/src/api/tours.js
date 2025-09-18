import { axiosPrivate } from './axios'
import { uploadTourImages as uploadTourImagesService, deleteFile } from './uploads'

// =============================================================================
// TOURS MANAGEMENT
// =============================================================================

// Basic Tours CRUD
export const listTours = async (params = {}) => {
  const { data } = await axiosPrivate.get('/api/v1/tours', { params })
  return data
}

export const getTour = async (id) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/${Number(id)}`)
  return data
}

export const saveTour = async (payload) => {
  const { data } = await axiosPrivate.post('/api/v1/tours', payload)
  return data
}

export const deleteTour = async (id) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/${Number(id)}/delete`)
  return data
}

// Tour Search & Categories
export const searchTours = async (criteria) => {
  const { data } = await axiosPrivate.post('/api/v1/tours/search', criteria)
  return data
}

export const getFeaturedTours = async (limit = 10) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/featured', { 
    params: { limit } 
  })
  return data
}

export const getTourCategories = async () => {
  const { data } = await axiosPrivate.get('/api/v1/tours/categories')
  return data
}

export const getToursByCategory = async (category, params = {}) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/categories/${category}/tours`, { params })
  return data
}

// Tour Availability & Pricing
export const getTourAvailability = async (tourId, startDate, endDate) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/${tourId}/availability`, {
    params: { start_date: startDate, end_date: endDate }
  })
  return data
}

export const updateTourAvailability = async (tourId, availabilityData) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/${tourId}/availability`, availabilityData)
  return data
}

export const updateTourPricing = async (tourId, pricingData) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/${tourId}/pricing`, pricingData)
  return data
}

// Operator Tours
export const getMyTours = async (operatorId = 1) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/my-tours', {
    params: { operator_id: operatorId }
  })
  return data
}

// =============================================================================
// TOUR BOOKINGS MANAGEMENT
// =============================================================================

// Customer Bookings
export const listTourBookings = async (params = {}) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/operator/bookings', { params })
  return data
}

export const createTourBooking = async (bookingData) => {
  const { data } = await axiosPrivate.post('/api/v1/tours/bookings', bookingData)
  return data
}

export const getTourBooking = async (bookingId) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/bookings/${bookingId}`)
  return data
}

export const saveTourBooking = async (payload) => {
  const { data } = await axiosPrivate.post('/api/v1/tours/bookings', payload)
  return data
}

export const getMyTourBookings = async (customerId = 1) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/my-bookings', {
    params: { customer_id: customerId }
  })
  return data
}

// Booking Modifications
export const modifyTourBooking = async (bookingId, modifications) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/bookings/${bookingId}/modify`, modifications)
  return data
}

export const cancelTourBooking = async (bookingId) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/bookings/${bookingId}/cancel`)
  return data
}

export const confirmTourBooking = async (bookingId) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/bookings/${bookingId}/confirm`)
  return data
}

export const completeTourBooking = async (bookingId) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/bookings/${bookingId}/complete`)
  return data
}

// =============================================================================
// PAYMENT MANAGEMENT
// =============================================================================

export const processTourPayment = async (bookingId, paymentData) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/bookings/${bookingId}/payment`, paymentData)
  return data
}

export const getTourPaymentStatus = async (bookingId) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/bookings/${bookingId}/payment-status`)
  return data
}

export const processTourRefund = async (bookingId, refundData) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/bookings/${bookingId}/refund`, refundData)
  return data
}

// =============================================================================
// COMMUNICATION & MESSAGING
// =============================================================================

export const sendTourMessage = async (bookingId, messageData) => {
  const { data } = await axiosPrivate.post(`/api/v1/tours/bookings/${bookingId}/messages`, messageData)
  return data
}

export const getTourBookingMessages = async (bookingId) => {
  const { data } = await axiosPrivate.get(`/api/v1/tours/bookings/${bookingId}/messages`)
  return data
}

export const getTourConversations = async (userId = 1) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/conversations', {
    params: { user_id: userId }
  })
  return data
}

// =============================================================================
// OPERATOR DASHBOARD & ANALYTICS
// =============================================================================

export const getOperatorDashboard = async (operatorId = 1) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/operator/dashboard', {
    params: { operator_id: operatorId }
  })
  return data
}

export const getTourEarnings = async (operatorId = 1, period = 'month') => {
  const { data } = await axiosPrivate.get('/api/v1/tours/operator/earnings', {
    params: { operator_id: operatorId, period }
  })
  return data
}

export const getOperatorPayouts = async (operatorId = 1, params = {}) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/operator/payouts', {
    params: { operator_id: operatorId, ...params }
  })
  return data
}

// =============================================================================
// REVIEWS MANAGEMENT
// =============================================================================

export const listTourReviews = async (params = {}) => {
  const { data } = await axiosPrivate.get('/api/v1/tours/reviews', { params })
  return data
}

export const respondTourReview = async (payload) => {
  const { data } = await axiosPrivate.post('/api/v1/tours/reviews', payload)
  return data
}

// =============================================================================
// FILE UPLOAD
// =============================================================================

export const uploadTourImages = async (tourId, files, onUploadProgress) => {
  return uploadTourImagesService(tourId, files, onUploadProgress)
}

export const deleteTourImage = async (imageId) => {
  return deleteFile(imageId)
}

export default {
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
  
  // File Upload
  uploadTourImages,
  deleteTourImage,
}




