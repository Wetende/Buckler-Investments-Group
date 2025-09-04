import { axiosInstance } from './axios'

export const searchTours = async (criteria = {}) => {
    const { data } = await axiosInstance.post('/tours/search', criteria)
    return data
}

export const listTours = async (params = {}) => {
    const { data } = await axiosInstance.get('/tours', { params })
    return data
}

export const getTour = async (id) => {
    const { data } = await axiosInstance.get(`/tours/${id}`)
    return data
}

export const getTourAvailability = async (id, params = {}) => {
    const { data } = await axiosInstance.get(`/tours/${id}/availability`, { params })
    return data
}

export const getFeaturedTours = async (limit = 8) => {
    const { data } = await axiosInstance.get('/tours/featured', { params: { limit } })
    return data
}

const toursService = {
    searchTours,
    listTours,
    getTour,
    getTourAvailability,
    getFeaturedTours,
}

export default toursService


