import { axiosInstance, axiosPrivate } from './axios'

export const getTourReviews = async (tourId, params = {}) => {
    const { data } = await axiosInstance.get(`/reviews/tour/${tourId}`, { params })
    return data
}

export const getTourReviewStats = async (tourId) => {
    const { data } = await axiosInstance.get(`/reviews/tour/${tourId}/stats`)
    return data
}

export const createTourReview = async (payload) => {
    const { data } = await axiosPrivate.post('/reviews/tour', payload)
    return data
}

export const getMyTourReviews = async (params = {}) => {
    const { data } = await axiosPrivate.get('/reviews/tour/my-reviews', { params })
    return data
}

const reviewsService = {
    getTourReviews,
    getTourReviewStats,
    createTourReview,
    getMyTourReviews,
}

export default reviewsService
