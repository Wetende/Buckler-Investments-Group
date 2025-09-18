import { axiosPrivate } from './axios'

// Payment API functions
export const initializePayment = async (payload) => {
    const { data } = await axiosPrivate.post('/payments/initialize', payload)
    return data
}

export const verifyPayment = async (paymentId) => {
    const { data } = await axiosPrivate.get(`/payments/${paymentId}/verify`)
    return data
}

export const getPaymentMethods = async () => {
    const { data } = await axiosPrivate.get('/payments/methods')
    return data
}

export const processCardPayment = async (payload) => {
    const { data } = await axiosPrivate.post('/payments/card', payload)
    return data
}

export const processMobilePayment = async (payload) => {
    const { data } = await axiosPrivate.post('/payments/mobile', payload)
    return data
}

export const getPaymentHistory = async (params = {}) => {
    const { data } = await axiosPrivate.get('/payments/history', { params })
    return data
}

export const refundPayment = async (paymentId, reason = '') => {
    const { data } = await axiosPrivate.post(`/payments/${paymentId}/refund`, { reason })
    return data
}

// Car rental specific payment functions
export const createRentalPayment = async (payload) => {
    const { data } = await axiosPrivate.post('/payments/rentals', {
        id: 0,
        ...payload
    })
    return data
}

export const completeRentalPayment = async (paymentId, paymentDetails) => {
    const { data } = await axiosPrivate.post(`/payments/rentals/${paymentId}/complete`, paymentDetails)
    return data
}

const paymentService = {
    initializePayment,
    verifyPayment,
    getPaymentMethods,
    processCardPayment,
    processMobilePayment,
    getPaymentHistory,
    refundPayment,
    createRentalPayment,
    completeRentalPayment,
}

export default paymentService