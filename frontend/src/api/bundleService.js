import { axiosInstance, axiosPrivate } from './axios'

export const listBundles = async (params = {}) => {
    const { data } = await axiosInstance.get('/bundles', { params })
    return data
}

export const getBundle = async (id) => {
    const { data } = await axiosInstance.get(`/bundles/${id}`)
    return data
}

export const createBundle = async (payload) => {
    const { data } = await axiosPrivate.post('/bundles', payload)
    return data
}

export const getUserBundles = async (params = {}) => {
    const { data } = await axiosPrivate.get('/bundles/my-bundles', { params })
    return data
}

export const createBundleBooking = async (payload) => {
    const { data } = await axiosPrivate.post('/bundles/bookings', payload)
    return data
}

const bundleService = {
    listBundles,
    getBundle,
    createBundle,
    getUserBundles,
    createBundleBooking,
}

export default bundleService
