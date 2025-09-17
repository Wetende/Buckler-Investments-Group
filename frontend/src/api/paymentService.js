import { axiosPrivate } from './axios'

// Create a payment intent following backend contract: POST /payments/intent
export const createPaymentIntent = async (payload) => {
    const { data } = await axiosPrivate.post('/payments/intent', payload)
    return data
}

// Get payment status (if exposed)
export const getPaymentStatus = async (paymentId) => {
    const { data } = await axiosPrivate.get(`/payments/${paymentId}/status`)
    return data
}

// Booking payments history (if/when backend exposes under payments domain)
export const getBookingPayments = async (bookingId) => {
    // Fallback: return empty until backend endpoint is added
    try {
        const { data } = await axiosPrivate.get(`/payments/bookings/${bookingId}`)
        return data
    } catch (e) {
        return []
    }
}

export const refundPayment = async (payload) => {
    const { data } = await axiosPrivate.post(`/payments/refund`, payload)
    return data
}

const paymentService = {
    createPaymentIntent,
    getPaymentStatus,
    getBookingPayments,
    refundPayment,
}

export default paymentService
