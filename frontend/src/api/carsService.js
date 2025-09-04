import { axiosInstance, axiosPrivate } from './axios'

export const searchVehicles = async (criteria = {}) => {
    const { data } = await axiosInstance.post('/cars/search', criteria)
    return data
}

export const createRental = async (payload) => {
    const { data } = await axiosPrivate.post('/cars/rentals', payload)
    return data
}

const carsService = {
    searchVehicles,
    createRental,
}

export default carsService


