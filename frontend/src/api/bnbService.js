import { axiosInstance, axiosPrivate } from './axios'

// Listings
export const searchListings = async (criteria = {}) => {
    const { data } = await axiosInstance.post('/bnb/search', criteria)
    return data
}

export const listListings = async (params = {}) => {
    const { data } = await axiosInstance.get('/bnb/listings', { params })
    return data
}

export const getListing = async (id) => {
    const { data } = await axiosInstance.get(`/bnb/listings/${id}`)
    return data
}

export const getAvailability = async (id, params = {}) => {
    const { data } = await axiosInstance.get(`/bnb/listings/${id}/availability`, { params })
    return data
}

export const getFeaturedListings = async (limit = 8) => {
    const { data } = await axiosInstance.get('/bnb/listings/featured', { params: { limit } })
    return data
}

export const getNearbyListings = async ({ latitude, longitude, radius_km = 10, limit = 8 }) => {
    const { data } = await axiosInstance.get('/bnb/listings/nearby', {
        params: { latitude, longitude, radius_km, limit }
    })
    return data
}

// Bookings
export const createBooking = async (payload) => {
    // POST with id=0 for create (handled server-side)
    const { data } = await axiosPrivate.post('/bnb/bookings', payload)
    return data
}

export const getBooking = async (id) => {
    const { data } = await axiosPrivate.get(`/bnb/bookings/${id}`)
    return data
}

export const listMyBookings = async () => {
    const { data } = await axiosPrivate.get('/bnb/my-bookings')
    return data
}

const bnbService = {
    searchListings,
    listListings,
    getListing,
    getAvailability,
    getFeaturedListings,
    getNearbyListings,
    createBooking,
    getBooking,
    listMyBookings,
}

export default bnbService


