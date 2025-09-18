import { axiosInstance, axiosPrivate } from './axios'

// Vehicle Search & Listing
export const searchVehicles = async (criteria = {}) => {
    const { data } = await axiosInstance.post('/cars/search', criteria)
    return data
}

export const listVehicles = async (params = {}) => {
    const { data } = await axiosInstance.get('/cars', { params })
    return data
}

export const getVehicle = async (id) => {
    const { data } = await axiosInstance.get(`/cars/${id}`)
    return data
}

export const getFeaturedVehicles = async (limit = 8) => {
    const { data } = await axiosInstance.get('/cars', {
        params: { limit, featured: true }
    })
    return data
}

// Availability & Booking
export const checkAvailability = async (request) => {
    const { data } = await axiosInstance.post('/cars/availability', request)
    return data
}

export const createRental = async (payload) => {
    const { data } = await axiosPrivate.post('/cars/rentals', payload)
    return data
}

export const getRental = async (id) => {
    const { data } = await axiosPrivate.get(`/cars/rentals/${id}`)
    return data
}

export const getMyRentals = async (params = {}) => {
    const { data } = await axiosPrivate.get('/cars/rentals', { params })
    return data
}

// Filters & Categories
export const getVehicleCategories = async () => {
    // Mock data for now - can be enhanced with real API endpoint later
    return [
        { value: 'economy', label: 'Economy', count: 45 },
        { value: 'compact', label: 'Compact', count: 32 },
        { value: 'suv', label: 'SUV', count: 28 },
        { value: 'luxury', label: 'Luxury', count: 15 },
        { value: 'van', label: 'Van', count: 12 },
        { value: '4x4', label: '4x4 Safari', count: 20 }
    ]
}

export const getLocations = async () => {
    // Mock data for now - can be enhanced with real API endpoint later
    return [
        { value: 'nairobi', label: 'Nairobi', count: 89 },
        { value: 'mombasa', label: 'Mombasa', count: 34 },
        { value: 'kisumu', label: 'Kisumu', count: 23 },
        { value: 'nakuru', label: 'Nakuru', count: 18 },
        { value: 'eldoret', label: 'Eldoret', count: 15 }
    ]
}

// Reviews
export const getVehicleReviews = async (vehicleId, params = {}) => {
    const { data } = await axiosInstance.get(`/cars/${vehicleId}/reviews`, { params })
    return data
}

export const createReview = async (payload) => {
    const { data } = await axiosPrivate.post('/cars/reviews', {
        id: 0, // Create new review
        ...payload
    })
    return data
}

export const updateReview = async (reviewId, payload) => {
    const { data } = await axiosPrivate.post('/cars/reviews', {
        id: reviewId, // Update existing review
        ...payload
    })
    return data
}

export const deleteReview = async (reviewId) => {
    const { data } = await axiosPrivate.get(`/cars/reviews/${reviewId}/delete`)
    return data
}

const carsService = {
    searchVehicles,
    listVehicles,
    getVehicle,
    getFeaturedVehicles,
    checkAvailability,
    createRental,
    getRental,
    getMyRentals,
  getVehicleCategories,
  getLocations,
  getVehicleReviews,
  createReview,
  updateReview,
  deleteReview,
}

export default carsService


