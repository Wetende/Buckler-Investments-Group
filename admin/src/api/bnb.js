import { axiosPrivate } from './axios'

// BnB Listings
export const listListings = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/bnb/listings', { params })
  return data
}

export const getListing = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/bnb/listings/${Number(id)}`)
  return data
}

export const saveListing = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/bnb/listings', payload)
  return data
}

export const deleteListing = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/bnb/listings/${Number(id)}/delete`)
  return data
}

// Bookings
export const listBookings = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/bnb/bookings', { params })
  return data
}

export const getBooking = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/bnb/bookings/${Number(id)}`)
  return data
}

export const saveBooking = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/bnb/bookings', payload)
  return data
}

export const deleteBooking = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/bnb/bookings/${Number(id)}/delete`)
  return data
}

// Earnings / Payouts / Reviews
export const getEarnings = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/bnb/earnings', { params })
  return data
}

export const listPayouts = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/bnb/payouts', { params })
  return data
}

export const requestPayout = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/bnb/payouts', payload)
  return data
}

export const listReviews = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/bnb/reviews', { params })
  return data
}

export const respondReview = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/bnb/reviews', payload)
  return data
}

export default {
  // listings
  listListings,
  getListing,
  saveListing,
  deleteListing,
  // bookings
  listBookings,
  getBooking,
  saveBooking,
  deleteBooking,
  // earnings/payouts/reviews
  getEarnings,
  listPayouts,
  requestPayout,
  listReviews,
  respondReview,
}




