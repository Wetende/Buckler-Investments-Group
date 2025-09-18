import { axiosPrivate, axiosInstance } from './axios'

export const getListingReviews = async (listingId) => {
  const { data } = await axiosInstance.get(`/api/v1/reviews/listing/${listingId}`)
  return data
}

export const createReview = async (payload) => {
  const { data } = await axiosPrivate.post('/api/v1/reviews', payload)
  return data
}

export const getMyReviews = async () => {
  const { data } = await axiosPrivate.get('/api/v1/reviews/my-reviews')
  return data
}

// Tours compatibility: add functions used by Tours pages
export const getTourReviews = async (tourId, params = {}) => {
  const { data } = await axiosInstance.get(`/api/v1/reviews/tours/${tourId}`, { params })
  return data
}

export const getTourReviewStats = async (tourId) => {
  const { data } = await axiosInstance.get(`/api/v1/reviews/tours/${tourId}/stats`)
  return data
}

export default {
  getListingReviews,
  createReview,
  getMyReviews,
  getTourReviews,
  getTourReviewStats,
}