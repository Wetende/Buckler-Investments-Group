import { axiosPrivate } from './axios'

export const createPayment = async (payload) => {
    const { data } = await axiosPrivate.post('/payments', payload)
    return data
}

export const getPaymentStatus = async (paymentId) => {
    const { data } = await axiosPrivate.get(`/payments/${paymentId}/status`)
    return data
}

export const getBookingPayments = async (bookingId) => {
    const { data } = await axiosPrivate.get(`/bookings/${bookingId}/payments`)
    return data
}

export const refundPayment = async (paymentId, payload) => {
    const { data } = await axiosPrivate.post(`/payments/${paymentId}/refund`, payload)
    return data
}

const paymentService = {
    createPayment,
    getPaymentStatus,
    getBookingPayments,
    refundPayment,
}

export default paymentService
