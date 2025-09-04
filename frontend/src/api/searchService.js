import { axiosInstance } from './axios'

export const unifiedSearch = async (payload) => {
    const { data } = await axiosInstance.post('/search/all', payload)
    return data
}

export const getSuggestions = async (query, limit = 10) => {
    const { data } = await axiosInstance.get('/search/suggestions', { params: { query, limit } })
    return data
}

export const getTrending = async () => {
    const { data } = await axiosInstance.get('/search/trending')
    return data
}

export const getFilters = async () => {
    const { data } = await axiosInstance.get('/search/filters')
    return data
}

const searchService = {
    unifiedSearch,
    getSuggestions,
    getTrending,
    getFilters,
}

export default searchService


