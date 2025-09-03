import { axiosInstance } from './axios'

export const searchProperties = async (criteria = {}) => {
    const { data } = await axiosInstance.post('/property/search', criteria)
    return data
}

export const listProperties = async (params = {}) => {
    const { data } = await axiosInstance.get('/property', { params })
    return data
}

export const getProperty = async (id) => {
    const { data } = await axiosInstance.get(`/property/${id}`)
    return data
}

export const getRecentlyListed = async (params = { page_size: 8 }) => {
    const { data } = await axiosInstance.get('/property/recently-listed', { params })
    return data
}

export default {
    searchProperties,
    listProperties,
    getProperty,
    getRecentlyListed,
}


